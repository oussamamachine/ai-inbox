import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    index: true
  },
  source: { 
    type: String, 
    required: true,
    enum: ['gmail', 'slack', 'whatsapp', 'instagram', 'linkedin', 'sms', 'twitter', 'telegram', 'other'],
    index: true
  },
  sender: { 
    type: String,
    trim: true
  },
  subject: { 
    type: String,
    trim: true
  },
  body: { 
    type: String,
    required: true
  },
  ai_summary: { 
    type: String 
  },
  ai_reply: { 
    type: String 
  },
  metadata: { 
    type: Object,
    default: {}
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'replied', 'archived'],
    default: 'unread',
    index: true
  },
  replySent: {
    type: Boolean,
    default: false
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true
  }
});

// Compound index for efficient queries
messageSchema.index({ user: 1, createdAt: -1 });
messageSchema.index({ user: 1, source: 1 });

export default mongoose.model('Message', messageSchema);
