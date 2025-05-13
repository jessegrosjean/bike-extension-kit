import process from 'process'
import ts from 'typescript'
import path from 'path'

export function typecheck(configPath) {
  // 1. Read and parse tsconfig.json
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile)
  if (configFile.error) {
    throw new Error(
      ts.formatDiagnosticsWithColorAndContext([configFile.error], {
        getCurrentDirectory: ts.sys.getCurrentDirectory,
        getCanonicalFileName: (f) => f,
        getNewLine: () => ts.sys.newLine,
      })
    )
  }

  // 2. Parse config into compiler options and file list
  const parsed = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(configPath),
    { noEmit: true, skipLibCheck: true } // override
  )

  const program = ts.createProgram({
    rootNames: parsed.fileNames,
    options: parsed.options,
  })

  // 3. Run diagnostics
  const diagnostics = ts.getPreEmitDiagnostics(program)

  if (diagnostics.length) {
    const formatted = ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCurrentDirectory: ts.sys.getCurrentDirectory,
      getCanonicalFileName: (f) => f,
      getNewLine: () => ts.sys.newLine,
    })
    console.error(formatted)
    process.exit(1)
  }
}
