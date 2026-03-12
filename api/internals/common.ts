import './common.css'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as ReactDOMClient from 'react-dom/client'
import * as ReactJSXRuntime from 'react/jsx-runtime'
import * as BikeComponents from './components'

// Expose React and ReactDOM globally for use in DOM scripts.
//
// 1) DOM scripts should be able to use imports like `import { createRoot } from
//    'react-dom/client'
// 2) DOM scripts should be able to use TSX syntax without needing to import React
//    explicitly`, just use .tsx extension
// 3) Should only need to bundle react with Bike, not with each DOM script.
//
// This is done here and also in build `build-extension.mjs` build script where
// these globals are looked up via externalGlobalPlugin.

window.React = React
window.ReactDOM = ReactDOM
window.ReactDOMClient = ReactDOMClient
window.ReactJSXRuntime = ReactJSXRuntime

interface SFSymbolOptions {
  weight?: 'ultralight' | 'thin' | 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'heavy' | 'black'
  scale?: 'small' | 'medium' | 'large'
}

/**
 * Returns a URL string for the named SF Symbol.
 *
 * @param name - SF Symbol name (e.g. "chevron.left", "star.fill")
 * @param options - Optional weight and scale
 */
function symbolURL(name: string, options?: SFSymbolOptions): string {
  const params = new URLSearchParams()
  if (options?.weight) params.set('weight', options.weight)
  if (options?.scale) params.set('scale', options.scale)
  const query = params.toString()
  return `bike-symbol://${name}${query ? '?' + query : ''}`
}

window.symbolURL = symbolURL
window.BikeComponents = BikeComponents

declare global {
  interface Window {
    ReactDOMClient: any
    ReactJSXRuntime: any
    BikeComponents: typeof BikeComponents
    symbolURL(name: string, options?: SFSymbolOptions): string
  }
  /** Returns a URL string for the named SF Symbol. */
  function symbolURL(name: string, options?: SFSymbolOptions): string
}
