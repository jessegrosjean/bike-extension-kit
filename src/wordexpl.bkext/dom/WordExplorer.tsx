type WordExplorerProps = {
  word: string
  definition: string
  synonyms: string[]
  onSynonymClick: (synonym: string) => void
}

const WordExplorer: React.FC<WordExplorerProps> = ({
  word,
  definition,
  synonyms,
  onSynonymClick,
}) => {
  return (
    <div className="p-4 max-w-md bg-white shadow rounded-2xl">
      <h1 className="text-2xl font-bold mb-2">{word}</h1>
      <p className="text-gray-700 mb-4">{definition}</p>
      <div>
        <h2 className="text-lg font-semibold mb-1">Synonyms:</h2>
        <ul className="flex flex-wrap gap-2">
          {synonyms.map((syn) => (
            <li key={syn}>
              <button
                onClick={() => onSynonymClick(syn)}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm font-medium px-3 py-1 rounded-full transition"
              >
                {syn}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default WordExplorer
