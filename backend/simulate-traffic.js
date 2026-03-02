import axios from 'axios';

const API_URL = 'http://localhost:4001/api/messages';

const sampleMessages = [
  {
    source: 'gmail',
    sender: 'recruiter@techcompany.com',
    subject: 'Interview Invitation - Senior Developer Role',
    body: 'Hi, we were impressed with your profile and would like to schedule a technical interview next week. Please let us know your availability for a 1-hour slot on Tuesday or Wednesday.'
  },
  {
    source: 'slack',
    sender: 'product-manager',
    subject: 'Q4 Roadmap Review',
    body: 'Hey team, just a reminder that we have the Q4 roadmap review meeting in 30 minutes. Please make sure to update your Jira tickets before the call.'
  },
  {
    source: 'whatsapp',
    sender: '+15550123456',
    subject: 'Weekend Plans',
    body: 'Hey! Are we still on for hiking this Saturday? The weather looks great. Let me know if we need to bring anything.'
  },
  {
    source: 'linkedin',
    sender: 'John Smith',
    subject: 'Networking Opportunity',
    body: 'I saw your recent post about AI integration and found it very insightful. I would love to connect and discuss potential collaboration opportunities.'
  },
  {
    source: 'instagram',
    sender: 'design_daily',
    subject: 'New Design Trends',
    body: 'Check out our latest post on 2025 UI/UX trends! We think you would love the new glassmorphism examples.'
  }
];

async function simulateTraffic() {
  console.log('🚀 Starting traffic simulation...');
  
  for (const msg of sampleMessages) {
    try {
      console.log(`\n📤 Sending ${msg.source} message from ${msg.sender}...`);
      const response = await axios.post(API_URL, msg);
      console.log(`✅ Sent! ID: ${response.data.data._id}`);
      console.log(`   AI Summary: ${response.data.data.ai_summary?.substring(0, 50)}...`);
      
      // Wait a bit between messages to simulate real traffic
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`❌ Failed to send message: ${error.message}`);
      if (error.code === 'ECONNREFUSED') {
        console.error('   Is the backend server running on port 4001?');
      }
    }
  }
  
  console.log('\n✨ Simulation complete! Check your dashboard.');
}

simulateTraffic();
