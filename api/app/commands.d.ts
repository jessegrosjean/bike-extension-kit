import { Range, Row } from './outline'
import { OutlineEditor, Selection } from './outline-editor'
import { Disposable } from './system'

/** Interface for managing commands. */
interface Commands {
  /**
   * Adds commands to the app.
   * @param commands - The commands to add.
   * @returns Disposable removes added commands.
   */
  addCommands(commands: { commands: Record<CommandName, CommandAction> }): Disposable

  /**
   * Performs the named command.
   * @param command - The name of the command to perform.
   * @returns Undefined if the command was not found. True if the command
   * was found and returned true when performed. False if the command was
   * found but returned false when performed.
   */
  performCommand(command: CommandName): boolean | undefined

  /** Debugging function to list all commands. */
  toString(): string
}

/** The name of the command in the form `catagory:name-of-command` */
type CommandName = string

/**
 * Context passed to command action.
 *
 * Generally the frontmost outline editor and that editor's selection are
 * passed. In some cases (such as when clicking text run decoration with
 * associated command) the selection is created from the decoration's run range,
 * not the editor selection.
 */
export type CommandContext = {
  editor?: OutlineEditor
  selection?: Selection
}

/**
 * The closure to perform when a command is triggered. When false is
 * returned lower priority commands with same CommandName are triggered
 * until on returns true or no more commands match.
 */
type CommandAction = (context: CommandContext) => boolean
