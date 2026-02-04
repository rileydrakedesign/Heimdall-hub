Project router, insight-x-pipeline.

Primary outputs
- per section posts, saved to runs/<run-id>/section_XX/posts_final.txt
- cross section selection files, saved to runs/<run-id>/top_posts.txt

Default execution mode
Mode 2, background runner

Inputs
- runs/<run-id>/section_XX/insights.json
- runs/<run-id>/section_XX/section.txt
- style baseline, section_01/posts_final.txt
- taboo phrases, style/taboo-phrases.txt

Scripts
- batch runner, scripts/insight_x/batch_run.mjs

Validators
- scripts/insight_x/validators/scan_banned_phrases.mjs
- scripts/insight_x/validators/readability_metrics.mjs

Progress reporting
- commit and push after each section
- user checks in for progress

Stop rules
- stop after repeated validation failures
