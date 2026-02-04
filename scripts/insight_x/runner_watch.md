Runner orchestration notes

We keep quality consistent by using the same inputs and constraints as sections 1 to 3.

To run one section at a time
node scripts/insight_x/batch_run.mjs --mode one --run projects/insight-x-pipeline/runs/2026-02-04_1556Z

The script will
- find next section missing posts_final.txt
- generate 5 posts using section 01 baseline style plus taboo list
- validate no banned phrases, no em dashes, no semicolons, no markdown
- write posts_final.txt
- commit and push
- print SECTION_DONE NN

If it prints ALL_DONE, everything is complete.
