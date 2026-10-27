# Strikkeapp

A personal knitting organizer built with React and TypeScript.
I develop this project independently to practise frontend development,
testing and browser-based storage.

## Live demo

[Try Strikkeapp](https://marieholen.github.io/strikkeapp/)

Data and uploaded PDFs are stored locally in your browser.
They are not uploaded to a server or shared with other visitors.

## Features

- Create and manage knitting patterns
- Search and filter patterns
- Upload and open PDF patterns
- Create and track knitting projects
- Record project status and progress
- Store data locally in the browser

## Screenshots

The app is under development. The screenshots show the recipe library,
the form for adding recipes and the new project form.

![Recipe library and new recipe form](docs/screenshots/strikkeapp1.png)
![New project form](docs/screenshots/strikkeapp2.png)

## Design

The planned design and prototype are created in Figma. The current interface
is an initial version that will be developed further towards this design.

[View the Figma design](https://www.figma.com/design/jytX4we6iirfAwWoAJ3mnB/Strikkeapp)

## Technology

- React
- TypeScript
- Vite
- Vitest
- ESLint
- IndexedDB
- localStorage

## Structure

The project is organized by feature:

```text
src/
├── features/
│   ├── recipes/
│   └── projects/
├── test/
├── App.tsx
└── main.tsx
```

Business logic and validation are separated from UI components.

### Storage

The app uses a **local-first architecture**:

- Patterns and projects → `localStorage`
- PDF files → `IndexedDB`
- No backend or external database

## Getting started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

Run lint checks:

```bash
npm run lint
```

Build for production:

```bash
npm run build
```

## Status

Core functionality for patterns and projects is implemented.

The app supports creating patterns and projects, filtering patterns,
storing PDFs and tracking knitting projects.

## Future development

- Edit and delete patterns and projects
- Manage yarn and needle inventory
- More detailed project tracking
- Further improvements to responsive design
- More automated tests
- Optional cloud synchronization

## Documentation

See the [contribution guidelines](CONTRIBUTING.md) for the development
workflow and language policy.

## AI usage

See the [AI usage documentation](docs/ai-usage.md) for details on how
AI assistance is used and a log of notable use.
