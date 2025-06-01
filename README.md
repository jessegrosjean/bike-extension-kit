# Bike Extension Kit

This is a kit for building [Bike
2](https://support.hogbaysoftware.com/c/bike/releases/24) extensions.

Set this kit up once, then use it to modify and create extensions. It provides a
consistent development environment and build process.

The job of this extension kit is to transform extension source code into a
simplified form that Bike can load and run.

## Getting Started

🌟 [Watch Tutorial](https://vimeo.com/1089520938)

First, install needed tools:

- [`node.js`](https://nodejs.org) (require version 18 or later)
- [`vscode`](https://code.visualstudio.com) (optional)
- [`git`](https://git-scm.com) (optional)

Next, use a terminal app to download the extension kit and install dependencies.

```sh
git clone https://github.com/jessegrosjean/bike-extension-kit.git
cd bike-extension-kit
node --version # confirm node version is 18 or later
npm install # install npm dependencies (only needed once, and when kit is updated)
```

Finally, build extensions:

```sh
npm run build
```

Built extensions are copied to `./out/extensions`.

To install a build extension copy it to Bike's > Extensions folder. You can do
this manually, or in the extension's `manifest.json` set the `install` property
to `true`. When you do that the build process will copy the extension to Bike's
Extensions folder after each successful build.

## Extension Development

Inside the `src` folder there is a subfolder for each extension. Add and remove
extension folders as needed. Each extension has the following structure:

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

Bike extensions may contribute code in three separate contexts (app, dom,
style), each with its own purpose and environment. For details and tutorials see
the [extensions
guide](https://bikeguide.hogbaysoftware.com/bike-2-preview/customizing-bike/creating-extensions).

### Application Logic (app)

- Code runs in Bike's native app environment.
- Interact with outlines, clipboard, networking, etc.
- Some API's require appropriate `manifest.json` permissions.
- Import app context API using `import { SYMBOL } from 'bike/app'`.

### DOM/HTML Views (dom)

- Code runs in web views embedded in Bike’s UI.
- Web views are sandboxed and have no network access.
- These views are loaded dynamically using bike/app context APIs.
- Import bike/dom context API using `import { SYMBOL } from 'bike/dom'`.

### Outline Editor Styles (style)

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
