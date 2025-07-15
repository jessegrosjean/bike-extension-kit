import { AppExtensionContext, Window } from 'bike/app'
import {
  headingsCommand,
  homeCommand,
  openLinkCommand,
  toggleDoneCommand,
  toggleFocusCommand,
  toggleFoldCommand,
} from './commands'

export async function activate(context: AppExtensionContext) {
  bike.commands.addCommands({
    commands: {
      'bike:home': homeCommand,
      'bike:headings': headingsCommand,
      'bike:toggle-focus': toggleFocusCommand,
      'bike:toggle-fold': toggleFoldCommand,
      'bike:toggle-done': toggleDoneCommand,
      'bike:open-link': openLinkCommand,
    },
  })

  bike.keybindings.addKeybindings({
    keymap: 'block-mode',
    keybindings: {
      'm d': 'bike:toggle-done',
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
