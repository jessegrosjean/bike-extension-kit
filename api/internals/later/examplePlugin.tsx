import { tabRegistry } from './TabsWithPlugins'

// Create a plain HTML element as content
const htmlElement = document.createElement('div')
htmlElement.style.color = 'green'
htmlElement.innerText = 'This tab was added by a plugin using a plain HTML element!'

// Register this tab via the registry
tabRegistry.addTab({
  label: 'Plugin (HTML)',
  content: htmlElement,
})

// You could also register a React element:
tabRegistry.addTab({
  label: 'Plugin (React)',
  content: <div>This tab was added by a plugin using React JSX!</div>,
})
