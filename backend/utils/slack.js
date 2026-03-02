import { WebClient } from '@slack/web-api';

const token = process.env.SLACK_BOT_TOKEN;

let client = null;

function getSlackClient() {
  if (!token) {
    console.warn('⚠️  Slack bot token not configured');
    return null;
  }
  
  if (!client) {
    client = new WebClient(token);
  }
  
  return client;
}

export async function sendSlackMessage(channel, text, blocks = null) {
  const client = getSlackClient();
  
  if (!client) {
    throw new Error('Slack not configured');
  }
  
  try {
    const result = await client.chat.postMessage({
      channel: channel,
      text: text,
      blocks: blocks
    });
    
    return {
      success: true,
      ts: result.ts,
      channel: result.channel
    };
  } catch (error) {
    console.error('Slack message error:', error.message);
    throw error;
  }
}

export async function sendSlackReply(channel, threadTs, text) {
  const client = getSlackClient();
  
  if (!client) {
    throw new Error('Slack not configured');
  }
  
  try {
    const result = await client.chat.postMessage({
      channel: channel,
      thread_ts: threadTs,
      text: text
    });
    
    return {
      success: true,
      ts: result.ts
    };
  } catch (error) {
    console.error('Slack reply error:', error.message);
    throw error;
  }
}

export async function getUserInfo(userId) {
  const client = getSlackClient();
  
  if (!client) {
    throw new Error('Slack not configured');
  }
  
  try {
    const result = await client.users.info({ user: userId });
    return result.user;
  } catch (error) {
    console.error('Slack user info error:', error.message);
    return null;
  }
}
