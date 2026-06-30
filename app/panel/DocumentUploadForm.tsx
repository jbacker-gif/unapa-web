'use client'

import { useState, useTransition, type FormEvent } from 'react'
import { createDocumentFromUpload } from './actions'
import { createClient } from '@/lib/supabase/client'

type DocumentUploadFormProps = {
  userId: string
}

type UploadState = {
  error?: string
  uploading: boolean
}

function isPdf(file: File) {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
}

export default function DocumentUploadForm({ userId }: DocumentUploadFormProps) {
  const [state, setState] = useState<UploadState>({ uploading: false })
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const file = formData.get('pdf')

    if (!(file instanceof File) || file.size === 0) {
      setState({ uploading: false, error: 'Selecciona un PDF para subir.' })
      return
    }

    if (!isPdf(file)) {
      setState({ uploading: false, error: 'El archivo debe ser un PDF.' })
      return
    }

    setState({ uploading: true })

    const supabase = createClient()
    const path = `documents/${userId}/${crypto.randomUUID()}.pdf`
    const { error } = await supabase.storage.from('unapa-media').upload(path, file, {
      cacheControl: '3600',
      contentType: 'application/pdf',
      upsert: false,
    })

    if (error) {
      setState({ uploading: false, error: error.message })
      return
    }

    const documentData = new FormData()
    documentData.set('title', String(formData.get('title') ?? ''))
    documentData.set('description', String(formData.get('description') ?? ''))
    documentData.set('status', String(formData.get('status') ?? 'draft'))
    documentData.set('storage_path', path)
    documentData.set('file_name', file.name)
    documentData.set('mime_type', file.type || 'application/pdf')

    startTransition(() => {
      createDocumentFromUpload(documentData)
    })
  }

  const disabled = state.uploading || isPending

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">Subir PDF</h2>
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <label className="block text-sm font-medium text-slate-700">
          Título
          <input
            name="title"
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Descripción
          <textarea name="description" rows={3} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">
            Estado
            <select name="status" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2">
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Archivo PDF
            <input
              name="pdf"
              type="file"
              accept="application/pdf,.pdf"
              required
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>
        </div>
        {state.error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </div>
        )}
        <button
          disabled={disabled}
          className="rounded-md bg-blue-900 px-6 py-3 font-bold text-white shadow-md transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {disabled ? 'Subiendo PDF...' : 'Guardar PDF'}
        </button>
      </form>
    </section>
  )
}
