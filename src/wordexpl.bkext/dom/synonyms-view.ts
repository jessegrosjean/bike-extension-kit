import { DOMExtensionContext } from '@dom'

export function activate(context: DOMExtensionContext) {
  const viewer = new SynonymsViewer(context.element, (clickedWord) => {
    // Send the clicked synonym back to the main context for fetch
    context.postMessage(clickedWord)
  })

  context.onmessage = (message: { word: string; synonyms: string[] }) => {
    // Receive the fetch results from the main context and render
    viewer.setWord(message.word)
    viewer.setSynonyms(message.synonyms)
  }
}

class SynonymsViewer {
  private container: HTMLElement
  private currentWord: string = ''
  private callback?: (synonym: string) => void

  constructor(container: HTMLElement, onClick?: (synonym: string) => void) {
    this.container = container
    this.callback = onClick
  }

  setWord(word: string) {
    this.currentWord = word.trim()
    if (!this.currentWord) {
      this.container.innerHTML = '<em>No word provided.</em>'
      return
    }
  }

  setSynonyms(synonyms: string[]) {
    if (!synonyms.length) {
      this.container.innerHTML = `<p>No synonyms found for "<strong>${this.currentWord}</strong>".</p>`
      return
    }

    const list = document.createElement('ul')

    for (const entry of synonyms) {
      const li = document.createElement('li')
      li.textContent = entry
      li.style.cursor = 'pointer'

      li.addEventListener('click', () => {
        if (this.callback) this.callback(entry)
      })

      list.appendChild(li)
    }

    this.container.innerHTML = `<p>Synonyms for "<strong>${this.currentWord}</strong>":</p>`
    this.container.appendChild(list)
  }
}
