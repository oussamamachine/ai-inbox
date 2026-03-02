import Message from '../models/Message.js';
import { generateSummary, suggestReply } from '../utils/openai.js';

// POST /api/messages - Webhook endpoint for n8n and external services
export async function receiveMessage(req, res, next) {
  try {
    const { source, sender, subject, body, userId, metadata } = req.body;
    
    // Validation
    if (!source || !body) {
      return res.status(400).json({ message: 'source and body are required' });
    }

    // Validate source
    const validSources = ['gmail', 'slack', 'whatsapp', 'instagram', 'linkedin', 'sms', 'twitter', 'telegram', 'other'];
    if (!validSources.includes(source)) {
      return res.status(400).json({ 
        message: `Invalid source. Must be one of: ${validSources.join(', ')}` 
      });
    }

    // Create message
    const message = await Message.create({ 
      user: userId || null, 
      source, 
      sender, 
      subject, 
      body, 
      metadata: metadata || {},
      status: 'unread'
    });

    // Generate AI content asynchronously (best-effort)
    // In production, consider using a queue (Bull, BullMQ) for this
    const hasAIKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
    if (hasAIKey) {
      Promise.all([
        generateSummary(body),
        suggestReply(body)
      ])
        .then(async ([summary, reply]) => {
          message.ai_summary = summary;
          message.ai_reply = reply;
          await message.save();
          console.log(`✨ AI generated for message ${message._id}`);
        })
        .catch(err => {
          console.warn('AI generation failed:', err?.message || err);
        });
    } else {
      console.log('⚠️ No AI key configured. Set GROQ_API_KEY or OPENAI_API_KEY in .env');
    }

    res.status(201).json({ 
      message: 'Message received successfully', 
      data: message 
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/messages - List messages for authenticated user
export async function listMessages(req, res, next) {
  try {
    const userId = req.user?.id;
    const { source, status, limit = 100, skip = 0 } = req.query;
    
    const filter = {};
    if (userId) filter.user = userId;
    if (source) filter.source = source;
    if (status) filter.status = status;

    const messages = await Message.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Message.countDocuments(filter);

    res.json({ 
      data: messages,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip)
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/messages/:id - Get single message
export async function getMessage(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const filter = { _id: id };
    if (userId) filter.user = userId;

    const message = await Message.findOne(filter);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Mark as read
    if (message.status === 'unread') {
      message.status = 'read';
      await message.save();
    }

    res.json({ data: message });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/messages/:id - Update message status
export async function updateMessage(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;

    const validStatuses = ['unread', 'read', 'replied', 'archived'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    const filter = { _id: id };
    if (userId) filter.user = userId;

    const message = await Message.findOneAndUpdate(
      filter,
      { status },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ 
      message: 'Message updated successfully',
      data: message 
    });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/messages/:id - Delete message
export async function deleteMessage(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const filter = { _id: id };
    if (userId) filter.user = userId;

    const message = await Message.findOneAndDelete(filter);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    next(err);
  }
}

// POST /api/messages/:id/regenerate - Regenerate AI content
export async function regenerateAI(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const filter = { _id: id };
    if (userId) filter.user = userId;

    const message = await Message.findOne(filter);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Regenerate AI content
    const [summary, reply] = await Promise.all([
      generateSummary(message.body),
      suggestReply(message.body)
    ]);

    message.ai_summary = summary;
    message.ai_reply = reply;
    await message.save();

    res.json({ 
      message: 'AI content regenerated successfully',
      data: message 
    });
  } catch (err) {
    next(err);
  }
}
