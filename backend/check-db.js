
import mongoose from 'mongoose';
import Message from './models/Message.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkMessages() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_smart_inbox';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    
    const messages = await Message.find().sort({ createdAt: -1 }).limit(5);
    
    console.log('--- Latest 5 Messages ---');
    messages.forEach(msg => {
      console.log(`\nID: ${msg._id}`);
      console.log(`Source: ${msg.source}`);
      console.log(`Sender: ${msg.sender}`);
      console.log(`Subject: ${msg.subject}`);
      console.log(`Body: ${msg.body.substring(0, 50)}...`);
      console.log(`Created: ${msg.createdAt}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkMessages();
