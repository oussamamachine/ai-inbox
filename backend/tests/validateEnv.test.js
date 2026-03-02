/**
 * Unit tests for validateEnv.
 *
 * These are intentionally lightweight — the goal is to give the CI pipeline
 * something to verify without requiring a running database or real API keys.
 * Integration tests can be added in a separate test suite once the project
 * matures and infrastructure is in place.
 *
 * Run with: npm test
 */

import { validateEnv } from '../config/validateEnv.js';

describe('validateEnv', () => {
  const baseEnv = {
    MONGODB_URI: 'mongodb://localhost:27017/test',
    JWT_SECRET: 'a-sufficiently-long-secret-value',
  };

  test('passes with valid minimal config', () => {
    const { errors, warnings } = validateEnv(baseEnv);
    expect(errors).toHaveLength(0);
  });

  test('errors when MONGODB_URI is missing', () => {
    const { errors } = validateEnv({ ...baseEnv, MONGODB_URI: undefined });
    expect(errors).toContain('MONGODB_URI is required');
  });

  test('errors when JWT_SECRET is missing', () => {
    const { errors } = validateEnv({ ...baseEnv, JWT_SECRET: undefined });
    expect(errors).toContain('JWT_SECRET is required');
  });

  test('warns when JWT_SECRET is too short', () => {
    const { warnings } = validateEnv({ ...baseEnv, JWT_SECRET: 'short' });
    expect(warnings.some((w) => w.includes('JWT_SECRET is too short'))).toBe(true);
  });

  test('warns when no AI key is set', () => {
    const { warnings } = validateEnv(baseEnv);
    expect(warnings.some((w) => w.includes('No AI key configured'))).toBe(true);
  });

  test('no AI warning when GROQ_API_KEY is present', () => {
    const { warnings } = validateEnv({ ...baseEnv, GROQ_API_KEY: 'gsk_test' });
    expect(warnings.some((w) => w.includes('No AI key configured'))).toBe(false);
  });

  test('warns on unusual OPENAI_API_KEY format', () => {
    const { warnings } = validateEnv({ ...baseEnv, OPENAI_API_KEY: 'invalid-key' });
    expect(warnings.some((w) => w.includes('OPENAI_API_KEY format'))).toBe(true);
  });

  test('warns when Twilio is partially configured', () => {
    const { warnings } = validateEnv({ ...baseEnv, TWILIO_ACCOUNT_SID: 'AC123' });
    expect(warnings.some((w) => w.includes('Twilio partially configured'))).toBe(true);
  });
});
