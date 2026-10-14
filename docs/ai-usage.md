# AI usage

This project is a learning and portfolio project. AI assistance (Claude) is used as a tool, in a way that keeps the author in control and responsible for every line.

## Principles

- The author reads, runs and understands every change before it is committed
- The author makes all the decisions.
- AI use is documented openly in this file and in the pull request template

## What AI is used for

- Explaining concepts, code and error messages
- Suggesting an issue breakdown, templates and documentation drafts
- Drafting boilerplate code and test cases that the author then reviews and adapts
- Reviewing code for bugs, edge cases and accessibility

## What AI is not used for

- Committing code that the author cannot explain
- Making architectural decisions without the author understanding the trade-offs
- Skipping tests, type checks or review

## Review process

1. AI-suggested code is typed or pasted in small steps, never as one large change
2. The author runs type check, lint, tests and build
3. The author checks behavior in the browser
4. Notable use is added to the log below

## Log

| Date       | Issue / PR | AI helped with      | Author's contribution              |
| ---------- | ---------- | ------------------- | ---------------------------------- |
| 2026-10-12 | Templates  | suggested templates | modified them to suit my own needs |
| 2026-10-12 | Issue backlog                  | Proposing an issue breakdown, order and dependencies                                                                   | Reviewed and edited the issues, decided scope and priorities, created them on GitHub                                   |
| 2026-10-13 | Workflow and AI docs (#24-#25) | Drafting the git workflow, issue guidelines, language policy and AI usage documents                                    | Reviewed the content and adapted it to how I actually work                                                             |
| 2026-10-13 | Recipe categories (#26)        | Suggesting the fix. It also suggested a legacy-value migration that was not needed                                     | Decided to drop the migration because only test data existed, removed the commits with an interactive rebase    |
| 2026-10-13 | CI and tooling (#28)           | CI steps, coverage setup and Dependabot configuration                                                                  | Found that `eslint-plugin-jsx-a11y` does not support ESLint 10, refused `--force`, and moved that task to the ally issue |