# Sharing Extensions

Once your extension is working locally, you can package it for distribution and
list it in the Bike extensions registry so other users can install it from
Settings > Extensions > Browse.

## 1. Package

Build your extensions, then create ZIP files ready for distribution:

```sh
npm run build
npm run package
```

This creates a `.bkext.zip` for each extension in `out/packages/`.

## 2. Create a GitHub Release

Release a single extension using the `release` script. It reads the version
from the extension's `manifest.json` and creates a GitHub Release tagged
`<id>-v<version>` with the ZIP attached.

This requires the [`gh` CLI](https://cli.github.com) to be installed and
authenticated (`gh auth login`).

```sh
npm run release -- calendar   # creates release "calendar-v1.0.0"
npm run release -- d3         # creates release "d3-v2.1.0"
```

Each extension is released independently with its own version. The download
URL for the attached ZIP asset is what you'll provide to the registry.

## 3. Submit to the registry

Add your extension to the
[bike-extensions](https://github.com/jessegrosjean/bike-extensions) registry so
users can discover and install it from within Bike. See that repo's README for
the entry format and pull request instructions.

## Automated releases with GitHub Actions

You can automate packaging and releasing with a GitHub Actions workflow. Add
this as `.github/workflows/release.yml` in your repo:

```yaml
name: Release Extension

on:
  push:
    tags:
      - "*-v*" # e.g. calendar-v1.0.0

jobs:
  release:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
      - run: npm run package
      - name: Extract extension ID from tag
        id: ext
        run: echo "id=${GITHUB_REF_NAME%-v*}" >> "$GITHUB_OUTPUT"
      - run: npm run release -- ${{ steps.ext.outputs.id }}
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Tag a commit (e.g. `git tag calendar-v1.0.0 && git push --tags`) and the
workflow will build, package, and release that extension automatically.
