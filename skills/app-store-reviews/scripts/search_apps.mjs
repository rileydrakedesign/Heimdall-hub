#!/usr/bin/env node
// Search for apps by keyword on Google Play and/or Apple App Store
// Usage: node search_apps.mjs --query "credit card rewards" [--store google|apple|both] [--num 5]

import gplay from 'google-play-scraper';
import store from 'app-store-scraper';

const args = process.argv.slice(2);
function getArg(name, fallback) {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
}

const query = getArg('query', '');
const storeName = getArg('store', 'both');
const num = parseInt(getArg('num', '5'), 10);

if (!query) {
  console.error('Usage: node search_apps.mjs --query "keyword" [--store google|apple|both] [--num 5]');
  process.exit(1);
}

const results = {};

if (storeName === 'google' || storeName === 'both') {
  try {
    const apps = await gplay.search({ term: query, num });
    results.googlePlay = apps.map(a => ({
      id: a.appId,
      name: a.title,
      developer: a.developer,
      score: a.score,
      ratings: a.ratings,
      installs: a.installs,
      free: a.free,
      price: a.priceText,
      url: a.url,
    }));
  } catch (e) {
    results.googlePlay = { error: e.message };
  }
}

if (storeName === 'apple' || storeName === 'both') {
  try {
    const apps = await store.search({ term: query, num });
    results.appleAppStore = apps.map(a => ({
      id: a.id,
      name: a.title,
      developer: a.developer,
      score: a.score,
      ratings: a.ratings,
      free: a.free,
      price: a.price,
      url: a.url,
    }));
  } catch (e) {
    results.appleAppStore = { error: e.message };
  }
}

console.log(JSON.stringify(results, null, 2));
