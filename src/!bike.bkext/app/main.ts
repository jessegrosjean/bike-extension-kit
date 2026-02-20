import { AppExtensionContext, CommandContext, Window } from 'bike/app'
import { clickHandleCommand, clickLinkCommand, clickFocusCommand } from './commands'

export async function activate(context: AppExtensionContext) {
  // Hidden commands for style interactions (not shown in command palette)
  bike.commands.addCommands({
    commands: {
      'bike:.click-handle': clickHandleCommand,
      'bike:.click-focus': clickFocusCommand,
      'bike:.click-link': clickLinkCommand,
      "text:wrap-'": (context) => wrapTextSelection("'", "'", context),
      'text:wrap-[': (context) => wrapTextSelection('[', ']', context),
      'text:wrap-"': (context) => wrapTextSelection('"', '"', context),
      'text:wrap-{': (context) => wrapTextSelection('{', '}', context),
      'text:wrap-(': (context) => wrapTextSelection('(', ')', context),
    },
  })

  bike.keybindings.addKeybindings({
    keymap: 'text-mode',
    keybindings: {
      'Shift-Return': 'row:insert-above',
      'Command-Return': 'row:insert-below',
      'Command-Shift-Return': 'row:insert-child',
      "'": "text:wrap-'",
      '[': 'text:wrap-[',
      'Shift-"': 'text:wrap-"',
      'Shift-{': 'text:wrap-{',
      'Shift-(': 'text:wrap-(',
    },
  })

  bike.keybindings.addKeybindings({
    keymap: 'block-mode',
    keybindings: {
      Space: 'row:toggle-done',
      'Shift-Return': 'row:insert-above',
      'Command-Return': 'row:insert-below',
      'Command-Shift-Return': 'row:insert-child',
    },
  })

  function addOrUpdateHomeLocation(window: Window, representedRowId: string) {
    window.sidebar.addLocation({
      id: 'go:home',
      text: 'Home',
      symbol: 'house',
      action: 'go:home',
      representedRowId: representedRowId,
    })
  }

  bike.observeWindows(async (window: Window) => {
    // hack to make sure home location is added before other locations
    // probably better to add ordering weights to sidebar locations later
    addOrUpdateHomeLocation(window, window.currentOutlineEditor?.outline.root.id ?? '')
    window.observeCurrentOutlineEditor((editor) => {
      addOrUpdateHomeLocation(window, editor?.outline.root.id ?? '')
    })
  })
}

function wrapTextSelection(startChar: string, endChar: string, context: CommandContext): boolean {
  const editor = context.editor
  const selection = editor?.selection

  if (!editor || !selection) {
    return false
  }

  if (selection.type === 'text') {
    const detail = selection.detail
    const selectedText = detail.text.string

    if (selectedText.length > 0) {
      editor.transaction({ animate: 'none' }, () => {
        const row = selection.row
        const wrappedText = startChar + selectedText + endChar
        const range = selection.detail.range
        row.text.replace(range, wrappedText)
        editor.selectText(row, range[0] + 1, range[1] + 1)
      })
      return true
    }
  }

  return false
}
