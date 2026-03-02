import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

let client = null;

function getTwilioClient() {
  if (!accountSid || !authToken) {
    console.warn('⚠️  Twilio credentials not configured');
    return null;
  }
  
  if (!client) {
    client = twilio(accountSid, authToken);
  }
  
  return client;
}

export async function sendSMS(to, message) {
  const client = getTwilioClient();
  
  if (!client) {
    throw new Error('Twilio not configured');
  }
  
  if (!twilioPhoneNumber) {
    throw new Error('TWILIO_PHONE_NUMBER not set in environment');
  }
  
  try {
    const result = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: to
    });
    
    return {
      success: true,
      messageSid: result.sid,
      status: result.status
    };
  } catch (error) {
    console.error('Twilio SMS error:', error.message);
    throw error;
  }
}

export async function verifyTwilioWebhook(signature, url, params) {
  const client = getTwilioClient();
  
  if (!client || !authToken) {
    return false;
  }
  
  return twilio.validateRequest(authToken, signature, url, params);
}
