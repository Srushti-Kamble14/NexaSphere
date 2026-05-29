import logger from '../utils/logger.js';

const MAX_SSE_CLIENTS = 100;
const adminClients = new Map();

function evictOldestClient() {
  const oldest = adminClients.keys().next().value;
  if (oldest) {
    if (oldest._heartbeat) clearInterval(oldest._heartbeat);
    try { oldest.end(); } catch {}
    adminClients.delete(oldest);
    logger.warn('SSE client evicted (capacity reached)', { totalClients: adminClients.size });
  }
}

export function addSSEClient(res) {
  if (adminClients.size >= MAX_SSE_CLIENTS) {
    evictOldestClient();
  }

  adminClients.set(res, Date.now());

  res.on('close', () => {
    adminClients.delete(res);
    if (res._heartbeat) clearInterval(res._heartbeat);
    logger.info('SSE client disconnected', { totalClients: adminClients.size });
  });

  res.on('error', (error) => {
    adminClients.delete(res);
    if (res._heartbeat) clearInterval(res._heartbeat);
    logger.error('SSE client error', { error: error.message });
  });

  logger.info('SSE client connected', { totalClients: adminClients.size });
}

export function broadcastSSEEvent(eventName, data) {
  const eventData = JSON.stringify({
    type: eventName,
    data,
    timestamp: new Date().toISOString(),
  });

  const dead = [];
  for (const [client] of adminClients) {
    try {
      client.write(`event: ${eventName}\n`);
      client.write(`data: ${eventData}\n\n`);
    } catch (error) {
      logger.error('Failed to send SSE event', { error: error.message });
      dead.push(client);
    }
  }

  dead.forEach((c) => {
    adminClients.delete(c);
    clearInterval(c._heartbeat);
  });

  logger.debug('SSE event broadcast', { event: eventName, clientCount: adminClients.size });
}

export function getConnectedSSEClientsCount() {
  return adminClients.size;
}

const HEALTH_CHECK_INTERVAL_MS = 60000;

setInterval(() => {
  const now = Date.now();
  for (const [client, joined] of adminClients) {
    if (now - joined > HEALTH_CHECK_INTERVAL_MS) {
      try {
        client.write(': ping\n\n');
      } catch {
        if (client._heartbeat) clearInterval(client._heartbeat);
        adminClients.delete(client);
        logger.warn('SSE client evicted (health check failed)', { totalClients: adminClients.size });
      }
    }
  }
}, HEALTH_CHECK_INTERVAL_MS).unref();

export function setupSSEHeaders(req, res, next) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // The app-level cors() middleware already selected the correct origin.
  // Do not overwrite it here, or multi-origin deployments break.

  res.write(': SSE connection established\n\n');

  res._heartbeat = setInterval(() => {
    try {
      res.write(': heartbeat\n\n');
    } catch (error) {
      clearInterval(res._heartbeat);
    }
  }, 30000);

  res.on('close', () => {
    clearInterval(res._heartbeat);
  });

  next();
}

export default {
  addSSEClient,
  broadcastSSEEvent,
  getConnectedSSEClientsCount,
  setupSSEHeaders,
};
