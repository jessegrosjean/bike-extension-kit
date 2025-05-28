import { DOMExtensionContext } from '@dom'
import { createRoot } from 'react-dom/client'
import WordExplorer from './WordExplorer'
import { useState } from 'react'

export function activate(context: DOMExtensionContext) {
  const container = context.element
  const root = createRoot(container)

  function onChange(nextValue: any) {
    context.postMessage({
      date: nextValue,
    })
  }

  /*
  const [currentWord, setCurrentWord] = useState('happy')

  const wordData: any = {
    happy: {
      definition: 'Feeling or showing pleasure or contentment.',
      synonyms: ['joyful', 'cheerful', 'content', 'delighted'],
    },
    joyful: {
      definition: 'Feeling, expressing, or causing great pleasure and happiness.',
      synonyms: ['elated', 'gleeful', 'jubilant', 'happy'],
    },
    // Add more word data as needed...
  }

  const handleSynonymClick = (synonym: string) => {
    setCurrentWord(synonym)
  }

  
  const { definition, synonyms } = wordData[currentWord]
*/
  root.render(<App />)

  /*
  const viewer = new SynonymsViewer(context.element, (clickedWord) => {
    // Send the clicked synonym back to the main context for fetch
    context.postMessage(clickedWord)
  })

  context.onmessage = (message: { word: string; synonyms: string[] }) => {
    // Receive the fetch results from the main context and render
    viewer.setWord(message.word)
    viewer.setSynonyms(message.synonyms)
  }
    */
}

const App = () => {
  const [currentWord, setCurrentWord] = useState('happy')

  const wordData: any = {
    happy: {
      definition: 'Feeling or showing pleasure or contentment.',
      synonyms: ['joyful', 'cheerful', 'content', 'delighted'],
    },
    joyful: {
      definition: 'Feeling, expressing, or causing great pleasure and happiness.',
      synonyms: ['elated', 'gleeful', 'jubilant', 'happy'],
    },
    // Add more word data as needed...
  }

  const handleSynonymClick = (synonym: string) => {
    setCurrentWord(synonym)
  }

  const { definition, synonyms } = wordData[currentWord]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <WordExplorer
        word={currentWord}
        definition={definition}
        synonyms={synonyms}
        onSynonymClick={handleSynonymClick}
      />
    </div>
  )
}

/*
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
*/
