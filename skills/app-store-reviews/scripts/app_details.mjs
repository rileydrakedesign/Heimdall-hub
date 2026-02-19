#!/usr/bin/env node
// Get detailed info for a specific app
// Usage: node app_details.mjs --store google --id com.example.app
// Usage: node app_details.mjs --store apple --id 123456789

import gplay from 'google-play-scraper';
import store from 'app-store-scraper';

const args = process.argv.slice(2);
function getArg(name, fallback) {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
}

const storeName = getArg('store', '');
const appId = getArg('id', '');

if (!storeName || !appId) {
  console.error('Usage: node app_details.mjs --store google|apple --id <appId>');
  process.exit(1);
}

try {
  if (storeName === 'google') {
    const app = await gplay.app({ appId });
    console.log(JSON.stringify({
      store: 'google',
      appId: app.appId,
      name: app.title,
      developer: app.developer,
      description: app.summary || app.description?.slice(0, 500),
      score: app.score,
      ratings: app.ratings,
      reviews: app.reviews,
      installs: app.installs,
      price: app.priceText,
      free: app.free,
      genre: app.genre,
      version: app.version,
      updated: app.updated,
      url: app.url,
    }, null, 2));
  } else if (storeName === 'apple') {
    const app = await store.app({ id: appId });
    console.log(JSON.stringify({
      store: 'apple',
      appId: app.id,
      name: app.title,
      developer: app.developer,
      description: app.description?.slice(0, 500),
      score: app.score,
      ratings: app.ratings,
      reviews: app.reviews,
      price: app.price,
      free: app.free,
      genres: app.genres,
      version: app.version,
      updated: app.updated,
      url: app.url,
    }, null, 2));
  }
} catch (e) {
  console.error(JSON.stringify({ error: e.message }));
  process.exit(1);
}
