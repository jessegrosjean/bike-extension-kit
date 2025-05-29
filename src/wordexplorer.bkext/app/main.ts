import { AppExtensionContext, Window, DOMScriptHandle } from '@app'

export async function activate(context: AppExtensionContext) {
  bike.observeWindows(async (window: Window) => {
    const synonymsHandle = await window.inspector.addItem({
      id: 'word-explorer',
      name: 'WordExplorer.js',
    })

    synonymsHandle.onmessage = (message: string) => {
      fetchSynonymsAndPostToDOM(synonymsHandle, message)
    }

    window.observeCurrentOutlineEditor(async (editor) => {
      if (editor) {
        editor.observeSelection((selection) => {
          if (
            !selection ||
            selection.type != 'text' ||
            selection.word != selection.detail.text.string
          ) {
            return
          }
          fetchSynonymsAndPostToDOM(synonymsHandle, selection.word)
        }, 250)
      }
    })
  })
}

async function fetchSynonymsAndPostToDOM(handle: DOMScriptHandle, word: string) {
  try {
    let [dictionaryJSON, synonymsJSON] = await Promise.all([
      (await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)).json(),
      (await fetch(`https://api.datamuse.com/words?rel_syn=${word}`)).json(),
    ])

    const normalizedWord = dictionaryJSON[0]?.word || word
    const definitions =
      dictionaryJSON[0]?.meanings?.flatMap((meaning: any) =>
        meaning.definitions.map((definition: any) => definition.definition)
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
