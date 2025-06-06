import { DOMExtensionContext } from 'bike/dom'

export async function activate(context: DOMExtensionContext) {
  context.element.textContent = 'Activated in DOM extension context'
}
