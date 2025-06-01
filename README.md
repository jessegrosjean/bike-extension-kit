# Bike Extension Kit (Requires Bike 225 or later)

This is a kit for building [Bike 2](https://support.hogbaysoftware.com/c/bike/releases/24) extensions.

Set this kit up once, then use it to modify existing extensions and to create
your own. It provides a consistent development environment, build process, and
best practices.

## Getting Started

This requires that you have node.js installed. Visual Studio Code and Git are
also recommended.

- [`node.js`](https://nodejs.org) (version 18 or later)
- [`vscode`](https://code.visualstudio.com) (optional)
- [`git`](https://git-scm.com) (optional)

Once you have those prerequisites installed you can set up this kit with the following steps:

1. Clone this repository (or download copy).

   ```sh
   git clone https://github.com/jessegrosjean/bike-extension-kit.git
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Build Extensions:

   ```sh
   npm run build
   ```

4. Or watch for changes and rebuild extensions automatically:
   ```sh
   npm run watch
   ```

Built extensions are copied to `./out/extensions`.

To install a build extension copy it to Bike's > Extensions folder. You can do
this manually, or in the extension's `manifest.json` set the `install` property
to `true`. When you do that the build process will copy the extension to Bike's
Extensions folder after each successful build.

## Folder Structure

Inside the `src` folder there is a subfolder for each extension. Add and remove
extension folders as needed. Each extension should have the following structure:

```
extension.bkext
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

## Extension Development

Bike extensions may contribute code in three separate contexts, each with its
own purpose and environment. For details and tutorials see the [extensions
guide](https://bikeguide.hogbaysoftware.com/bike-2-preview/customizing-bike/creating-extensions).

### Application Logic

- Code runs in Bike's native app environment.
- Interact with outlines, clipboard, networking, etc.
- Some API's require appropriate `manifest.json` permissions.
- Import app context API using `import { SYMBOL } from 'bike/app'`.

### DOM/HTML Views

- Code runs in web views embedded in Bike’s UI.
- Web views are sandboxed and have no network access.
- These views are loaded dynamically using bike/app context APIs.
- Import bike/dom context API using `import { SYMBOL } from 'bike/dom'`.

### Outline Editor Styles

- Used to define custom stylesheets for Bike’s outline editor.
- Use outline paths to match outline elements and apply styles.
- Most extensions will not add styles; delete the src/style folder if unused.
- Import bike/style context API using `import { SYMBOL } from 'bike/style'`.

The `api` folder contains types/documentation for each context:

- [App Context API](https://github.com/jessegrosjean/bike-extension-kit/tree/main/api/app).
- [DOM Context API](https://github.com/jessegrosjean/bike-extension-kit/tree/main/api/dom).
- [Style Context API](https://github.com/jessegrosjean/bike-extension-kit/tree/main/api/style).

## Updates / Contributing

This kit will change over time.

- Bike's API will be updated.
- New extensions will be added.
- Existing extensions will be updated.

To merge changes into your local kit use:

```sh
git pull origin main
```

If you have an extension that you would like to contribute back to this kit
please open a pull request. My hope is to include many extensions here for
learning, modifying, and using.

## Next Steps

Look at the existing extensions to see how they are built. Scan through the
[extensions
guide](https://bikeguide.hogbaysoftware.com/bike-2-preview/customizing-bike/creating-extensions).
Try some things. Ask questions in the [support
forum](https://support.hogbaysoftware.com/c/bike/22) when you get stuck.

Good luck and enjoy!
