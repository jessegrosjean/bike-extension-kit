import { DOMExtensionContext } from 'bike/dom'

export async function activate(context: DOMExtensionContext) {
  context.element.textContent = 'Loading...'
  context.onmessage = (message) => {
    context.element.textContent = message
  }
}
