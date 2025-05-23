// JESSE SAYS: NOT SETUP OR WORKING YET

import * as td from 'typedoc'

// Application.bootstrap also exists, which will not load plugins
// Also accepts an array of option readers if you want to disable
// TypeDoc's tsconfig.json/package.json/typedoc.json option readers
const app = await td.Application.bootstrapWithPlugins({
  // Note: This accepts globs, do not pass paths with backslash path separators!
  entryPoints: ['app/test.d.ts'],
})

// May be undefined if errors are encountered.
const project = await app.convert()

if (project) {
  // Generate configured outputs
  await app.generateOutputs(project)

  // Alternatively...
  const outputDir = 'docs'
  // Generate HTML rendered docs
  await app.generateDocs(project, outputDir)
  // Alternatively generate JSON output
  await app.generateJson(project, outputDir + '/docs.json')
}
