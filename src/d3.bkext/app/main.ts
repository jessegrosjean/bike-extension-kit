import { AppExtensionContext, Window, DOMScriptName, Row, CommandContext } from 'bike/app'

export async function activate(context: AppExtensionContext) {
  bike.commands.addCommands({
    commands: {
      'd3:show-tree-view': (context: CommandContext) => {
        showD3Sheet('tree-view.js')
        return true
      },
      'd3:show-radial-view': (context: CommandContext) => {
        showD3Sheet('radial-view.js')
        return true
      },
    },
  })

  bike.observeWindows(async (window: Window) => {
    window.sidebar.addItem({
      id: 'd3:tree-view',
      text: 'Tree View',
      symbol: 'tree',
      ordering: { section: 'actions' },
      action: 'd3:show-tree-view',
    })

    window.sidebar.addItem({
      id: 'd3:radial-view',
      text: 'Radial View',
      symbol: 'tree.circle',
      ordering: { section: 'actions' },
      action: 'd3:show-radial-view',
    })
  })
}

async function showD3Sheet(domScriptName: DOMScriptName) {
  let window = bike.frontmostWindow
  if (window) {
    let handle = await window.presentSheet(domScriptName)
    let editor = window.currentOutlineEditor
    if (editor) {
      handle.postMessage({
        type: 'load',
        data: buildD3Hierarchy(editor.focus),
      })
    }
    handle.onmessage = (message) => {
      let editor = window.currentOutlineEditor
      if (editor && message.type === 'select') {
        let row = editor.outline.getRowById(message.id)
        if (row) {
          editor.selectRows(row)
        }
      }
      handle.dispose()
    }
  }
}

function buildD3Hierarchy(row: Row): any {
  return {
    id: row.id,
    name: trimString(row.text.string, 32),
    children: row.children
      .filter((child) => child.firstChild || child.text.string.length > 0)
      .map(buildD3Hierarchy),
  }
}

function trimString(string: string, maxLength: number): string {
  if (string.length <= maxLength) {
    return string
  }
  return string.slice(0, maxLength - 1) + '…'
}
