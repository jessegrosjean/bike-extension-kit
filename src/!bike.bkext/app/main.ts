import { AppExtensionContext, CommandContext, Window } from 'bike/app'
import { clickHandleCommand, clickLinkCommand } from './commands'

export async function activate(context: AppExtensionContext) {
  // Hidden commands for style interactions (not shown in command palette)
  bike.commands.addCommands({
    commands: {
      'bike:.click-handle': clickHandleCommand,
      'bike:.click-link': clickLinkCommand,
    },
  })

  bike.keybindings.addKeybindings({
    keymap: 'block-mode',
    keybindings: {
      space: 'row:toggle-done',
    },
  })

  bike.keybindings.addKeybindings({
    keymap: 'text-mode',
    keybindings: {
      "'": (context) => wrapTextSelection("'", "'", context),
      '[': (context) => wrapTextSelection('[', ']', context),
      'Shift-"': (context) => wrapTextSelection('"', '"', context),
      'Shift-{': (context) => wrapTextSelection('{', '}', context),
      'Shift-(': (context) => wrapTextSelection('(', ')', context),
    },
  })

  bike.observeWindows(async (window: Window) => {
    window.sidebar.addAction({
      id: 'navigate:home',
      text: 'Home',
      symbol: 'house',
      action: 'navigate:home',
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
