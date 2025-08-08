import { CommandName } from './commands'
import { Disposable } from './system'

/** Interface to manage outline editor Keybindings. */
interface Keybindings {
  /**
   * Current active modifier keys.
   *
   * Result contains modifiers such as `Command`, `Control`, `Option`, and
   * `Shift` in addition to the key that trigged the modifier such as
   * `LeftCommand`, `RightControl`, etc.
   */
  activeModifiers: String[]
  /**
   * Adds keybindings to a named outline editor keymap.
   *
   * Keybindings are only used when the outline editor has focus. They
   * will not be processed otherwise.
   *
   * @param keybindings - The keybindings to add.
   * @returns Disposable removes added keybindings.
   */
  addKeybindings(keybindings: {
    keymap: KeymapName
    keybindings: Record<KeySequence, KeybindingAction>
    priority?: number
  }): Disposable

  /** Debugging function to list all keybindings. */
  toString(): string
}

/**
 * Name of existing keymap. In Bike the text-mode keymap is used when the
 * selection is of type caret or range. The block-mode keymap is used when
 * the selection is of type block.
 */
type KeymapName = 'text-mode' | 'block-mode'

/**
 * Keysequence to trigger an action.
 *
 * A key is a single case-insensitive typed "key" combined with zero or more
 * modifiers. For example `a`, `ctrl+a`, `ctrl+shift+a`, and `ctrl+alt+a`
 * are all valid keys. Keys are combined with a space to create a
 * keysequence.
 *
 * Modifiers:
 *
 * - Command (alias: cmd)
 * - Control (alias: ctrl)
 * - Option (alias: opt)
 * - Shift
 *
 * Keys:
 * - typed a-z, 0-9, etc
 * - Return
 * - Tab
 * - Space
 * - Delete
 * - Escape
 * - LeftCommand
 * - RightCommand
 * - LeftControl
 * - RightControl
 * - LeftOption
 * - RightOption
 * - LeftShift
 * - RightShift
 * - CapsLock
 * - LeftArrow (alias: left)
 * - RightArrow (alias: right)
 * - UpArrow (alias: up)
 * - DownArrow (alias: down)
 * - VolumeUp
 * - VolumeDown
 * - Mute
 * - Help
 * - Home
 * - PageUp
 * - PageDown
 * - ForwardDelete
 * - End
 * - Function
 * - F1
 * - F2
 * - F3
 * - F4
 * - F5
 * - F6
 * - F7
 * - F8
 * - F9
 * - F10
 * - F11
 * - F12
 * - F13
 * - F14
 * - F15
 * - F16
 * - F17
 * - F18
 * - F19
 * - F20
 *
 * Examples:
 *
 * - space
 * - m d
 * - cmd-s
 * - ctrl-x ctrl-s
 */
type KeySequence = string

/**
 * The command or closure to perform. If returns false then matching
 * keybindings with lower priority will be tried.
 */
type KeybindingAction = CommandName | (() => boolean)

/** Typed key such as `a` or `;`. */
type Key = string
