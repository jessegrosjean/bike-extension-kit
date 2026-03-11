# Bike Internals

This is code that ships with Bike and provides the context where your DOM extensions will run.

## Files

- **common.css** — System fonts and colors available to all DOM contexts
- **common.ts** — Exposes React, ReactDOM, ReactDOMClient, and ReactJSXRuntime globally so extensions don't need to bundle React
- **inspector.html/tsx** — Host page and tab container management for inspector panels
- **sheet.html/tsx** — Host page for DOM sheets presented via `presentSheet()`