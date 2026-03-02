import axios from 'axios';

function getAIKey() {
  // Support both Groq (free) and OpenAI (paid)
  return process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
}

function getAIModel() {
  // If using Groq, default to llama-3.3-70b-versatile (recommended replacement)
  // If using OpenAI, default to gpt-3.5-turbo
  if (process.env.GROQ_API_KEY) {
    return process.env.AI_MODEL || 'llama-3.3-70b-versatile';
  }
  return process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
}

function getAIProvider() {
  return process.env.GROQ_API_KEY ? 'groq' : 'openai';
}

async function callChatCompletion(messages, max_tokens = 300) {
  const AI_KEY = getAIKey();
  const AI_MODEL = getAIModel();
  const provider = getAIProvider();
  
  if (!AI_KEY) {
    throw new Error('AI API key not configured (set GROQ_API_KEY or OPENAI_API_KEY)');
  }

  // Groq uses OpenAI-compatible API
  const url = provider === 'groq' 
    ? 'https://api.groq.com/openai/v1/chat/completions'
    : 'https://api.openai.com/v1/chat/completions';
  
  try {
    const response = await axios.post(
      url,
      {
        model: AI_MODEL,
        messages,
        max_tokens,
        temperature: 0.7
      },
      { 
        headers: { 
          'Authorization': `Bearer ${AI_KEY}`,
          'Content-Type': 'application/json'
        } 
      }
    );
    
    return response.data;
  } catch (error) {
    // Only log non-quota errors to avoid spam
    if (error.response?.status !== 429 && error.response?.data?.error?.code !== 'insufficient_quota') {
      console.error(`${provider.toUpperCase()} API Error:`, error.response?.data || error.message);
    }
    throw error;
  }
}

export async function generateSummary(messageBody) {
  const AI_KEY = getAIKey();
  const provider = getAIProvider();
  
  if (!AI_KEY) {
    return '📝 AI summary not available (Set GROQ_API_KEY for free AI)';
  }

  try {
    const messages = [
      { 
        role: 'system', 
        content: 'You are a helpful assistant that creates concise, clear summaries of messages. Keep summaries to 2-3 sentences maximum.' 
      },
      { 
        role: 'user', 
        content: `Summarize this message concisely:\n\n${messageBody}` 
      }
    ];

    const data = await callChatCompletion(messages, 150);
    return data?.choices?.[0]?.message?.content?.trim() || 'Unable to generate summary';
  } catch (error) {
    // Check if it's a quota error
    if (error.response?.status === 429 || error.response?.data?.error?.code === 'insufficient_quota') {
      return `⚠️ AI quota exceeded - Get free API key at ${provider === 'groq' ? 'console.groq.com' : 'platform.openai.com'}`;
    }
    console.error('Error generating summary:', error.message);
    return '📝 Message received (AI summary unavailable)';
  }
}

export async function suggestReply(messageBody, context = '') {
  const AI_KEY = getAIKey();
  const provider = getAIProvider();
  
  if (!AI_KEY) {
    return '💡 AI reply suggestion not available (Set GROQ_API_KEY for free AI)';
  }

  try {
    const messages = [
      { 
        role: 'system', 
        content: 'You are a helpful assistant that suggests professional, friendly, and concise email replies. Keep replies to 2-3 sentences and maintain a warm, professional tone.' 
      },
      { 
        role: 'user', 
        content: `Suggest a brief reply to this message:\n\n${messageBody}${context ? `\n\nContext: ${context}` : ''}` 
      }
    ];

    const data = await callChatCompletion(messages, 200);
    return data?.choices?.[0]?.message?.content?.trim() || 'Unable to generate reply';
  } catch (error) {
    // Check if it's a quota error
    if (error.response?.status === 429 || error.response?.data?.error?.code === 'insufficient_quota') {
      return `⚠️ AI quota exceeded - Get free API key at ${provider === 'groq' ? 'console.groq.com' : 'platform.openai.com'}`;
    }
    console.error('Error generating reply:', error.message);
    return '💬 Write your own reply (AI suggestion unavailable)';
  }
}

export async function classifyMessage(messageBody) {
  const AI_KEY = getAIKey();
  
  if (!AI_KEY) {
    return 'unclassified';
  }

  try {
    const messages = [
      { 
        role: 'system', 
        content: 'Classify the message into one category: urgent, important, spam, social, or general. Reply with just the category name.' 
      },
      { 
        role: 'user', 
        content: messageBody 
      }
    ];

    const data = await callChatCompletion(messages, 20);
    const category = data?.choices?.[0]?.message?.content?.trim().toLowerCase();
    return ['urgent', 'important', 'spam', 'social', 'general'].includes(category) ? category : 'general';
  } catch (error) {
    console.error('Error classifying message:', error.message);
    return 'general';
  }
}
