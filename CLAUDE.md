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

- Access outline editor APIs `bike.frontmostOutlineEditor`
- Add commands via `bike.commands.addCommands()`
- Add keybindings via `bike.keybindings.addKeybindings()`
- Add sidebar items via `window.sidebar.addItem()`
- Add inspector items via `window.inspector.addItem()`
- Show DOM sheets with `window.presentSheet()`
- Observe windows via `bike.observeWindows()`

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

Extension code only runs inside Bike.app's internal JSContexts. Normally a
separate app context is created for each extension, but there is also a special
app context setup to evaluate code sent by AppleScript's `evaluate` command.

Claude Code should use Bike's AppleScript `evaluate` command to learn and test
the app context APIs.

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

# Using classes that need importing (Outline, URL, etc.)
osascript -l JavaScript -e '
Application("Bike").evaluate({
  script: `
    const { Outline } = require("bike/app");
    const outline = new Outline(["Item 1", "Item 2"]);
    JSON.stringify({ count: outline.root.children.length });
  `
})
'
```

**Key Points:**

- Simple expressions: Pass JavaScript code as a string
- Functions with parameters: Use arrow functions and pass input parameter as string
- Input/output are **strings only**: For complex objects, use `JSON.stringify()` to pass in and `JSON.parse()` to read
- **Classes like `Outline` need `require()`** when using AppleScript `evaluate()` command - Extension code uses TypeScript `import` which the build system handles automatically

**Critical Patterns for `evaluate`:**

1. **Use `var` for persistence across calls** - `const`/`let` do NOT persist between evaluate calls

   ```javascript
   var handle = ...  // Persists across calls
   const handle = ... // Does NOT persist
   ```

2. **Promises DO resolve between evaluate calls** - Store promise results in `var` variables

   ```javascript
   // Call 1:
   var p = bike.frontmostWindow.presentSheet(...);
   p.then(function(h) { myHandle = h; });

   // Call 2 (later):
   myHandle.postMessage("works!");
   ```

3. **DOM scripts use `extensionExports` pattern** (not ES6 `export` keyword)

   ```javascript
   var domCode =
     "var extensionExports = { activate: async function(context) { context.element.textContent = 'Hello'; } };"
   bike.frontmostWindow.presentSheet(domCode, { width: 400, height: 300 })
   ```

4. **String escaping** - Use unicode escapes to avoid nested quote issues: `\u0027` for `'`, `\u0022` for `"`

5. **Bidirectional messaging between app and DOM contexts**

   ```javascript
   // App → DOM
   handle.postMessage(data);

   // DOM → App
   context.postMessage(data);
   handle.onmessage = function(msg) { ... };
   ```

**Important Notes:**

- **Always consult TypeScript API definitions** in `api/` directory when something doesn't work - don't guess at property names
- **Report when API documentation seems incorrect** - if the TypeScript definitions don't match runtime behavior, inform the user

This allows Claude Code to programmatically inspect runtime state, verify extension behavior, debug DOM context code, and test messaging flows without manual user intervention.

## Bike API Quick Reference

This section summarizes the most important patterns from the TypeScript API definitions in `api/`. Always consult the full API definitions when in doubt.

### Outline Query Syntax

**IMPORTANT**: Bike's query syntax has a **similar model** to XPath but uses **completely different syntax**. Do not use XPath syntax - it will not work.

**Common Query Patterns:**

```javascript
// Get all rows
outline.query('//*')

// Get rows by type
outline.query('//task') // All task rows
outline.query('//heading') // All heading rows
outline.query('//body') // All body rows

// Filter by attributes
outline.query('//@done') // All rows with done attribute
outline.query('//@priority=high') // Rows where priority equals "high"

// Combine type and attribute (space optional)
outline.query('//task @done') // Task rows with done attribute
outline.query('//task@done') // Same - space is optional, but prefer using a space

// Combine multiple predicates
outline.query('//task @done and @priority=high')

// Negation
outline.query('//task not @done') // Tasks without done attribute

// Text matching (case-insensitive by default)
outline.query('//@text contains "hello"') // Case-insensitive
outline.query('//@text contains[s] "hello"') // Case-sensitive
outline.query('//@text beginswith "Task"')
outline.query('//@text endswith "ing"')

// Slicing (1-based indexing, like XPath)
outline.query('//task[1]') // First task
outline.query('//task[2]') // Second task
outline.query('//task[-1]') // Last task
outline.query('//task[2:4]') // Tasks 2 through 4

// Set operations
outline.query('//task union //heading') // Tasks or headings
outline.query('//task except //@done') // Tasks without @done
outline.query('//task intersect //@done') // Tasks with @done
```

**Query Result Structure:**

All queries return an object with `{type, value}` structure:

```javascript
var result = outline.query('//task')
// result = { type: 'elements', value: [Row, Row, ...] }

// Access the rows via .value
var tasks = result.value
tasks.forEach((row) => console.log(row.text.string))
```

**Key Syntax Rules:**

- **Queries return objects** - Always access results via `.value`
- **Case-insensitive by default** - Use `[s]` modifier for case-sensitive, `[i]` for case-insensitive (default)
- **1-based indexing** - `[1]` is first item, `[0]` returns nothing
- **No XPath brackets for predicates** - Use `//task @done` NOT `//task[@done]`
- **Space is optional** - Both `//task @done` and `//task@done` work (preferer using a space for readability)
- **Combine predicates with and/or** - `//task @done and @priority=high`
- **Type tests**: `*`, `task`, `heading`, `body`, `unordered`, `ordered`, `quote`, `code`, `note`, `hr`
- **Axes**: `//` (descendant), `/` (child), `..` (parent), `.` (self)
- **Relations**: `=`, `!=`, `<`, `>`, `<=`, `>=`, `contains`, `beginswith`, `endswith`, `matches`
- **Modifiers**: `[i]` (case-insensitive, default), `[s]` (case-sensitive), `[n]` (numeric), `[d]` (date)

**Debugging Queries:**

Use `outline.explainQuery(path)` to understand how a query is parsed and see detailed error messages:

```javascript
// See the parse tree and trace
console.log(outline.explainQuery('//task @done'))

// Debug syntax errors
console.log(outline.explainQuery('//task[@done]'))
// Shows: "error: unexpected input at position 1:7, expected end of input"
```

The output includes:
- **Parse Tree** - Hierarchical structure of the query
- **Parse Trace** - Step-by-step parsing with position indicator
- **Parse Errors** - Detailed error messages with line/column numbers

**For complex filtering**, query all rows then use JavaScript:

```javascript
var allRows = outline.query('//*')
var tasks = allRows.value.filter((r) => r.type === 'task')
var doneTasks = tasks.filter((r) => r.getAttribute('done'))
```

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

**Creating Temporary Outlines:**

Use the `Outline` constructor for processing tasks like copying filtered rows:

```javascript
import { Outline } from 'bike/app'

// Query rows from existing outline
const result = editor.outline.query('//heading')

// Create temporary outline from query results
const temp = new Outline(result)

// Export to clipboard
const text = temp.archive('plaintext')
bike.clipboard.writeText(text.data)
```

### Outline Metadata

Outlines have two types of metadata storage:

- **`runtimeMetadata`** - Temporary metadata, not saved to disk
- **`persistentMetadata`** - Saved to file format (BikeML frontmatter)

Both implement the same `Metadata` interface with `get()`, `set()`, and `delete()` methods:

```javascript
// Runtime metadata (not saved)
outline.runtimeMetadata.set('tempState', { foo: 'bar' })
const value = outline.runtimeMetadata.get('tempState')

// Persistent metadata (saved to file)
outline.persistentMetadata.set('author', 'Claude')
outline.persistentMetadata.set('version', 1)
outline.persistentMetadata.set('tags', ['test', 'metadata'])

// All JSON types supported
meta.set('string', 'hello')
meta.set('number', 42)
meta.set('boolean', true)
meta.set('object', { nested: { value: 123 } })
meta.set('array', [1, 2, 3])

// Three equivalent ways to delete a key
meta.delete('key')
meta.set('key', undefined)
meta.set('key', null)

// Check if key exists
const value = meta.get('key') // undefined if not set

// Verify persistent metadata in archive
const archive = outline.archive('bike')
// Persistent metadata appears in <script id="outline-metadata" type="text/json">
```

**Key Points:**

- **All JSON types supported**: string, number, boolean, object, array
- **Keys are not enumerable**: `Object.keys(metadata)` returns `[]` - use application logic to track keys
- **Persistent metadata** saves to file in BikeML format (`<script id="outline-metadata">` element)
- **Runtime metadata** exists only in memory and is lost when document closes
- **Plain Text format**: Persistent metadata is NOT saved unless `bikemd: true` is set in metadata

**Use Cases:**

- **Runtime metadata**: Temporary state, caches, computed values that shouldn't persist
- **Persistent metadata**: Document properties, author info, extension settings, workflow state

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
