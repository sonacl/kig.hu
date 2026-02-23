import { TAG_LABELS } from '@/lib/constants'

export default function TagSelector({ selectedTags, setSelectedTags }) {
  return (
    <div className="bg-gray-50 p-4 border rounded">
      <h3 className="font-bold mb-3 border-b pb-1 text-sm">Tagozat (Címkék)</h3>
      <div className="space-y-2">
        {Object.entries(TAG_LABELS).map(([icon, label]) => (
          <label key={icon} className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={selectedTags.includes(icon)}
              onChange={e => {
                if (e.target.checked) setSelectedTags([...selectedTags, icon])
                else setSelectedTags(selectedTags.filter(t => t !== icon))
              }}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
