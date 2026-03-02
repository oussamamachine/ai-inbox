import Message from '../models/Message.js';
import { 
  sendSMS, 
  sendSlackMessage, 
  sendWhatsAppMessage,
  sendGmail,
  sendLinkedInMessage,
  sendTwitterDM
} from '../utils/messaging.js';

// POST /api/messages/:id/reply - Send a reply via the message's original source
export async function sendReply(req, res, next) {
  try {
    const { id } = req.params;
    const { replyText } = req.body;
    const userId = req.user?.id;

    if (!replyText) {
      return res.status(400).json({ message: 'replyText is required' });
    }

    const filter = { _id: id };
    if (userId) filter.user = userId;

    const message = await Message.findOne(filter);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    let result = { success: false, error: null };

    try {
      // DEMO MODE: If no real API credentials are configured, simulate reply sending
      const demoMode = !process.env.TWILIO_ACCOUNT_SID && !process.env.SLACK_BOT_TOKEN;
      
      if (demoMode) {
        // Simulate successful reply in demo mode
        console.log(`📤 [DEMO MODE] Reply simulated for ${message.source}: "${replyText.substring(0, 50)}..."`);
        result = { 
          success: true, 
          demo: true,
          message: 'Reply simulated successfully (demo mode - no real API configured)'
        };
      } else {
        // Real API mode - try to send via actual platform APIs
        switch (message.source) {
          case 'sms':
            // Send SMS via Twilio
            if (!message.sender) {
              throw new Error('No phone number found for SMS reply');
            }
            result = await sendSMS(message.sender, replyText);
            break;

          case 'slack':
            // Send Slack message
            const channel = message.metadata?.channel || message.sender;
            const threadTs = message.metadata?.timestamp;
            result = await sendSlackMessage(channel, replyText, threadTs);
            break;

          case 'whatsapp':
            // Send WhatsApp message via Cloud API
            if (!message.sender) {
              throw new Error('No phone number found for WhatsApp reply');
            }
            result = await sendWhatsAppMessage(message.sender, replyText);
            break;

          case 'gmail':
            // Send email via Gmail API
            const accessToken = message.metadata?.accessToken || req.body.accessToken;
            if (!accessToken) {
              throw new Error('Gmail access token required for reply');
            }
            result = await sendGmail(
              message.sender,
              message.subject ? `Re: ${message.subject}` : 'Reply',
              replyText,
              accessToken
            );
            break;

          case 'linkedin':
            // Send LinkedIn message
            const linkedInAccessToken = message.metadata?.accessToken || req.body.accessToken;
            const conversationId = message.metadata?.conversationId;
            if (!linkedInAccessToken) {
              throw new Error('LinkedIn access token required for reply');
            }
            result = await sendLinkedInMessage(
              linkedInAccessToken,
              conversationId,
              replyText
            );
            break;

          case 'twitter':
            // Send Twitter DM
            const twitterAccessToken = message.metadata?.accessToken || req.body.accessToken;
            const twitterAccessSecret = message.metadata?.accessSecret || req.body.accessSecret;
            const recipientId = message.metadata?.senderId;
            if (!twitterAccessToken || !twitterAccessSecret) {
              throw new Error('Twitter credentials required for reply');
            }
            result = await sendTwitterDM(
              twitterAccessToken,
              twitterAccessSecret,
              recipientId,
              replyText
            );
            break;

          case 'instagram':
            // Instagram requires Instagram Graph API
            return res.status(501).json({ 
              message: 'Instagram replies not yet implemented',
              instructions: 'Configure Instagram Graph API to enable replies'
            });

          default:
            return res.status(400).json({ 
              message: `Reply not supported for source: ${message.source}` 
            });
        }
      }

      // Update message status
      message.status = 'replied';
      message.replySent = true;
      message.metadata = {
        ...message.metadata,
        lastReply: {
          text: replyText,
          sentAt: new Date(),
          result: result
        }
      };
      await message.save();

      res.json({
        message: result.demo 
          ? '✅ Reply saved! (Demo mode - configure real API credentials to send actual replies)' 
          : 'Reply sent successfully',
        data: {
          messageId: message._id,
          source: message.source,
          result: result,
          demo: result.demo || false
        }
      });

    } catch (sendError) {
      console.error('Error sending reply:', sendError);
      return res.status(500).json({
        message: 'Failed to send reply',
        error: sendError.message
      });
    }

  } catch (err) {
    next(err);
  }
}

// POST /api/messages/:id/reply-with-ai - Send the AI-suggested reply
export async function sendAIReply(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const filter = { _id: id };
    if (userId) filter.user = userId;

    const message = await Message.findOne(filter);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (!message.ai_reply) {
      return res.status(400).json({ 
        message: 'No AI reply available for this message' 
      });
    }

    // Use the AI-generated reply
    req.body.replyText = message.ai_reply;
    return sendReply(req, res, next);

  } catch (err) {
    next(err);
  }
}
