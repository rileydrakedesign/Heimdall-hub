---
name: app-store-reviews
description: Search apps and fetch user reviews from Google Play Store and Apple App Store. Use for competitor analysis, sentiment mining, feature gap discovery, and idea validation when you need real user feedback on existing products.
---

# App Store Reviews

Search for apps by keyword and pull user reviews from Google Play and Apple App Store. No API keys required.

All scripts are in `scripts/` relative to this skill directory. Run with Node.js.

## Scripts

### Search for apps
```bash
node scripts/search_apps.mjs --query "credit card rewards" --store both --num 5
```
- `--store`: `google`, `apple`, or `both` (default: both)
- `--num`: number of results (default: 5)
- Returns: JSON array with app name, id, developer, score, ratings, install count, price, URL

### Get reviews for an app
```bash
# Google Play (use appId string)
node scripts/get_reviews.mjs --store google --id com.example.app --num 50 --sort newest

# Apple App Store (use numeric id)
node scripts/get_reviews.mjs --store apple --id 123456789 --num 50 --sort recent
```
- `--sort` (Google): `newest`, `rating`, `helpfulness`
- `--sort` (Apple): `recent`, `helpful`
- Returns: JSON with review text, score, date, title, thumbsUp (Google)

### Get app details
```bash
node scripts/app_details.mjs --store google --id com.example.app
node scripts/app_details.mjs --store apple --id 123456789
```
- Returns: JSON with description, score, ratings count, installs, genre, version, price

## Workflow for competitor analysis

1. Search by keyword to find competitor apps
2. Get details for top results (ratings, install count, description)
3. Pull reviews sorted by `newest` for recent sentiment, `helpfulness` for top complaints
4. Extract patterns: common complaints, feature requests, praise themes
5. Low-star reviews (1-2) reveal pain points; high-star reviews (4-5) reveal what to preserve
