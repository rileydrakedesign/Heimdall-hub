Router and initialization.

Goal
Turn an incoming request into a clear execution plan before doing work.

Default behavior
Auto choose an execution mode when confidence is high.
Ask a single clarifying question when the choice is ambiguous.

Execution modes
Mode 1, one shot
Use when the task fits in one session and does not need persistence.

Mode 2, background runner
Use when the task is batchable and should run continuously until done.
Examples, iterate through sections, generate outputs per file, commit each step.

Mode 3, cron job
Use when time based cadence matters.
Examples, check every N minutes, daily summaries, reminders.

Mode 4, sub agent
Use when the task is complex, parallelizable, or long.

Routing signals
Strong signals for background runner
- iterate autonomously
- keep running until done
- run through every section
- continue iterating
- do all remaining

Strong signals for cron
- every day
- every morning
- every N minutes
- remind me
- check periodically

Strong signals for sub agent
- deep research
- evaluate options and compare
- long analysis across many sources
- multi step build with unknowns

Strong signals for one shot
- quick edit
- small change
- answer a question

Conflict handling
If multiple strong signals match
- prefer background runner for completion oriented batches
- prefer cron for time based recurring work
- prefer sub agent for research heavy work
If still ambiguous, ask one clarifying question.

Outputs and artifacts
Always state
- what files will be created or edited
- where outputs will be saved
- how progress will be reported

Quality gates
If the task produces content
- run validators when available
- fail fast and retry if validators fail

Stop conditions
If a background runner is started
- it must write to a log file
- it must be resumable
- it must stop on repeated validation failure

