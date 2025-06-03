# Bike Extension Kit

This kit is for building [Bike Outliner
2](https://support.hogbaysoftware.com/c/bike/releases/24) extensions.

Use extensions to customize and enhance the functionality of Bike. Extensions can add
new commands, keybindings, views, styles, and more. Sensitive features are protected by a permission system.

## Screencasts

- [Setup & Build](https://vimeo.com/1089520938)
- [Creating Extensions](https://vimeo.com/1089816472)
- [App Context Extensions](https://vimeo.com/1089829088)
- [DOM Context Extensions](https://vimeo.com/1089831661)
- [Style Context Extensions](https://vimeo.com/1090188813)

## Setup

First, install needed tools:

- [`node.js`](https://nodejs.org) (require version 18 or later)
- [`vscode`](https://code.visualstudio.com) (optional)
- [`git`](https://git-scm.com) (optional)

Next, download kit and install dependencies:

```sh
git clone https://github.com/jessegrosjean/bike-extension-kit.git
cd bike-extension-kit
node --version # 18 or later
npm install
```

## Build & Install Extensions

The kit folder structure looks like this:

```
bike-extension-kit
├── api
├── configs
├── scripts
├── src
│ ├── extension1.bkext/
│ ├── extension2.bkext/
│ └── ...
```

Inside `src` there is a subfolder for each extension. These folders are
independent–add and remove as needed. When you build, the extensions found in
`src` are built and placed in `out/extensions`.

To build extensions:

```sh
npm run build
```

To install extensions:

1. Open Bike's extensions folder: Bike > Extensions...
2. Copy extensions from `out/extensions` to Bike's extensions folder

For example move `out/extensions/d3.bkext` to Bike's extensions folder. You
should see new d3 items appear in Bike's sidebar. To avoid this step you can set
the `install` property in the extension's `manifest.json` to `true`. When you do
this Bike automatically installs the extension each time you build.

## Next Steps

To learn more see [Creating Extensions](https://bikeguide.hogbaysoftware.com/bike-2-preview/customizing-bike/creating-extensions) in Bike's user guide.
