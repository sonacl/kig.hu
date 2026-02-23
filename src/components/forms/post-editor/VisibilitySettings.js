export default function VisibilitySettings({
  status,
  setStatus,
  isAktualis,
  setIsAktualis,
  isKozhasznu,
  setIsKozhasznu,
  description,
  setDescription,
  showStatus = true,
}) {
  return (
    <div className="bg-gray-50 p-4 border rounded">
      <h3 className="font-bold mb-3 border-b pb-1 text-sm">Beállítások</h3>

      {showStatus && (
        <div className="mb-4">
          <label className="block text-sm font-bold mb-1">Láthatóság</label>
          <select
            className="w-full px-3 py-2 border rounded"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="PUBLIC">Nyilvános (Látható mindenkinek)</option>
            <option value="UNLISTED">Rejtett (Csak linkkel elérhető)</option>
            <option value="HIDDEN">Privát (Csak adminisztrátoroknak)</option>
          </select>
        </div>
      )}

      <label className="flex items-center gap-2 text-sm cursor-pointer mb-2">
        <input
          type="checkbox"
          checked={isAktualis}
          onChange={e => setIsAktualis(e.target.checked)}
        />
        Aktuális rovatba (főoldal oldalsáv)
      </label>

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={isKozhasznu}
          onChange={e => setIsKozhasznu(e.target.checked)}
        />
        Közhasznú infó (főoldal oldalsáv)
      </label>

      {isKozhasznu && (
        <div className="mt-3 pt-3 border-t">
          <label className="block text-sm font-bold mb-1">Közhasznú leírás</label>
          <textarea
            className="w-full px-3 py-2 border rounded text-sm"
            rows={3}
            placeholder="Rövid leírás az oldalsávba..."
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
      )}
    </div>
  )
}
