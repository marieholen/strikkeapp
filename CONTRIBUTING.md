# Contributing

Strikkeapp is a personal learning project.
This document describes the workflow and conventions used in the repository.

## Development workflow

1. Create or identify an issue describing the change.
2. Create a branch from the latest `main`.
3. Implement the change in small, logical commits.
4. Add or update relevant tests and documentation.
5. Open a pull request linked to the issue using `Closes #<number>`.
6. Run the project checks and review the changes before merging.

Keep `main` in a working state and delete feature branches after merging.

## Issues

Keep issues focused and manageable.
Related changes can share an issue when they form one coherent improvement.

Use the repository's issue templates and include:

- A short description of the change
- The main tasks
- Testable acceptance criteria
- Dependencies on other issues when needed

Use a suitable type label, such as `feature`, `bug`, `chore` or
`documentation`. Add a priority label when useful.
Area labels and milestones are optional.

## Branches and commits

Use a separate branch for each issue.
Choose a branch name that describes the work, preferably including
the issue number.

Use this commit message format:

```text
[<type>] <description>
```

Examples:

```text
[feat] add recipe navigation
[fix] handle failed PDF loading
[test] cover recipe filtering
[docs] update interface screenshots
[chore] format recipe components
```

Keep commits focused and use short, descriptive messages.

## Tests and documentation

Include relevant tests and documentation in the same pull request
as the change.

Add or update tests when behavior changes.
Update the README, screenshots or other affected documentation
when needed.

Not every change requires new tests or documentation.
Explain briefly in the pull request when either is not applicable.

Create separate issues for larger documentation improvements
or missing test coverage discovered outside the current work.

## Pull requests and checks

Keep pull requests focused and use the repository's pull request template.
Describe what changed and how it was tested.

Before merging:

- Review the diff
- Run the project checks
- Check changed user flows in the browser
- Check mobile layouts and keyboard access when relevant
- Confirm that documentation describes the implemented behavior

Run these checks:

```bash
npm run typecheck
npm run lint
npm test
npm run format:check
npm run build
```

Use **Create a merge commit** to preserve the individual commits
in the pull request.

## Language conventions

Use Norwegian for user-facing application text, including labels,
validation messages and displayed domain values.

Use English for:

- Source code, identifiers and code comments
- Tests and test names
- Documentation
- Issues, pull requests and commit messages

## AI assistance

See the [AI usage documentation](docs/ai-usage.md) for how
AI assistance is used and reviewed in this project.
