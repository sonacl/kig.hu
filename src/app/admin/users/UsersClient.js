'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ROLE_LABELS } from '@/lib/constants'

export default function UsersClient() {
  const [users, setUsers] = useState([])
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('EDITOR')
  const [editId, setEditId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      if (Array.isArray(data)) setUsers(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    setIsLoading(true)

    const payload = { email, name, role }
    const url = editId ? `/api/users/${editId}` : '/api/users'
    const method = editId ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        resetForm()
        fetchUsers()
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
    if (!confirm('Biztosan törölni szeretné ezt a felhasználót?')) return
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const error = await res.json()
        alert('Hiba: ' + (error.error || 'Törlés sikertelen.'))
      } else {
        fetchUsers()
      }
    } catch (e) {
      alert('Delete failed')
    }
  }

  const handleEdit = user => {
    setEditId(user.id)
    setEmail(user.email)
    setName(user.name || '')
    setRole(user.role || 'EDITOR')
    setShowForm(true)
  }

  const resetForm = () => {
    setEditId(null)
    setEmail('')
    setName('')
    setRole('EDITOR')
    setShowForm(false)
  }

  return (
    <div className="bg-white p-6 rounded border shadow-sm max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Felhasználók</h1>
        {!showForm && <Button onClick={() => setShowForm(true)}>+ Új hozzáadása</Button>}
      </div>

      {showForm && (
        <UserForm
          email={email}
          setEmail={setEmail}
          name={name}
          setName={setName}
          role={role}
          setRole={setRole}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          editId={editId}
          onCancel={resetForm}
        />
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 font-bold text-gray-700">Email</th>
              <th className="px-4 py-3 font-bold text-gray-700">Név</th>
              <th className="px-4 py-3 font-bold text-gray-700">Szerepkör</th>
              <th className="px-4 py-3 font-bold text-gray-700">Műveletek</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map(user => (
              <UserRow key={user.id} user={user} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="px-4 py-10 text-center text-gray-400 italic">
                  Nincsenek felhasználók.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function UserForm({
  email,
  setEmail,
  name,
  setName,
  role,
  setRole,
  handleSubmit,
  isLoading,
  editId,
  onCancel,
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 mb-8 bg-gray-50 p-4 border rounded"
    >
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Email cím"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Input
          placeholder="Név (opcionális)"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <select
          title="Szerepkör"
          className="px-3 py-2 border border-gray-300 shadow-sm rounded text-sm focus:border-school-navy focus:ring-1 focus:ring-school-navy outline-none"
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          {Object.entries(ROLE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading} className="md:w-auto w-full whitespace-nowrap">
          {editId ? 'Szerkesztés Mentése' : 'Hozzáadás'}
        </Button>
        <Button variant="outline" type="button" onClick={onCancel}>
          Mégsem
        </Button>
      </div>
    </form>
  )
}

function UserRow({ user, onEdit, onDelete }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-4 font-medium">{user.email}</td>
      <td className="px-4 py-4 font-medium">{user.name || '-'}</td>
      <td className="px-4 py-4 text-gray-600">
        <span
          className={`px-2 py-1 rounded text-xs font-bold ${
            user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {ROLE_LABELS[user.role]}
        </span>
      </td>
      <td className="px-4 py-4 flex flex-row items-center gap-3">
        <Button variant="ghost" onClick={() => onEdit(user)}>
          Szerkesztés
        </Button>
        <Button variant="ghostDanger" onClick={() => onDelete(user.id)}>
          Törlés
        </Button>
      </td>
    </tr>
  )
}
