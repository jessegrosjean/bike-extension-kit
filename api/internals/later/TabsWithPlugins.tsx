import SimpleTabs, { Tab } from './Tabs'

const useState = window.React.useState
const useEffect = window.React.useEffect

// Expose a registry for plugins to add tabs
export const tabRegistry: { addTab: (tab: Tab) => void } = {
  addTab: () => {},
}

let elementHTML = document.createElement('div')
elementHTML.textContent = 'This is Tab 2 (HTML content)'

const TabsWithPlugins: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([])
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    debugger
    // Register the addTab function for plugins
    tabRegistry.addTab = (tab: Tab) => {
      debugger
      setTabs((prev) => [...prev, tab])
    }
    // Cleanup
    return () => {
      tabRegistry.addTab = () => {}
    }
  }, [])

  return <SimpleTabs tabs={tabs} selected={selected} onSelect={setSelected} />
}

export default TabsWithPlugins
