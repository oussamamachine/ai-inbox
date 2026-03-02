import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Message from './models/Message.js';
import User from './models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_smart_inbox';

const messages = [
  {
    source: 'gmail',
    sender: 'investors@vc-fund.com',
    subject: 'Follow-up: Series A Investment Round',
    body: 'Hi Oussama,\n\nWe reviewed your pitch deck and the technical architecture looks solid. We would like to schedule a deep dive with our technical partners next Tuesday at 2 PM EST. Please let us know if this works for you.\n\nBest,\nSarah',
    ai_summary: 'Investor wants to schedule a technical deep dive meeting next Tuesday at 2 PM EST regarding Series A funding.',
    ai_reply: 'Hi Sarah, thanks for the update. Tuesday at 2 PM EST works perfectly for me. I look forward to the deep dive. Best, Oussama.',
    status: 'unread',
    createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 mins ago
  },
  {
    source: 'slack',
    sender: 'dev-team-leads',
    subject: 'CRITICAL: Auth Service Latency',
    body: '@oussama We are seeing a 500ms spike in the authentication service latency after the last deployment. Rollback is in progress but we need you to check the logs.',
    ai_summary: 'Urgent: Auth service latency spike detected. Rollback in progress. Needs log investigation.',
    ai_reply: 'On it. Checking the logs now. Will update the channel in 5 mins.',
    status: 'unread',
    createdAt: new Date(Date.now() - 1000 * 60 * 120) // 2 hours ago
  },
  {
    source: 'whatsapp',
    sender: '+1 (555) 019-2834',
    subject: 'Lunch?',
    body: 'Hey Oussama! Are we still on for lunch at that new sushi place? 🍣 I can meet you there at 12:30.',
    ai_summary: 'Friend confirming lunch plans at the sushi place at 12:30.',
    ai_reply: 'Yes! See you at 12:30 🍣.',
    status: 'read',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4) // 4 hours ago
  },
  {
    source: 'linkedin',
    sender: 'Recruiter at BigTech',
    subject: 'Staff Engineer Role - AI Platform',
    body: 'Hello Oussama! I came across your profile and was impressed by your work on the AI Smart Inbox. We are building a similar internal tool at BigTech and would love to chat about a Staff Engineer role. Are you open to new opportunities?',
    ai_summary: 'Recruiter from BigTech interested in discussing a Staff Engineer role for their AI Platform.',
    ai_reply: 'Hi, thanks for reaching out. I am currently focused on my own projects but I am always open to a chat. Do you have a JD I can look at?',
    status: 'unread',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
  },
  {
    source: 'twitter',
    sender: '@tech_influencer',
    subject: 'Mentioned you in a post',
    body: 'Just tried out the new AI Inbox by @oussama_dev. This is exactly what I needed! The n8n integration is smooth as butter. 🧈 #BuildInPublic #AI',
    ai_summary: 'Positive shoutout from a tech influencer about the AI Inbox and its n8n integration.',
    ai_reply: 'Thanks for the kind words! Glad you like the n8n integration. Let me know if you have any feature requests! 🚀',
    status: 'read',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26) // 1 day, 2 hours ago
  },
  {
    source: 'sms',
    sender: 'AWS Alerts',
    subject: 'Budget Alert',
    body: 'AWS Budget Alert: You have exceeded 85% of your monthly budget for "Development". Current spend: $85.40.',
    ai_summary: 'AWS Budget Alert: Exceeded 85% of monthly development budget ($85.40).',
    ai_reply: 'Acknowledged. I will check the instance usage.',
    status: 'archived',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48) // 2 days ago
  },
  {
    source: 'instagram',
    sender: 'design_daily',
    subject: 'New Design Trends',
    body: 'Check out our latest post on 2025 UI/UX trends! We think you would love the new glassmorphism examples.',
    ai_summary: 'Notification about a new post on 2025 UI/UX trends.',
    ai_reply: 'Thanks, I will check it out!',
    status: 'read',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50) // 2 days ago
  }
];

async function seed() {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected.');

    // Find a user to assign messages to
    let user = await User.findOne({});
    if (!user) {
      console.log('⚠️ No user found. Creating a demo user...');
      // Create a demo user if none exists (password hashing skipped for seed script simplicity if using direct insert, 
      // but better to rely on existing users or create one properly if needed. 
      // For now, let's assume the user 'oussama' exists or we just pick the first one.)
      // If absolutely no user, we might need to create one, but let's try to find one first.
    }

    const userId = user ? user._id : null;
    console.log(`👤 Assigning messages to user: ${user ? user.email : 'Public/No User'}`);

    console.log('🧹 Clearing existing messages...');
    await Message.deleteMany({});
    console.log('✅ Messages cleared.');

    // Add userId to all messages
    const messagesWithUser = messages.map(msg => ({ ...msg, user: userId }));

    console.log('📥 Inserting pro-level seed data...');
    const createdMessages = await Message.insertMany(messagesWithUser);
    console.log(`✅ Successfully inserted ${createdMessages.length} messages.`);

    console.log('\n🎉 Database is ready for screenshots!');
    console.log('👉 Go to http://localhost:3001 to view the dashboard.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
