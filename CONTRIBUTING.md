# Contributing

This document describes the development workflow, contribution guidelines, and conventions used in Strikkeapp.

## Development workflow

All changes should follow this workflow:

1. Create or identify a GitHub issue describing the change.
2. Create a branch from the latest `main`.
3. Implement the change in small, logical commits.
4. Open a pull request linked to the issue using `Closes #<number>`.
5. Ensure all checks pass and review the changes before merging.

The `main` branch should remain in a working state. Delete feature branches after merging.

## Issues

Issues should be small, independently testable units of work that can be completed in a single pull request.

Each issue should include:

- A clear description of the problem or proposed change.
- Testable acceptance criteria.
- Relevant implementation tasks, including tests and documentation.
- Explicit dependencies on other issues, where applicable.

Split issues that cover unrelated functionality or are too large to review comfortably. Use the repository's issue templates and apply appropriate type, priority, and area labels.

## Branches and commits

Use short-lived branches on each issue.

Follow [Conventional Commits](https://www.conventionalcommits.org/):

`<type>(<optional-scope>): <description>`

## Pull requests and code quality

Each pull request should address one issue and include any relevant tests and documentation.

Before merging:

- Review the diff for correctness and unnecessary changes.
- Ensure the project's CI checks pass, including formatting, linting, type checking, tests, and build.
- Confirm that the pull request description explains the changes and how they were tested.

Use **Create a merge commit** to preserve the individual commits and pull request boundaries in the project history.

## Language conventions

Use Norwegian for all user-facing application text, including labels, validation messages, and domain values displayed in the UI.

Use English for:

- Source code, identifiers, and code comments.
- Tests and test names.
- Documentation and README files.
- GitHub issues, pull requests, and commit messages.

This convention keeps the application natural for Norwegian-users while maintaining an accessible and consistent development workflow.
