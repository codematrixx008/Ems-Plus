import { ApiClient } from './cacheClient';
import { mockRouter } from './mockServer';

export const api = new ApiClient('/api', {
  ttlMs: 5 * 60 * 1000,
  maxEntries: 800,
  staleWhileRevalidate: true
}, mockRouter);
