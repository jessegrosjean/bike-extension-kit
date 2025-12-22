declare global {
  interface Window {
    BikeInspector: any
  }
}

// Add padding above the inspector
const style = document.createElement('style')
style.textContent = 'body { padding-top: 32px; }'
document.head.appendChild(style)

window.BikeInspector = {}

export {}
