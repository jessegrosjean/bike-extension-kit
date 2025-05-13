import { AppExtensionContext, Outline } from '@app'

export async function activate(context: AppExtensionContext) {
  console.log('Word Explorer extension activated!!!!!!!!')
  let outline = new Outline()
  console.log('Outline created')
  console.log(outline)
}

/*
import { AppExtensionContext, Window, InspectorItem, DOMScriptHandle } from "@app";
export async function activate(context: AppExtensionContext) {
    bike.observeWindows(async (window: Window) => {
        const synonymsHandle = await window.inspector.addItem({
            id: "bike:synonyms",
            name: "synonyms.ts",
        });
        
        synonymsHandle.onmessage = (message: string) => {
            fetchSynonymsAndPostToDOM(synonymsHandle, message);
        }
        
        window.observeCurrentOutlineEditor(async (editor) => {
            if (editor) {
                editor.observeSelection((selection) => {
                    if (!selection || selection.type != "text" || selection.word != selection.detail.text.string) {
                        return
                    }
                    fetchSynonymsAndPostToDOM(synonymsHandle, selection.word);
                }, 250);
            }
        });
    });
}

async function fetchSynonymsAndPostToDOM(handle: DOMScriptHandle, word: string) {
    try {
        const response = await fetch(`https://api.datamuse.com/words?rel_syn=${word}`)
        const json = await response.json() as { word: string }[]
        const synonyms = json.map((item) => item.word);
        handle.postMessage({
            word: word,
            synonyms: synonyms
        });
    } catch (error) {
        console.error("Error fetching synonyms:", error);
    }
}*/
