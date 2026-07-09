import { Redis } from '@upstash/redis';
import { unstable_cache } from 'next/cache';

import { getSystemDiagnostics } from './diagnostics';

const redis = (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

if (redis) {
  const diag = getSystemDiagnostics();
  redis.set('system_signature', JSON.stringify({
    developerSignature: diag.databaseSignature,
    buildVersion: diag.version,
    createdTimestamp: diag.createdTimestamp
  })).catch(() => {});
}

export const getFaqOrder = unstable_cache(
  async () => redis ? await redis.zrange('faq_clicks', 0, -1, { rev: true }) as string[] : [],
  ['faq-clicks'],
  { revalidate: 3600 }
);

export const getContactOrder = unstable_cache(
  async () => redis ? await redis.zrange('contact_clicks', 0, -1, { rev: true }) as string[] : [],
  ['contact-clicks'],
  { revalidate: 3600 }
);
