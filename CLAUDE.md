# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Bike Extension Kit for building extensions for Bike Outliner 2. Extensions enhance Bike's functionality by adding commands, keybindings, views, styles, and more through three different contexts:

- **App Context** (`app/main.ts`): Main application logic, commands, keybindings, sidebar items
- **DOM Context** (`dom/*.ts|tsx`): Custom UI components using React (window.React/ReactDOM available globally)  
- **Style Context** (`style/main.ts`): Custom styling and visual enhancements

## Essential Commands

### Building Extensions
- `npm run build` - Build all extensions for production
- `npm run watch` - Build and watch for changes during development
- `npm run build-internals` - Build internal API components
- `npm run new` - Create a new extension from template

### Development Workflow
The build system automatically:
- Typechecks all TypeScript configurations
- Copies manifest.json files
- Auto-installs extensions when `manifest.json` has `"install": true`
- Generates sourcemaps (inline for dev, external for production)

## Architecture

### Extension Structure
Extensions live in `src/` with each `.bkext` folder containing:
```
extension.bkext/
├── manifest.json    # Extension metadata, permissions, install config
├── app/main.ts      # App context entry point (optional)
├── dom/             # DOM context files (optional, multiple allowed)
├── style/main.ts    # Style context entry point (optional)
└── README.md        # Extension documentation
```

### Build System (esbuild)
- Entry points: `src/**/app/main.ts`, `src/**/style/main.ts`, `src/**/dom/*.{ts,tsx}`
- External modules: `bike/app`, `bike/dom`, `bike/style`, `react`, `react-dom`
- Output: `out/extensions/` with IIFE format, global name `extensionExports`
- Automatic manifest copying and extension installation

### TypeScript Configuration
- Root `tsconfig.json` references three configs: `app`, `dom`, `style`
- Each context has separate TypeScript compilation
- Strict mode enabled with comprehensive type checking
- API definitions in `api/` directory provide type safety

### Extension Contexts

**App Context**: Access to `bike` global object, can:
- Add commands via `bike.commands.addCommands()`
- Add keybindings via `bike.keybindings.addKeybindings()`
- Add sidebar items via `window.sidebar.addItem()`
- Observe windows via `bike.observeWindows()`
- Access outline editor APIs

**DOM Context**: React components with access to:
- Global `window.React`, `window.ReactDOM`, `window.ReactDOMClient`
- Custom UI sheets presented via `bike.frontmostWindow?.presentSheet()`
- Message passing with `handle.postMessage()`

**Style Context**: Custom styling and visual modifications

### Key APIs
- Commands take `CommandContext` parameter with editor access
- Outline queries use XPath-like syntax (e.g., `//@data-done`, `//heading`)
- Transactions for atomic outline changes: `outline.transaction()`
- Sidebar items support sections, ordering, symbols, and nested children

## Extension Development Notes

- Extensions require `manifest.json` with schema validation
- Permissions system controls sensitive operations (`openURL`, etc.)
- Set `"install": true` in manifest for automatic installation during build
- React components in DOM context can communicate with app context via messaging
- Use outline queries for complex row selection and filtering
- All extension code is bundled as IIFE with external dependencies