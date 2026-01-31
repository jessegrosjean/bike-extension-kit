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
      'bike:home': { action: homeCommand, symbol: 'house' },
      'bike:headings': { action: headingsCommand, symbol: 'list.number' },
      'bike:toggle-focus': { action: toggleFocusCommand, symbol: 'scope' },
      'bike:toggle-fold': { action: toggleFoldCommand, symbol: 'chevron.down.circle' },
      'bike:move-up-maintaining-level': { action: moveUpMaintainingLevelCommand, symbol: 'arrow.up' },
      'bike:move-down-maintaining-level': { action: moveDownMaintainingLevelCommand, symbol: 'arrow.down' },
      'bike:toggle-done': { action: toggleDoneCommand, symbol: 'checkmark.square' },
      'bike:open-link': { action: openLinkCommand, symbol: 'link' },
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
    window.sidebar.addAction({
      id: 'bike:home',
      text: 'Home',
      symbol: 'house',
      action: 'bike:home',
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
