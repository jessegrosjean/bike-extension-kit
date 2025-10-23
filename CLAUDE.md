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
- `npm run watch` - Build all extensions and watch for changes during development
- `npm run build-internals` - Build internal API components
- `npm run new` - Create a new extension from a template

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
├── theme/*.bktheme  # Theme files (optional)
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
- Message passing between app and DOM contexts with `handle.postMessage()` and `handle.onmessage`

**Style Context**: Custom styling and visual modifications

### Key APIs

- OutlineEditor and Outline objects for manipulating outlines
- Transactions for atomic outline changes: `outline.transaction()`
- Outline queries use XPath-like syntax (e.g., `//@done`, `//heading`)
- Commands take `CommandContext` parameter with editor access
- Sidebar items support sections, ordering, symbols, and nested children

## Debugging Extensions at Runtime

Extensions only run inside Bike.app's internal JSContexts. The best way for
Claude Code to test extension code and APIs is to use Bike's AppleScript
`evaluate` command.

With this command you can pass in a string of JavaScript code to be evaluated,
and the command will return the result as a string. This allows Claude Code to
inspect runtime state, verify extension behavior, and debug issues.

### Using `evaluate` for Debugging

Execute JavaScript code in Bike's app context using AppleScript via `osascript`:

```bash
# Simple expression evaluation
osascript -l JavaScript -e '
Application("Bike").evaluate({ script: "bike.version" })
'

# Function with string parameter (parameter must use "input" key)
osascript -l JavaScript -e '
Application("Bike").evaluate({
  input: "Hello from Claude!",
  script: "(input) => { return bike.version + \" says: \" + input }"
})
'

# Complex objects via JSON
osascript -l JavaScript -e '
Application("Bike").evaluate({
input: "{\"value\":42}",
  script: "(input) => { const obj = JSON.parse(input); return JSON.stringify({ result: obj.value * 2 }) }"
})
'

# Inspect registered commands
osascript -l JavaScript -e '
Application("Bike").evaluate({
  script: "bike.commands.toString()"
})
'
```

**Key Points:**

- Simple expressions: Pass JavaScript code as a string
- Functions with parameters: Use arrow functions and pass input parameter as string
- Input/output are **strings only**: For complex objects, use `JSON.stringify()` to pass in and `JSON.parse()` to read

**Important Notes:**

- **Always consult TypeScript API definitions** in `api/` directory when something doesn't work - don't guess at property names
- **Report when API documentation seems incorrect** - if the TypeScript definitions don't match runtime behavior, inform the user

This allows Claude Code to programmatically inspect runtime state, verify extension behavior, and debug issues without manual user intervention.

## Bike API Quick Reference

This section summarizes the most important patterns from the TypeScript API definitions in `api/`. Always consult the full API definitions when in doubt.

### Core Objects and Properties

**Accessing the Editor and Outline:**

```javascript
bike.frontmostOutlineEditor // Current outline editor
editor.outline // The outline being edited
editor.selection // Current selection (type: caret, text, or block)
outline.root // Root row (not visible in UI)
outline.root.descendants // All rows in outline order
```

**Row Properties (NOT bodyText!):**

```javascript
row.text.string // Get row text as plain string
row.text // AttributedString with formatting
row.type // 'body', 'heading', 'task', etc.
row.children // Direct children
row.descendants // All descendants
row.parent // Parent row
row.getAttribute(name) // Get row attribute
row.setAttribute(name, value) // Set row attribute
```

**Selection Types:**

```javascript
selection.type // 'caret', 'text', or 'block'
selection.row // Head row
selection.word // Word at cursor
selection.sentence // Sentence at cursor
selection.rows // All selected rows

// Type-specific properties in selection.detail:
// For 'text': detail.text.string, detail.headChar, detail.anchorChar
// For 'caret': detail.char
// For 'block': detail.headRow, detail.anchorRow
```

### Modifying Outlines

**Use transactions for outline modifications:**

```javascript
editor.transaction({}, () => {
  editor.outline.insertRows(rowTemplates, parent, before?)
  editor.outline.moveRows(rows, parent, before?)
  editor.outline.removeRows(rows)
})
```

**Creating Rows (use RowTemplate objects):**

```javascript
outline.insertRows(
  [
    { text: 'Item 1' },
    { text: 'Item 2', type: 'heading' },
    { text: 'Item 3', attributes: { done: 'true' } },
  ],
  parent
)
```

### Commands and Keybindings

**Adding Commands:**

```javascript
bike.commands.addCommands({
  commands: {
    'category:command-name': (context) => {
      const editor = context.editor
      const selection = context.selection
      // ... perform command
      return true // Return false to allow lower-priority commands
    },
  },
})

// Debug: bike.commands.toString()
```

**Adding Keybindings:**

```javascript
bike.keybindings.addKeybindings({
  keymap: 'text-mode', // or "block-mode"
  keybindings: {
    'cmd-k': 'category:my-command',
    'ctrl-x ctrl-s': (context) => {
      const editor = context.editor
      const selection = context.selection
      // ... perform action
      return true // Return false to allow continued processing of keybinding
    },
  },
  priority: 100, // Higher priority = runs first
})

// Debug: bike.keybindings.toString()
```

### Sidebar Items

```javascript
window.sidebar.addItem({
  id: 'my-item',
  text: 'My Item',
  symbol: 'star.fill', // SF Symbol name
  isGroup: false,
  ordering: { section: 'top', afterId: 'other-item' },
  action: 'category:my-command',
  children: {
    query: '//@done',
    symbol: 'checkmark',
  },
})
```

### Common Gotchas

1. **Object properties are not enumerable**: `Object.keys()` returns `[]` for most Bike API objects. Always consult TypeScript definitions.

2. **No `bodyText` property**: Use `row.text.string` not `row.bodyText`

3. **Transactions required**: Outline modifications should be wrapped in `editor.transaction({}, () => {...})`

4. **Selection has a `type` field**: Check `selection.type` to know what's in `selection.detail`

5. **Command names use colon separator**: Format is `"category:command-name"`, use leading period to hide from palette (`.category:command`)

## Extension Development Notes

- Extensions require `manifest.json` with schema validation
- Permissions system controls sensitive operations (`openURL`, etc.)
- Set `"install": true` in manifest for automatic installation during build
- React components in DOM context can communicate with app context via messaging
- Use outline queries for complex row selection and filtering
- All extension code is bundled as IIFE with external dependencies
