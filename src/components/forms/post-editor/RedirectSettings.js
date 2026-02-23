import { Input } from '@/components/ui/Input'

export default function RedirectSettings({ redirectUrl, setRedirectUrl, isAktualis, isKozhasznu }) {
  const isRedirect = redirectUrl.trim().length > 0

  return (
    <div className="bg-gray-50 p-4 border rounded">
      <h3 className="font-bold mb-3 border-b pb-1 text-sm">Továbbítás (Redirect)</h3>
      <Input
        placeholder="Pl. https://kig.hu/vagy-mas vagy /valami (opcionális)"
        className="mb-2"
        value={redirectUrl}
        onChange={e => setRedirectUrl(e.target.value)}
      />
      <p className="text-xs text-gray-500">
        Ha kitöltöd, ez egy átirányítás lesz — tartalom nem szükséges.
      </p>

      {isRedirect && !isAktualis && !isKozhasznu && (
        <p className="text-red-500 text-xs mt-2 font-bold">
          ⚠ Átirányításnál legalább az Aktuális vagy Közhasznú legyen bejelölve!
        </p>
      )}
    </div>
  )
}
