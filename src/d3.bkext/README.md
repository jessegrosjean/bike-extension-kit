# D3 Outline Layouts

This extension uses d3.js to create layouts for Bike outlines.

Install the extension by copying this directory to your Bike 2 extensions
folder. To open that folder select the Bike > Extensions menu item. Once
installed you should see extra commands and sidebar items. Select a layout and
it will be shown in a sheet over your outline. Escape to close.

## Using external libs in extensions

This extension uses d3.js to create layouts for Bike outlines. It's been a
challenge to figure how best to include this library while also providing d3
type checking... here's what I've got and why:

1. Bike extensions cannot rely on a package manager, they must be self
   contained. This means that we cannot use npm to install d3.js and its
   dependencies. We need to include the d3.js library with out extension.

2. I do want to allow users to open and make edits to this extension. When they
   do that they should see d3.js types and autocomplete. This means that in
   addition to including d3.js code I also need to include the d3.js type
   definitions.

When Bike loads an extension it uses `esbuild` to bundle it into a single file
that JSContext can load. One way to solve the above constraints is to just use
npm when creating the extension and distribute node_modules with the extension.
This works, but means the extension will be huge with many uneaded files.

Instead what I have done is:

1. Create a `d3` folder/module
2. Copy the minimized d3.js code into that folder as index.js
3. Copy the d3.js type definitions into that folder as index.d.ts

---

Clean and easy...

Except there is no single index.d.ts file for d3.js. The d3.js library is a
monorepo with many packages. Each package has its own index.d.ts file. How to
combine them for the above use?

```bash
# Install d3 types in node_modules
# This is just needed to generate index.d.ts for d3... we will not ship node_modules with extension.
% npm install

# Install dts-bundle-generator
% npm install dts-bundle-generator

# Generate a single index.d.ts file for d3
% npx dts-bundle-generator --external-inlines d3-array d3-axis d3-brush d3-chord d3-color d3-contour d3-delaunay d3-dispatch d3-drag d3-dsv d3-ease d3-fetch d3-force d3-format d3-geo d3-hierarchy d3-interpolate d3-path d3-polygon d3-quadtree d3-random d3-scale d3-scale-chromatic d3-selection d3-shape d3-time d3-time-format d3-timer d3-transition d3-zoom geojson -o src/dom/d3/index.d.ts -- src/dom/d3/index.source.ts

# I think that should do it... simpler/better ideas welcome. I'm not an expert on javascript build tools.
```

