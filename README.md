# Bike Extension Kit

🚧 **Work in Progress (Requires Bike 225 or later)**

This is a kit for building **Bike 2** extensions.

Set this kit up once. Then use it to modify existing extensions and to create
your own. It provides a consistent development environment, build process, and
best practices.

- TODO: Walkthrough setup
- TODO: Walkthrough extension development

## Getting Started

This requires that you have `git` and `node.js` installed. It's also best tested
with the VS Code editor, but you can use any editor that you like.

1. Clone this repository (or download copy).

   ```sh
   git clone https://github.com/jessegrosjean/bike-extension-kit.git
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a build:

   ```sh
   npm run build
   ```

4. Or watch for changes and rebuild automatically:
   ```sh
   npm run watch
   ```

You are now ready to start modifying or creating extensions.

## How this Kit Works

Inside the `src` folder there is a subfolder for each extension in the kit.
Delete a folder to remove an extension. Add a folder to add a new extension.
Each extension folder should have the following structure:

```
extensions-folder
├── manifest.json
├── app (optional)
│   └── main.ts
├── dom (optional)
│   ├── view1.ts
│   └── view2.ts
├── style (optional)
│   └── main.ts
```

The `manifest.json` file is required, and is the entry point of each extension.
The (app, dom, style) subfolders are optional and correspond to different
contexts where your extension can contribute code. Extensions must be built and
installed before they can be used in Bike.

### Build extensions:

1. **Build**: To build extensions once in an optimized form use the `npm run
build` command.

2. **Watch**: To rebuild the extensions anytime you save changes to `src` use
   the `npm run watch` command.

The build process places the built extensions in the `./out/extensions` folder.

### Install extensions:

You must install each built extension before it can be used in Bike.

To install an extension copy it to Bike's Extensions folder. You can do this
manually, or you can set the `install` flag in the extension's `manifest.json`
file to `true`. When you do that the build process will copy the extension to
Bike's Extensions folder after each successful build.

### Create extensions:

To create a new extension, copy an existing extension folder and rename or use
this kit's new command to create the right folder structure:

```sh
npm run new
```

## Updates

This kit will change over time:

- Bike's API will be updated.
- New extensions will be added.
- Existing extensions will be updated.

To merge these changes into your local extension development use the following
git command:

```sh
git pull origin main
```

If you have a useful extension that you would like to contribute back to this
kit please open a pull request.

## Extension Development

Bike extensions contribute code in three separate contexts, each with its own
purpose and environment:

### @app: Application Logic

- Runs in Bike's native app environment.
- Interact with outlines, clipboard, networking, etc.
- Some API's require appropriate `manifest.json` permissions.
- Import @app context API using `import { SYMBOL } from '@app'`.
- [@app context API documentation](https://github.com/jessegrosjean/bike-extension-api/tree/main/app).

### @dom: DOM/HTML Views

- Runs inside a WebView embedded in Bike’s UI.
- WebViews are sandboxed and have no network access.
- Use this context to define HTML/DOM-based views, such as panels or sheets.
- These views are loaded dynamically from @app context APIs.
- Import @dom context API using `import { SYMBOL } from '@dom'`.
- [@dom context API documentation](https://github.com/jessegrosjean/bike-extension-api/tree/main/dom).

### @style: Outline Editor Styles

- Used to define custom stylesheets for Bike’s outline editor.
- Most extensions will not need this; delete the src/style folder if unused.
- Import @style context API using `import { SYMBOL } from '@style'`.
- [@style context API documentation](https://github.com/jessegrosjean/bike-extension-api/tree/main/style).

> 🗂 Each context corresponds to an extension subfolder. Delete unused folders.  
> ☎️ @app and @dom from the same extension can communicate using `postMessage`.

# Next Steps

Look at the existing extensions that come with this kit. See how they work and
try to make some simple changes. Read through the `api` folder to see what is
possible. Then start building your own extensions.

When you have questions please post in the [Support Forum](https://support.hogbaysoftware.com/c/bike/22).
