'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function NavbarClient() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/navbar')
      const data = await res.json()
      if (Array.isArray(data)) setItems(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/navbar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })
      if (res.ok) {
        alert('Navigáció sikeresen mentve! (Frissítsd az oldalt a változások megtekintéséhez)')
        fetchItems()
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

  const addItem = () => {
    setItems([...items, { label: 'Új Menüpont', url: '', subItems: [] }])
  }

  const updateItem = (index, field, value) => {
    const newItems = [...items]
    newItems[index][field] = value
    setItems(newItems)
  }

  const deleteItem = index => {
    setItems(items.filter((_, i) => i !== index))
  }

  const addSubItem = parentIndex => {
    const newItems = [...items]
    if (!newItems[parentIndex].subItems) newItems[parentIndex].subItems = []
    newItems[parentIndex].subItems.push({ label: 'Új almenü', url: '' })
    setItems(newItems)
  }

  const updateSubItem = (parentIndex, subIndex, field, value) => {
    const newItems = [...items]
    newItems[parentIndex].subItems[subIndex][field] = value
    setItems(newItems)
  }

  const deleteSubItem = (parentIndex, subIndex) => {
    const newItems = [...items]
    newItems[parentIndex].subItems = newItems[parentIndex].subItems.filter((_, i) => i !== subIndex)
    setItems(newItems)
  }

  const moveItem = (index, direction) => {
    const newItems = [...items]
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= newItems.length) return
    const temp = newItems[index]
    newItems[index] = newItems[targetIndex]
    newItems[targetIndex] = temp
    setItems(newItems)
  }

  const moveSubItem = (parentIndex, subIndex, direction) => {
    const newItems = [...items]
    const subItems = [...newItems[parentIndex].subItems]
    const targetIndex = subIndex + direction
    if (targetIndex < 0 || targetIndex >= subItems.length) return
    const temp = subItems[subIndex]
    subItems[subIndex] = subItems[targetIndex]
    subItems[targetIndex] = temp
    newItems[parentIndex].subItems = subItems
    setItems(newItems)
  }

  return (
    <div className="bg-white p-6 rounded border shadow-sm max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Navigáció Beállítása</h1>
        <Button onClick={addItem}>+ Fő Menüpont Hozzáadása</Button>
      </div>

      <div className="space-y-4 mb-8">
        {items.map((item, index) => (
          <div key={index} className="border rounded p-4 bg-gray-50 flex flex-col gap-3">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="flex shrink-0 gap-1">
                <Button
                  variant="outline"
                  className="px-2"
                  disabled={index === 0}
                  onClick={() => moveItem(index, -1)}
                >
                  ↑
                </Button>
                <Button
                  variant="outline"
                  className="px-2"
                  disabled={index === items.length - 1}
                  onClick={() => moveItem(index, 1)}
                >
                  ↓
                </Button>
              </div>

              <div className="grow flex items-center gap-2 w-full">
                <span className="font-bold text-gray-500 whitespace-nowrap">{index + 1}.</span>
                <Input
                  className="bg-white"
                  placeholder="Címke (pl. Iskolánk)"
                  value={item.label}
                  onChange={e => updateItem(index, 'label', e.target.value)}
                />
                <Input
                  className="bg-white"
                  placeholder="Link (/post-slug) - Üres ha lenyíló!"
                  value={item.url || ''}
                  onChange={e => updateItem(index, 'url', e.target.value)}
                />
              </div>
              <div className="flex shrink-0 gap-2 w-full md:w-auto mt-2 md:mt-0">
                <Button variant="outline" size="sm" onClick={() => addSubItem(index)}>
                  + Almenü
                </Button>
                <Button variant="danger" size="sm" onClick={() => deleteItem(index)}>
                  Törlés
                </Button>
              </div>
            </div>

            {item.subItems && item.subItems.length > 0 && (
              <div className="pl-8 flex flex-col gap-2 mt-2 border-t pt-3">
                {item.subItems.map((sub, sIndex) => (
                  <div key={sIndex} className="flex gap-2 items-center">
                    <span className="text-gray-400">↳</span>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        variant="ghost"
                        className="px-1 text-xs"
                        disabled={sIndex === 0}
                        onClick={() => moveSubItem(index, sIndex, -1)}
                      >
                        ▲
                      </Button>
                      <Button
                        variant="ghost"
                        className="px-1 text-xs"
                        disabled={sIndex === item.subItems.length - 1}
                        onClick={() => moveSubItem(index, sIndex, 1)}
                      >
                        ▼
                      </Button>
                    </div>
                    <Input
                      className="bg-white text-sm"
                      placeholder="Almenü Címke"
                      value={sub.label}
                      onChange={e => updateSubItem(index, sIndex, 'label', e.target.value)}
                    />
                    <Input
                      className="bg-white text-sm"
                      placeholder="Link (/post-slug)"
                      value={sub.url}
                      onChange={e => updateSubItem(index, sIndex, 'url', e.target.value)}
                    />
                    <Button variant="ghostDanger" onClick={() => deleteSubItem(index, sIndex)}>
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-center text-gray-400 py-10 italic">
            Nincsenek menüpontok. Kattintson a hozzáadásra!
          </p>
        )}
      </div>

      <div className="pt-4 border-t flex justify-end">
        <Button onClick={handleSave} disabled={isLoading} className="w-full md:w-auto px-8">
          {isLoading ? 'Mentés folyamatban...' : 'Változtatások Mentése'}
        </Button>
      </div>
    </div>
  )
}
