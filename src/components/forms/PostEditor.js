'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import 'react-quill-new/dist/quill.snow.css'

import TagSelector from './post-editor/TagSelector'
import ImageUpload from './post-editor/ImageUpload'
import VisibilitySettings from './post-editor/VisibilitySettings'
import RedirectSettings from './post-editor/RedirectSettings'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

export default function PostEditor({ initialData = null }) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || '')
  const [redirectUrl, setRedirectUrl] = useState(initialData?.redirectUrl || '')
  const [isAktualis, setIsAktualis] = useState(initialData?.isAktualis || false)
  const [isKozhasznu, setIsKozhasznu] = useState(initialData?.isKozhasznu || false)
  const [status, setStatus] = useState(initialData?.status || 'PUBLIC')
  const [selectedTags, setSelectedTags] = useState(initialData?.tags?.map(t => t.icon) || [])

  const [isLoading, setIsLoading] = useState(false)
  const isRedirect = redirectUrl.trim().length > 0

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsLoading(true)

    const payload = {
      title,
      content,
      description,
      featuredImage,
      redirectUrl,
      isAktualis,
      isKozhasznu,
      status,
      tags: selectedTags,
    }

    try {
      const res = await fetch(initialData ? `/api/posts/${initialData.id}` : '/api/posts', {
        method: initialData ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        alert('Bejegyzés mentve!')
        router.push('/admin/posts')
        router.refresh()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {initialData ? 'Bejegyzés szerkesztése' : 'Új bejegyzés létrehozása'}
        </h1>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Mentés...' : 'Bejegyzés Közzététele'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Input
            variant="underlined"
            placeholder="Cím megadása"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />

          {isRedirect ? (
            <div className="h-100 flex items-center justify-center bg-gray-100 border rounded text-gray-400 italic">
              Átirányítás - tartalom nem szükséges, csak a cím jelenik meg.
            </div>
          ) : (
            <div className="h-100">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                className="h-87.5"
                placeholder="Írd ide a bejegyzés tartalmát..."
              />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <VisibilitySettings
            status={status}
            setStatus={setStatus}
            isAktualis={isAktualis}
            setIsAktualis={setIsAktualis}
            isKozhasznu={isKozhasznu}
            setIsKozhasznu={setIsKozhasznu}
            description={description}
            setDescription={setDescription}
            showStatus={!isRedirect}
          />

          <RedirectSettings
            redirectUrl={redirectUrl}
            setRedirectUrl={setRedirectUrl}
            isAktualis={isAktualis}
            isKozhasznu={isKozhasznu}
          />

          {!isRedirect && (
            <>
              <ImageUpload featuredImage={featuredImage} setFeaturedImage={setFeaturedImage} />
              <TagSelector selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
            </>
          )}
        </div>
      </div>
    </form>
  )
}
