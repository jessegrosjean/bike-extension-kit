import { AppExtensionContext, CommandContext, Window } from 'bike/app'
import {
  clickHandleCommand,
  clickLinkCommand,
  headingsCommand,
  homeCommand,
  openLinkCommand,
  toggleDoneCommand,
  toggleFocusCommand,
  toggleFoldCommand,
} from './commands'

import { moveDownMaintainingLevelCommand, moveUpMaintainingLevelCommand } from './move-commands'

export async function activate(context: AppExtensionContext) {
  bike.commands.addCommands({
    commands: {
      'bike:home': homeCommand,
      'bike:headings': headingsCommand,
      'bike:toggle-focus': toggleFocusCommand,
      'bike:toggle-fold': toggleFoldCommand,
      'bike:move-up-maintaining-level': moveUpMaintainingLevelCommand,
      'bike:move-down-maintaining-level': moveDownMaintainingLevelCommand,
      'bike:toggle-done': toggleDoneCommand,
      'bike:open-link': openLinkCommand,
      'bike:.click-handle': clickHandleCommand,
      'bike:.click-link': clickLinkCommand,
    },
  })

  bike.keybindings.addKeybindings({
    keymap: 'block-mode',
    keybindings: {
      space: 'bike:toggle-done',
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
    window.sidebar.addItem({
      id: 'bike:home',
      text: 'Home',
      symbol: 'house',
      ordering: { section: 'actions' },
      action: 'bike:home',
    })

    window.sidebar.addItem({
      id: 'bike:headings',
      text: 'Headings 􀱁',
      ordering: { section: 'filters' },
      isGroup: true,
      action: 'bike:headings',
      children: {
        query: '//heading',
      },
    })
  })
}

function wrapTextSelection(startChar: string, endChar: string, context: CommandContext): boolean {
  const editor = context.editor
  const selection = editor.selection

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
