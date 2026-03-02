// AI Smart Inbox - Professional Demo Data Generator
// Creates realistic messages from ALL platforms for screenshots & presentations

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

// Import models
const MessageSchema = new mongoose.Schema({
  source: String,
  sender: String,
  subject: String,
  body: String,
  ai_summary: String,
  suggested_reply: String,
  status: { type: String, default: 'unread' },
  userId: mongoose.Schema.Types.ObjectId,
  metadata: Object,
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', MessageSchema);

// Professional demo messages for ALL platforms
const demoMessages = [
  // === GMAIL MESSAGES ===
  {
    source: 'gmail',
    sender: 'sarah.johnson@techcorp.com',
    subject: '📊 Q1 Budget Review - Action Required',
    body: 'Hi Team,\n\nI hope this email finds you well. We need to schedule our Q1 budget review meeting for next week.\n\nAgenda:\n• Budget allocations review\n• Expense reports analysis\n• Q2 forecasting and projections\n• Resource allocation planning\n\nPlease share your availability for Tuesday or Wednesday afternoon. The meeting is expected to last 90 minutes.\n\nLooking forward to your valuable input.\n\nBest regards,\nSarah Johnson\nFinance Director',
    ai_summary: '📊 Budget review meeting needed next week. Team input required for Q1 analysis and Q2 planning. Tuesday/Wednesday preferred, 90-minute duration.',
    suggested_reply: 'Hi Sarah, I\'m available on Tuesday afternoon from 2-4 PM. Looking forward to the budget review discussion. I\'ll prepare our team\'s expense report.',
    status: 'unread',
    metadata: { priority: 'high', category: 'work', platform_icon: '📧' }
  },
  {
    source: 'gmail',
    sender: 'james.wilson@innovateai.com',
    subject: '🤝 Partnership Proposal - AI Integration',
    body: 'Hello,\n\nI came across your AI Smart Inbox project and I\'m thoroughly impressed with the approach you\'ve taken.\n\nWe\'re a Series B startup (backed by Sequoia) specializing in enterprise AI solutions. Your unified inbox concept aligns perfectly with our vision.\n\nI\'d love to discuss:\n• Potential white-label partnership\n• API integration opportunities\n• Joint go-to-market strategy\n\nAre you available for a call next week? Happy to work around your schedule.\n\nBest,\nJames Wilson\nHead of Business Development',
    ai_summary: '🤝 Series B startup interested in partnership. Sequoia-backed company wants to discuss white-label opportunities and API integration.',
    suggested_reply: 'Hi James, Thank you for reaching out! I\'m definitely interested in exploring partnership opportunities. I\'m available next Wednesday or Thursday. Let me know what works for you.',
    status: 'unread',
    metadata: { priority: 'high', category: 'business', platform_icon: '📧' }
  },
  {
    source: 'gmail',
    sender: 'tech.recruiter@faang.com',
    subject: '💼 Senior Software Engineer - AI/ML Team',
    body: 'Hi,\n\nYour profile caught our attention for a Senior Software Engineer position on our AI/ML team.\n\nRole Highlights:\n• Location: Remote (US) or Hybrid (SF/Seattle)\n• Base: $180-220K + RSUs\n• Team: Building next-gen AI products\n• Stack: React, Node.js, Python, TensorFlow\n\nYour experience with AI integration and full-stack development makes you a strong fit. Interested in learning more?\n\nBest regards,\nTech Recruiting Team',
    ai_summary: '💼 FAANG recruiting for Senior Engineer role. Remote option, $180-220K + equity, AI/ML team focus. Strong stack match.',
    suggested_reply: 'Thank you for reaching out! I\'m interested in learning more about the role and the team. Could we schedule a brief introductory call?',
    status: 'unread',
    metadata: { priority: 'medium', category: 'career', platform_icon: '📧' }
  },

  // === LINKEDIN MESSAGES ===
  {
    source: 'linkedin',
    sender: 'Michael Chen - CTO @ InnovateLabs',
    subject: '💼 Connection Request Accepted',
    body: 'Hi there!\n\nThanks for connecting! I saw your recent post about AI-powered automation and I\'m really impressed with your work on the unified inbox project.\n\nWe\'re building similar AI solutions at InnovateLabs for enterprise clients. Would love to exchange ideas about:\n\n• AI model selection for production\n• Scaling considerations\n• Cost optimization strategies\n\nAre you open to a virtual coffee chat? I think we could learn a lot from each other.\n\nCheers,\nMichael',
    ai_summary: '💼 CTO wants to connect about AI automation. Interested in technical discussion on model selection, scaling, and optimization.',
    suggested_reply: 'Hi Michael! I\'d love to connect and share insights. How about next Friday at 10 AM? Always happy to discuss AI architecture with fellow builders.',
    status: 'unread',
    metadata: { priority: 'medium', category: 'networking', platform_icon: '💼' }
  },
  {
    source: 'linkedin',
    sender: 'Emma Rodriguez - Product Manager @ TechFlow',
    subject: '🚀 Your AI Smart Inbox is Amazing!',
    body: 'Hey!\n\nI just came across your AI Smart Inbox project on GitHub and I\'m blown away! 🤯\n\nWe\'re working on a unified communication platform at TechFlow, and your approach to AI summarization is exactly what we\'ve been trying to figure out.\n\nWould you be open to:\n• A technical collaboration?\n• Or perhaps consulting for our team?\n• Or even full-time opportunity?\n\nWe\'re well-funded (Series A, $15M) and growing fast. Let me know if you\'re interested!\n\n- Emma',
    ai_summary: '🚀 Product Manager impressed with project. Series A startup interested in collaboration, consulting, or full-time role.',
    suggested_reply: 'Hi Emma! Thanks for the kind words! I\'m definitely open to exploring opportunities. Let\'s schedule a call to discuss how I might be able to help TechFlow.',
    status: 'unread',
    metadata: { priority: 'high', category: 'opportunity', platform_icon: '💼' }
  },

  // === SLACK MESSAGES ===
  {
    source: 'slack',
    sender: 'Alex Thompson',
    subject: '#engineering - Production Deployment',
    body: '@channel 🚀 Production deployment scheduled for tonight at 11 PM EST.\n\nPre-deployment checklist:\n✅ All PRs merged and approved\n✅ Integration tests passing\n✅ Database migrations tested\n⏳ Final QA in progress\n\n30-minute maintenance window expected. Rollback plan ready if needed.\n\nPlease confirm you\'ve completed your tasks below 👇',
    ai_summary: '🚀 Production deployment tonight at 11 PM EST. 30-min maintenance window. Team confirmation needed on completed tasks.',
    suggested_reply: '✅ My PRs are all merged and tested. Ready for deployment!',
    status: 'unread',
    metadata: { priority: 'high', category: 'work', channel: 'engineering', platform_icon: '💬' }
  },
  {
    source: 'slack',
    sender: 'Maria Garcia',
    subject: '#design - UI Mockups Ready',
    body: 'Hey team! 🎨\n\nJust uploaded the new UI mockups for the dashboard redesign to Figma!\n\nKey changes:\n• Modern card-based layout\n• Dark mode support\n• Improved mobile responsiveness\n• New color palette\n\nWould love your feedback before tomorrow\'s client presentation. Link in the channel description.\n\nCC: @alex @john @sarah',
    ai_summary: '🎨 New dashboard UI mockups ready in Figma. Feedback needed before client presentation tomorrow. Modern design with dark mode.',
    suggested_reply: 'Looks great Maria! The dark mode is 🔥. Just left some comments in Figma.',
    status: 'unread',
    metadata: { priority: 'medium', category: 'work', channel: 'design', platform_icon: '💬' }
  },

  // === WHATSAPP MESSAGES ===
  {
    source: 'whatsapp',
    sender: '+1 (555) 234-5678',
    subject: 'Client Meeting Tomorrow',
    body: 'Hey! 👋\n\nQuick question about tomorrow\'s client meeting at 2 PM:\n\nShould I prepare the product demo or are you handling it?\n\nAlso, do we need to prepare slides or is it just a live demo?\n\nLet me know ASAP so I can prepare accordingly.\n\nThanks!',
    ai_summary: '👋 Needs clarification on tomorrow\'s 2 PM client meeting. Asking about demo preparation and slide requirements.',
    suggested_reply: 'I\'ll handle the demo. You can prepare a few slides covering the use cases and pricing. Thanks for checking!',
    status: 'unread',
    metadata: { priority: 'high', category: 'work', platform_icon: '📱' }
  },
  {
    source: 'whatsapp',
    sender: 'Mom ❤️',
    subject: 'Family Dinner',
    body: 'Hi sweetheart! 😊\n\nJust reminding you about Sunday dinner at 7 PM. Your sister is bringing her new boyfriend, so please be nice! 😅\n\nI\'m making your favorite - lasagna! 🍝\n\nLove you!\nMom ❤️',
    ai_summary: '😊 Mom reminding about Sunday dinner at 7 PM. Sister bringing boyfriend. Lasagna planned.',
    suggested_reply: 'Can\'t wait Mom! I\'ll be there. Should I bring dessert? Love you too! ❤️',
    status: 'unread',
    metadata: { priority: 'low', category: 'personal', platform_icon: '📱' }
  },

  // === INSTAGRAM DMS ===
  {
    source: 'instagram',
    sender: '@techinfluencer',
    subject: 'Collaboration Opportunity',
    body: 'Hey! Love your AI Smart Inbox project! 🔥🔥\n\nI run a tech education channel with 50K+ followers interested in AI/automation.\n\nWould you be interested in collaborating on a tutorial series? I\'m thinking:\n\n📹 Episode 1: Building AI-powered apps\n📹 Episode 2: n8n automation workflows  \n📹 Episode 3: Deploying to production\n\nGood exposure for your project + we split any sponsorship revenue 50/50.\n\nInterested? 👀',
    ai_summary: '🔥 Tech influencer (50K followers) proposing tutorial collaboration. 3-episode series, revenue sharing, project exposure.',
    suggested_reply: 'This sounds awesome! I\'d love to collaborate. Let\'s jump on a call to discuss the details.',
    status: 'unread',
    metadata: { priority: 'medium', category: 'opportunity', platform_icon: '📸' }
  },

  // === TWITTER/X DMS ===
  {
    source: 'twitter',
    sender: '@tech_vc',
    subject: 'Investment Opportunity',
    body: 'Hey! Impressive work on AI Smart Inbox 👏\n\nOur fund (Velocity Ventures) invests in early-stage AI/SaaS startups.\n\nWe\'ve backed companies like:\n• DataFlow AI ($50M exit)\n• SmartSync ($20M Series A)\n• AutoMate (acq. by Microsoft)\n\nInterested in discussing pre-seed/seed funding? We typically invest $500K-$2M.\n\nDM me if you\'d like to chat!\n\n- Jason',
    ai_summary: '💰 VC interested in investment. Velocity Ventures offers $500K-$2M seed funding. Track record with AI/SaaS exits.',
    suggested_reply: 'Thanks for reaching out Jason! I\'d definitely be interested in exploring this. Could we schedule a call next week?',
    status: 'unread',
    metadata: { priority: 'high', category: 'business', platform_icon: '🐦' }
  },

  // === DISCORD MESSAGES ===
  {
    source: 'discord',
    sender: 'DevCommunity',
    subject: '#help - MongoDB Question',
    body: '@here Can someone help with a MongoDB aggregation issue?\n\nI\'m trying to filter messages by date range but getting unexpected results.\n\n```javascript\nconst messages = await Message.aggregate([\n  { $match: { createdAt: { $gte: startDate, $lte: endDate } } },\n  { $group: { _id: \"$source\", count: { $sum: 1 } } }\n]);\n```\n\nThe counts seem off. Any ideas? 🤔',
    ai_summary: '🤔 Developer needs help with MongoDB aggregation query. Date range filtering returning unexpected results.',
    suggested_reply: 'Try converting your dates to ISODate format first. Also make sure createdAt is indexed. Let me know if that helps!',
    status: 'unread',
    metadata: { priority: 'low', category: 'community', channel: 'help', platform_icon: '🎮' }
  },

  // === TELEGRAM MESSAGES ===
  {
    source: 'telegram',
    sender: 'DevOps Team',
    subject: 'Production Alert',
    body: '🚨 ALERT: Production Server Monitoring\n\nStatus: ⚠️ WARNING\n• CPU: 85% (Threshold: 80%)\n• Memory: 72%\n• Disk: 68%\n\nAction Taken:\n✅ Auto-scaling triggered\n✅ Adding 2 new instances\n✅ Load balancer updated\n\nETA: 3 minutes\n\nMonitoring closely. Will update in 10 mins.\n\n- DevOps Bot',
    ai_summary: '🚨 Production server at 85% CPU. Auto-scaling activated, adding 2 instances. Resolution in progress, ETA 3 minutes.',
    suggested_reply: 'Thanks for the heads up. Monitoring the dashboard. Let me know once it stabilizes.',
    status: 'unread',
    metadata: { priority: 'high', category: 'devops', platform_icon: '✈️' }
  }
];

async function seedDemoData() {
  try {
    console.log('🎬 Starting Professional Demo Data Generation...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-inbox');
    console.log('✅ Connected to MongoDB\n');

    // Clear existing demo messages
    await Message.deleteMany({ 'metadata.demo': true });
    console.log('🗑️  Cleared old demo data\n');

    // Insert demo messages
    console.log('📝 Creating professional demo messages...\n');
    
    for (const msg of demoMessages) {
      msg.metadata = { ...msg.metadata, demo: true, generatedAt: new Date() };
      await Message.create(msg);
      console.log(`   ✅ ${msg.metadata.platform_icon} ${msg.source.toUpperCase()}: ${msg.subject}`);
    }

    console.log(`\n🎉 SUCCESS! Created ${demoMessages.length} demo messages!\n`);
    console.log('📊 Platform Breakdown:');
    console.log('   • Gmail: 3 messages');
    console.log('   • LinkedIn: 2 messages');
    console.log('   • Slack: 2 messages');
    console.log('   • WhatsApp: 2 messages');
    console.log('   • Instagram: 1 message');
    console.log('   • Twitter/X: 1 message');
    console.log('   • Discord: 1 message');
    console.log('   • Telegram: 1 message');
    console.log('\n🚀 NEXT STEPS:');
    console.log('   1. Open frontend: http://localhost:3000');
    console.log('   2. Refresh the dashboard');
    console.log('   3. All messages have AI summaries!');
    console.log('   4. Filter by platform to see each one');
    console.log('   5. Take screenshots for LinkedIn! 📸\n');
    console.log('💡 TIP: Messages look most impressive in "All" view\n');
    console.log('✨ Your demo is READY for presentation!\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Database connection closed\n');
  }
}

seedDemoData();
