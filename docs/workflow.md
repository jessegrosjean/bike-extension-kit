# Development Workflow

## Creating a New Extension

Run the scaffolding script:

```sh
npm run new
```

You'll be prompted for an extension ID. The script creates a new folder at
`src/<id>.bkext` with a starter template:

```
my-extension.bkext/
├── manifest.json       # Extension metadata, permissions, install config
├── app/main.ts         # App context entry point
├── dom/hello-world.ts  # DOM context entry point
├── style/main.ts       # Style context entry point
└── README.md
```

Delete any context folders you don't need. For example, if your extension only
adds commands, keep `app/` and remove `dom/` and `style/`.

The extension's display name is derived from the folder name: dashes become
spaces and each word is capitalized (e.g. `heading-levels.bkext` becomes
"Heading Levels").

## Building and Installing

Build all extensions in `src/` into `out/extensions/`:

```sh
npm run build
```

During development, use watch mode to rebuild automatically on file changes:

```sh
npm run watch
```

To install a built extension, copy it from `out/extensions/` to Bike's
extensions folder (Bike > Extensions...).

For faster iteration, set `"install": true` in the extension's `manifest.json`.
The build system will then automatically install the extension into Bike each
time you build.

## Extension Structure

Each extension can include up to three contexts, each serving a different
purpose:

### App Context (`app/main.ts`)

The main extension logic. Runs in Bike's application JavaScript context with
access to the `bike` global object. Use this to:

- Add commands to the command palette
- Add keybindings
- Add sidebar and inspector items
- Access and modify outline content
- Present DOM sheets (custom UI)
- Observe windows

```typescript
import { AppExtensionContext } from 'bike/app'

export async function activate(context: AppExtensionContext) {
  bike.commands.addCommands({
    commands: {
      'my-ext:hello': (context) => {
        const editor = context.editor
        // ...
        return true
      },
    },
  })
}
```

### DOM Context (`dom/*.ts|tsx`)

Custom UI components rendered in sheets or panels. React is available globally
(`window.React`, `window.ReactDOM`, `window.ReactDOMClient`). Multiple DOM
entry points are allowed — each `.ts` or `.tsx` file in `dom/` becomes a
separate script.

```typescript
import { DOMExtensionContext } from 'bike/dom'

export async function activate(context: DOMExtensionContext) {
  context.element.textContent = 'Hello from DOM context'
}
```

DOM scripts communicate with the app context via message passing:

```typescript
// In DOM context
context.postMessage({ action: 'getData' })
context.onmessage = (msg) => { /* handle response */ }

// In app context
handle.onmessage = (msg) => { /* handle request */ }
handle.postMessage({ data: '...' })
```

### Style Context (`style/main.ts`)

Custom styling and visual modifications. Use this to inject CSS, modify
appearance, or apply themes.

## Debugging with `evaluate`

You can execute JavaScript in Bike's app context using AppleScript, which is
useful for inspecting runtime state and testing API calls without rebuilding:

```sh
# Check Bike version
osascript -l JavaScript -e '
Application("Bike").evaluate({ script: "bike.version" })
'

# Inspect registered commands
osascript -l JavaScript -e '
Application("Bike").evaluate({ script: "bike.commands.toString()" })
'

# Pass input parameters (must use "input" key, value must be a string)
osascript -l JavaScript -e '
Application("Bike").evaluate({
  input: "Hello!",
  script: "(input) => { return bike.version + \": \" + input }"
})
'

# Use classes that need importing
osascript -l JavaScript -e '
Application("Bike").evaluate({
  script: "const { Outline } = require(\"bike/app\"); new Outline([\"A\", \"B\"]).root.children.length"
})
'
```

Key points for `evaluate`:

- Input and output are **strings only** — use `JSON.stringify`/`JSON.parse` for
  complex objects
- Use `var` (not `const`/`let`) if you need values to persist across multiple
  `evaluate` calls
- Use unicode escapes (`\u0027`, `\u0022`) to avoid nested quote issues

## Manifest Configuration

Each extension has a `manifest.json` that controls metadata and behavior:

```json
{
  "$schema": "../../schemas/manifest.schema.json",
  "description": "What the extension does",
  "author": "Your Name",
  "url": "https://github.com/...",
  "version": "1.0.0",
  "api_version": "0.0.0",
  "permissions": [],
  "host_permissions": [],
  "install": true
}
```

- **`install`**: Set to `true` to auto-install on build
- **`permissions`**: List sensitive operations the extension needs (e.g.
  `"openURL"`)
- **`enabled`**: Set to `false` to disable without removing

## TypeScript and API Definitions

Type definitions for each context live in the `api/` directory:

- `api/app/*.d.ts` — App context types
- `api/dom/*.d.ts` — DOM context types
- `api/style/*.d.ts` — Style context types

The project uses three separate TypeScript configurations (one per context),
referenced from the root `tsconfig.json`. The build system type-checks all
configurations automatically.
