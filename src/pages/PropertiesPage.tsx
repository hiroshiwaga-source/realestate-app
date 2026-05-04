import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { PropertyCard } from '../components/PropertyCard'
import { PropertyForm } from '../components/PropertyForm'
import { PropertyEditModal } from '../components/PropertyEditModal'
import {
  createProperty,
  deleteProperty,
  fetchProperties,
  updateProperty,
} from '../lib/propertiesApi'
import type { Property, PropertyInput } from '../types/property'

/**
 * ログイン後の物件一覧（Supabase CRUD）
 */
export function PropertiesPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [listError, setListError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [actionBusy, setActionBusy] = useState(false)

  /** 編集対象（設定時はモーダル表示） */
  const [editing, setEditing] = useState<Property | null>(null)
  /** 新規フォームを登録成功後にリセットするための key */
  const [createFormKey, setCreateFormKey] = useState(0)

  const reload = useCallback(async () => {
    setListError(null)
    const { data, error } = await fetchProperties()
    if (error) {
      setListError(error)
      setProperties([])
      return
    }
    setProperties(data ?? [])
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    void (async () => {
      const { data, error } = await fetchProperties()
      if (cancelled) return
      setLoading(false)
      if (error) {
        setListError(error)
        setProperties([])
        return
      }
      setProperties(data ?? [])
    })()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleLogout() {
    await signOut()
    navigate('/login', { replace: true })
  }

  /** 新規登録 */
  async function handleCreate(input: PropertyInput) {
    setFormError(null)
    setActionBusy(true)
    const { error } = await createProperty(input)
    setActionBusy(false)
    if (error) {
      setFormError(error)
      return
    }
    setCreateFormKey((k) => k + 1)
    await reload()
  }

  /** 編集保存 */
  async function handleUpdateSave(input: PropertyInput) {
    if (!editing) return
    setFormError(null)
    setActionBusy(true)
    const { error } = await updateProperty(editing.id, input)
    setActionBusy(false)
    if (error) {
      setFormError(error)
      return
    }
    setEditing(null)
    await reload()
  }

  /** 削除（確認ダイアログ付き） */
  async function handleDelete(id: string) {
    const ok = window.confirm('この物件を削除しますか？')
    if (!ok) return
    setFormError(null)
    setActionBusy(true)
    const { error } = await deleteProperty(id)
    setActionBusy(false)
    if (error) {
      setFormError(error)
      return
    }
    if (editing?.id === id) setEditing(null)
    await reload()
  }

  return (
    <div className="properties-layout">
      <header className="properties-header">
        <div>
          <h1 className="properties-header__title">物件一覧</h1>
          <p className="muted properties-header__email">{user?.email}</p>
        </div>
        <button type="button" className="btn btn-outline" onClick={() => void handleLogout()}>
          ログアウト
        </button>
      </header>

      {formError ? (
        <p className="form-error properties-page-alert" role="alert">
          {formError}
        </p>
      ) : null}

      <section className="property-create-section" aria-label="物件の新規登録">
        <h2 className="property-create-section__title">新規登録</h2>
        <PropertyForm key={createFormKey} submitLabel="登録する" onSubmit={handleCreate} />
      </section>

      {loading ? (
        <p className="muted">読み込み中...</p>
      ) : listError ? (
        <p className="form-error" role="alert">
          {listError}
        </p>
      ) : properties.length === 0 ? (
        <p className="muted">まだ物件がありません。上のフォームから登録してください。</p>
      ) : (
        <section className="property-grid" aria-label="物件リスト">
          {properties.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              onEdit={setEditing}
              onDelete={(id) => void handleDelete(id)}
              busy={actionBusy}
            />
          ))}
        </section>
      )}

      {editing ? (
        <PropertyEditModal
          property={editing}
          onSave={handleUpdateSave}
          onClose={() => {
            setFormError(null)
            setEditing(null)
          }}
        />
      ) : null}
    </div>
  )
}
