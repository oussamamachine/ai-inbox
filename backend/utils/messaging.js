import twilio from 'twilio';
import { WebClient } from '@slack/web-api';
import axios from 'axios';

// Twilio SMS
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

// Slack
const slackClient = process.env.SLACK_BOT_TOKEN
  ? new WebClient(process.env.SLACK_BOT_TOKEN)
  : null;

/**
 * Send SMS via Twilio
 */
export async function sendSMS(to, body) {
  if (!twilioClient) {
    throw new Error('Twilio not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN');
  }

  const from = process.env.TWILIO_PHONE_NUMBER;
  if (!from) {
    throw new Error('TWILIO_PHONE_NUMBER not set in environment');
  }

  try {
    const message = await twilioClient.messages.create({
      body,
      from,
      to
    });

    return {
      success: true,
      messageId: message.sid,
      status: message.status
    };
  } catch (error) {
    console.error('Twilio SMS error:', error);
    throw new Error(`Failed to send SMS: ${error.message}`);
  }
}

/**
 * Send Slack message
 */
export async function sendSlackMessage(channel, text, threadTs = null) {
  if (!slackClient) {
    throw new Error('Slack not configured. Set SLACK_BOT_TOKEN');
  }

  try {
    const result = await slackClient.chat.postMessage({
      channel,
      text,
      thread_ts: threadTs // Reply in thread if provided
    });

    return {
      success: true,
      messageId: result.ts,
      channel: result.channel
    };
  } catch (error) {
    console.error('Slack message error:', error);
    throw new Error(`Failed to send Slack message: ${error.message}`);
  }
}

/**
 * Send WhatsApp message via WhatsApp Cloud API
 */
export async function sendWhatsAppMessage(to, body) {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!accessToken || !phoneNumberId) {
    throw new Error('WhatsApp not configured. Set WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID');
  }

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      messageId: response.data.messages[0].id
    };
  } catch (error) {
    console.error('WhatsApp message error:', error.response?.data || error);
    throw new Error(`Failed to send WhatsApp message: ${error.message}`);
  }
}

/**
 * Send Gmail via Gmail API
 */
export async function sendGmail(to, subject, body, accessToken) {
  if (!accessToken) {
    throw new Error('Gmail access token required');
  }

  try {
    // Create RFC 2822 formatted email
    const email = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/plain; charset=utf-8',
      '',
      body
    ].join('\n');

    const encodedEmail = Buffer.from(email)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const response = await axios.post(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
      { raw: encodedEmail },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      messageId: response.data.id
    };
  } catch (error) {
    console.error('Gmail send error:', error.response?.data || error);
    throw new Error(`Failed to send Gmail: ${error.message}`);
  }
}

/**
 * Send LinkedIn message (requires OAuth and conversation ID)
 */
export async function sendLinkedInMessage(conversationId, body, accessToken) {
  if (!accessToken) {
    throw new Error('LinkedIn access token required');
  }

  try {
    const response = await axios.post(
      'https://api.linkedin.com/v2/messages',
      {
        recipients: [conversationId],
        subject: 'Reply',
        body
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      messageId: response.data.id
    };
  } catch (error) {
    console.error('LinkedIn message error:', error.response?.data || error);
    throw new Error(`Failed to send LinkedIn message: ${error.message}`);
  }
}

/**
 * Send Twitter/X DM
 */
export async function sendTwitterDM(recipientId, text, accessToken) {
  if (!accessToken) {
    throw new Error('Twitter access token required');
  }

  try {
    const response = await axios.post(
      'https://api.twitter.com/2/dm_conversations/with/:participant_id/messages',
      {
        text
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      messageId: response.data.data.dm_event_id
    };
  } catch (error) {
    console.error('Twitter DM error:', error.response?.data || error);
    throw new Error(`Failed to send Twitter DM: ${error.message}`);
  }
}
