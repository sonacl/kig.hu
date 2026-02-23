export default function ImageUpload({ featuredImage, setFeaturedImage }) {
  return (
    <div className="bg-gray-50 p-4 border rounded">
      <h3 className="font-bold mb-3 border-b pb-1 text-sm">
        Kiemelt kép (Főoldalon a cikk elején)
      </h3>

      {featuredImage ? (
        <div className="space-y-2">
          <div className="relative aspect-video rounded overflow-hidden border">
            <img src={featuredImage} alt="Preview" className="object-cover w-full h-full" />
          </div>
          <button
            type="button"
            onClick={() => setFeaturedImage('')}
            className="text-red-500 text-xs font-bold hover:underline"
          >
            ✕ Kép eltávolítása
          </button>
        </div>
      ) : (
        <label className="block cursor-pointer border-2 border-dashed border-gray-300 rounded p-6 text-center hover:border-school-blue hover:bg-blue-50/30 transition-colors">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0]
              if (!file) return
              const reader = new FileReader()
              reader.onload = () => setFeaturedImage(reader.result)
              reader.readAsDataURL(file)
            }}
          />
          <svg
            className="w-8 h-8 mx-auto mb-2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-sm text-gray-500">Kattints ide a kép feltöltéséhez</span>
        </label>
      )}
    </div>
  )
}
