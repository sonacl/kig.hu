'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function RedirectsClient() {
  const [redirects, setRedirects] = useState([])
  const [source, setSource] = useState('')
  const [destination, setDestination] = useState('')
  const [editId, setEditId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchRedirects = async () => {
    try {
      const res = await fetch('/api/redirects')
      const data = await res.json()
      if (Array.isArray(data)) setRedirects(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchRedirects()
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    setIsLoading(true)

    const payload = { source, destination }
    const url = editId ? `/api/redirects/${editId}` : '/api/redirects'
    const method = editId ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        setSource('')
        setDestination('')
        setEditId(null)
        fetchRedirects()
      } else {
        const error = await res.json()
        alert('Hiba: ' + (error.error || 'Mentés sikertelen.'))
      }
    } catch (err) {
      alert('Network error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async id => {
    if (!confirm('Biztosan törölni szeretné ezt az átirányítást?')) return
    try {
      await fetch(`/api/redirects/${id}`, { method: 'DELETE' })
      fetchRedirects()
    } catch (e) {
      alert('Delete failed')
    }
  }

  const handleEdit = redirect => {
    setEditId(redirect.id)
    setSource(redirect.source)
    setDestination(redirect.destination)
  }

  return (
    <div className="bg-white p-6 rounded border shadow-sm max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Átirányítások</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-4 mb-8 bg-gray-50 p-4 border rounded"
      >
        <Input
          placeholder="Forrás (pl. /kreta)"
          value={source}
          onChange={e => setSource(e.target.value)}
          required
        />
        <Input
          placeholder="Cél (pl. https://pszichodermikus.hu)"
          value={destination}
          onChange={e => setDestination(e.target.value)}
          required
        />
        <Button type="submit" disabled={isLoading} className="md:w-auto w-full whitespace-nowrap">
          {editId ? 'Szerkesztés' : 'Hozzáadás'}
        </Button>
        {editId && (
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              setEditId(null)
              setSource('')
              setDestination('')
            }}
          >
            Mégsem
          </Button>
        )}
      </form>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 font-bold text-gray-700">Forrás</th>
              <th className="px-4 py-3 font-bold text-gray-700">Cél (URL)</th>
              <th className="px-4 py-3 font-bold text-gray-700">Műveletek</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {redirects.map(r => (
              <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 font-medium text-school-blue">{r.source}</td>
                <td className="px-4 py-4 break-all">{r.destination}</td>
                <td className="px-4 py-4 flex flex-row items-center gap-3">
                  <Button variant="ghost" onClick={() => handleEdit(r)}>
                    Szerkesztés
                  </Button>
                  <Button variant="ghostDanger" onClick={() => handleDelete(r.id)}>
                    Törlés
                  </Button>
                </td>
              </tr>
            ))}
            {redirects.length === 0 && (
              <tr>
                <td colSpan="3" className="px-4 py-10 text-center text-gray-400 italic">
                  Még nincsenek átirányítások rögzítve.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
