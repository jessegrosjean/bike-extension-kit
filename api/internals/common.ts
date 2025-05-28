import './common.css'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as ReactDOMClient from 'react-dom/client'
import * as ReactJSXRuntime from 'react/jsx-runtime'

// Expose React and ReactDOM globally for use in plugins.
//
// 1) Plugins shoul be able to use imports like `import { createRoot } from
//    'react-dom/client'
// 2) Plugins should be able to use TSX syntax without needing to import React
//    explicitly`, just use .tsx extension
// 3) Should only need to bundle react with Bike, not with each plugin.
//
// This is done here and also in build `build-extension.mjs` build script where
// these globals are looked up via externalGlobalPlugin.

window.React = React
window.ReactDOM = ReactDOM
window.ReactDOMClient = ReactDOMClient
window.ReactJSXRuntime = ReactJSXRuntime

declare global {
  interface Window {
    ReactDOMClient: any
    ReactJSXRuntime: any
  }
}
