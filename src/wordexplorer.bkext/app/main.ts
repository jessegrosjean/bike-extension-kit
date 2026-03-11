import { AppExtensionContext, Window, DOMScriptHandle } from 'bike/app'

export async function activate(context: AppExtensionContext) {
  bike.observeWindows(async (window: Window) => {
    const handle = await window.inspector.addItem({
      tab: 'book',
      label: 'Word Explorer',
      script: 'WordExplorer.js',
    })

    let pendingWord = ''
    let visible = false

    handle.onmessage = (message: any) => {
      switch (message.type) {
        case 'visible':
          visible = message.value
          if (visible && pendingWord) {
            fetchAndPost(handle, pendingWord)
          }
          break
        case 'changeWord':
          if (visible) {
            fetchAndPost(handle, message.word)
          } else {
            pendingWord = message.word
          }
          break
      }
    }

    window.observeCurrentOutlineEditor(async (editor) => {
      if (editor) {
        editor.observeSelection((selection) => {
          if (
            !selection ||
            selection.type != 'text' ||
            selection.word != selection.detail.text.string
          ) {
            pendingWord = ''
            if (visible) {
              handle.postMessage({ clear: true })
            }
            return
          }
          if (visible) {
            fetchAndPost(handle, selection.word)
          } else {
            pendingWord = selection.word
          }
        }, 250)
      }
    })
  })
}

async function fetchAndPost(handle: DOMScriptHandle, word: string) {
  try {
    let [dictionaryJSON, synonymsJSON] = await Promise.all([
      (await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)).json(),
      (await fetch(`https://api.datamuse.com/words?rel_syn=${word}`)).json(),
    ])

    const normalizedWord = dictionaryJSON[0]?.word || word
    const definitions =
      dictionaryJSON[0]?.meanings?.flatMap((meaning: any) =>
        meaning.definitions.map((definition: any) => definition.definition),
      ) || []
    const synonyms = (synonymsJSON as { word: string }[]).map((item) => item.word)
    handle.postMessage({
      word: normalizedWord,
      definitions: definitions,
      synonyms: synonyms,
    })
  } catch (error) {
    console.error('Error fetching synonyms:', error)
  }
}
