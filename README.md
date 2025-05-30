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
extensions-folder.bkext
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

1. `npm run build`: To build extensions once in an optimized form.

2. `npm run watch`: To rebuild extensions after each save.

The build extensions are saved to `./out/extensions`.

### Install extensions:

You must copy each built extension to Bike's extension folder.

You can do this manually, or in the extension's `manifest.json` set the
`install` property to `true`. When you do that the build process will copy the
extension to Bike's Extensions folder after each successful build.

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
kit please open a pull request. My hope is to include many useful extensions
with this kit for learning, modifying, and using.

## Extension Development

Bike extensions may contribute code in three separate contexts, each with its
own purpose and environment. For details and tutorials see the [Bike Extensions
Guide](https://bikeguide.hogbaysoftware.com/bike-2-preview/customizing-bike/creating-extensions).

### bike/app: Application Logic

- Code runs in Bike's native app environment.
- Interact with outlines, clipboard, networking, etc.
- Some API's require appropriate `manifest.json` permissions.
- Import app context API using `import { SYMBOL } from 'bike/app'`.
- [See bike/app context API](https://github.com/jessegrosjean/bike-extension-kit/tree/main/app).

### bike/dom: DOM/HTML Views

- Code runs in web views embedded in Bike’s UI.
- Web views are sandboxed and have no network access.
- These views are loaded dynamically from bike/app context APIs.
- Import bike/dom context API using `import { SYMBOL } from 'bike/dom'`.
- [See bike/dom context API](https://github.com/jessegrosjean/bike-extension-kit/tree/main/dom).

### bike/style: Outline Editor Styles

- Used to define custom stylesheets for Bike’s outline editor.
- Use outline paths to match outline elements and apply styles.
- Most extensions will not need this; delete the src/style folder if unused.
- Import bike/style context API using `import { SYMBOL } from 'bike/style'`.
- [See bike/style context API](https://github.com/jessegrosjean/bike-extension-kit/tree/main/style).

## Next Steps

Look at the existing extensions in the `src` folder to see how they are built.
Scan through the [Bike Extensions
Guide](https://bikeguide.hogbaysoftware.com/bike-2-preview/customizing-bike/creating-extensions).
Try some things. Ask questions in the [Bike Extensions Support
Forum](https://support.hogbaysoftware.com/c/bike/22) when you get stuck. Good luck and enjoy!
