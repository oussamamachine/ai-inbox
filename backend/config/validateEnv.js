// Minimal environment validation to catch common misconfigurations early
export function validateEnv(env = process.env) {
  const errors = [];
  const warnings = [];

  // Required
  if (!env.MONGODB_URI) errors.push('MONGODB_URI is required');

  if (!env.JWT_SECRET) {
    errors.push('JWT_SECRET is required');
  } else if (String(env.JWT_SECRET).length < 16) {
    warnings.push('JWT_SECRET is too short (<16 chars). Use a long, random value in production.');
  }

  // AI provider — either Groq (free) or OpenAI works; neither is strictly required
  const hasGroq = !!env.GROQ_API_KEY;
  const hasOpenAI = !!env.OPENAI_API_KEY;

  if (!hasGroq && !hasOpenAI) {
    warnings.push(
      'No AI key configured. AI summaries and reply suggestions will be skipped. ' +
      'Get a free key at https://console.groq.com/ and set GROQ_API_KEY.'
    );
  }

  if (hasOpenAI && !/^sk-/.test(env.OPENAI_API_KEY)) {
    warnings.push('OPENAI_API_KEY format looks unusual — expected to start with "sk-".');
  }

  // Twilio (SMS)
  const hasTwilioCreds = !!(env.TWILIO_ACCOUNT_SID || env.TWILIO_AUTH_TOKEN || env.TWILIO_PHONE_NUMBER);
  if (hasTwilioCreds) {
    if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN) {
      warnings.push('Twilio partially configured. Set both TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.');
    }
    if (!env.TWILIO_PHONE_NUMBER) {
      warnings.push('TWILIO_PHONE_NUMBER not set. SMS replies will fail.');
    }
  }

  // Slack
  if (env.SLACK_BOT_TOKEN) {
    const validPrefixPattern = /^(xoxb-|xoxp-|xapp-|xoxe-)/;
    if (!validPrefixPattern.test(env.SLACK_BOT_TOKEN)) {
      warnings.push('SLACK_BOT_TOKEN format looks unusual. Expected to start with xoxb-, xoxp-, xapp-, or xoxe-.');
    }
  }

  // WhatsApp (Cloud API)
  const hasWhatsApp = !!(env.WHATSAPP_ACCESS_TOKEN || env.WHATSAPP_PHONE_NUMBER_ID);
  if (hasWhatsApp) {
    if (!env.WHATSAPP_ACCESS_TOKEN || !env.WHATSAPP_PHONE_NUMBER_ID) {
      warnings.push('WhatsApp Cloud API partially configured. Set both WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID.');
    }
  }

  return { errors, warnings };
}
