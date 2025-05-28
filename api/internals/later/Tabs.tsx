export interface Tab {
  label: string
  content: React.ReactNode | HTMLElement
}

interface TabsProps {
  tabs: Tab[]
  selected: number
  onSelect: (idx: number) => void
}

const useEffect = window.React.useEffect
const useRef = window.React.useRef

const Tabs: React.FC<TabsProps> = ({ tabs, selected, onSelect }) => {
  const htmlContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentTab = tabs[selected]
    if (currentTab && currentTab.content instanceof HTMLElement && htmlContainerRef.current) {
      htmlContainerRef.current.innerHTML = ''
      htmlContainerRef.current.appendChild(currentTab.content)
      return () => {
        if (currentTab) {
          // Optionally remove the node if it was attached elsewhere
          if (htmlContainerRef.current?.contains(currentTab.content as any)) {
            htmlContainerRef.current.removeChild(currentTab.content as any)
          }
        }
      }
    }
  }, [selected, tabs])

  const currentTab = tabs[selected]

  return (
    <div>
      <div style={{ display: 'flex', borderBottom: '1px solid #ccc' }}>
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(idx)}
            style={{
              padding: 8,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: selected === idx ? 'bold' : 'normal',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ padding: 16 }}>
        {currentTab?.content instanceof HTMLElement ? (
          <div ref={htmlContainerRef} />
        ) : (
          currentTab?.content
        )}
      </div>
    </div>
  )
}

export default Tabs
