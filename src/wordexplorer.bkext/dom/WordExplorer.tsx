import { DOMExtensionContext } from 'bike/dom'
import { createRoot } from 'react-dom/client'
import { useState, useEffect } from 'react'

export async function activate(context: DOMExtensionContext) {
  const container = context.element
  const root = createRoot(container)
  root.render(<WordExplorer context={context} />)
}

type WordExplorerProps = {
  context: DOMExtensionContext
}

const WordExplorer: React.FC<WordExplorerProps> = ({ context }) => {
  const [currentWord, setCurrentWord] = useState('')
  const [currentDefinitions, setCurrentDefinitions] = useState([] as string[])
  const [currentSynonyms, setCurrentSynonyms] = useState([] as string[])

  useEffect(() => {
    context.onmessage = (message: any) => {
      if (message.clear) {
        setCurrentWord('')
        setCurrentDefinitions([])
        setCurrentSynonyms([])
      } else if (message.word && message.synonyms) {
        setCurrentWord(message.word)
        setCurrentDefinitions(message.definitions)
        setCurrentSynonyms(message.synonyms)
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      context.postMessage({ type: 'visible', value: entry.isIntersecting })
    })
    
    observer.observe(context.element)

    return () => {
      observer.disconnect()
      context.onmessage = undefined
      context.postMessage({ type: 'visible', value: false })
    }
  }, [])

  const changeWord = (word: string) => {
    context.postMessage({ type: 'changeWord', word })
  }

  if (!currentWord) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--system-secondary-label-color, #888)' }}>
        <p>Select a word to explore</p>
      </div>
    )
  }

  return (
    <div>
      <h1>{currentWord}</h1>
      <div>
        <h2>Definition:</h2>
        <p>{currentDefinitions[0] || ''}</p>
        <h2>Synonyms:</h2>
        <ul
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            listStyle: 'none',
            padding: 0,
            margin: 0,
            gap: '0.25em',
          }}
        >
          {currentSynonyms.map((syn) => (
            <li key={syn}>
              <button onClick={() => changeWord(syn)}>{syn}</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
