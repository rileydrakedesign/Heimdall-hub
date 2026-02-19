#!/usr/bin/env node
// Fetch reviews for a specific app from Google Play or Apple App Store
// Usage: node get_reviews.mjs --store google --id com.example.app [--num 50] [--sort newest|rating|helpfulness]
// Usage: node get_reviews.mjs --store apple --id 123456789 [--num 50] [--sort recent|helpful]

import gplay from 'google-play-scraper';
import store from 'app-store-scraper';

const args = process.argv.slice(2);
function getArg(name, fallback) {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
}

const storeName = getArg('store', '');
const appId = getArg('id', '');
const num = parseInt(getArg('num', '50'), 10);
const sort = getArg('sort', 'newest');

if (!storeName || !appId) {
  console.error('Usage: node get_reviews.mjs --store google|apple --id <appId> [--num 50] [--sort newest|rating|helpfulness]');
  process.exit(1);
}

const results = { store: storeName, appId, reviewCount: 0, reviews: [] };

if (storeName === 'google') {
  const sortMap = {
    newest: gplay.sort.NEWEST,
    rating: gplay.sort.RATING,
    helpfulness: gplay.sort.HELPFULNESS,
  };
  try {
    const reviews = await gplay.reviews({
      appId,
      sort: sortMap[sort] || gplay.sort.NEWEST,
      num,
    });
    results.reviewCount = reviews.data.length;
    results.reviews = reviews.data.map(r => ({
      id: r.id,
      userName: r.userName,
      score: r.score,
      title: r.title,
      text: r.text,
      date: r.date,
      thumbsUp: r.thumbsUp,
      replyText: r.replyText,
      replyDate: r.replyDate,
    }));
  } catch (e) {
    results.error = e.message;
  }
}

if (storeName === 'apple') {
  const sortMap = {
    recent: store.sort.RECENT,
    helpful: store.sort.HELPFUL,
  };
  try {
    const reviews = await store.reviews({
      id: appId,
      sort: sortMap[sort] || store.sort.RECENT,
      page: 1,
    });
    // Apple scraper returns pages of ~50, trim to num
    const trimmed = reviews.slice(0, num);
    results.reviewCount = trimmed.length;
    results.reviews = trimmed.map(r => ({
      id: r.id,
      userName: r.userName,
      score: r.score,
      title: r.title,
      text: r.text,
      date: r.updated,
      url: r.url,
    }));
  } catch (e) {
    results.error = e.message;
  }
}

console.log(JSON.stringify(results, null, 2));
