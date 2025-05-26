import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as ReactDOMClient from 'react-dom/client'

window.React = React
window.ReactDOM = ReactDOM
window['ReactDOMClient'] = ReactDOMClient

/*
const root = createRoot(document.body)

root.render(
  <TabsProvider>
    <Tabs />
  </TabsProvider>
)

setTimeout(() => {
  loadPlugin1()
}, 1000)

setTimeout(() => {
  loadPlugin2()
}, 2000)

function loadPlugin1() {
  window.registerTab?.({
    id: 'plugin1',
    title: 'Plugin 1',
    content: React.createElement('div', null, 'Rendered by React!'),
  })
}

function loadPlugin2() {
  const el = document.createElement('div')

  el.innerHTML = '<button>Click Me!</button>'
  el.querySelector('button')?.addEventListener('click', () => alert('Clicked!'))

  window.registerTab?.({
    id: 'plugin2',
    title: 'Plugin 2',
    contentElement: el,
  })
}
*/
