import { AppExtensionContext, Window } from 'bike/app'
import { headingsCommand, homeCommand, toggleDoneCommand } from './commands'

export async function activate(context: AppExtensionContext) {
  bike.commands.addCommands({
    commands: {
      'bike:home': homeCommand,
      'bike:headings': headingsCommand,
      'bike:toggle-done': toggleDoneCommand,
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
