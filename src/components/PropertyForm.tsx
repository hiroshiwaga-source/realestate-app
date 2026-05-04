import { FormEvent, useEffect, useState } from 'react'
import type { PropertyInput } from '../types/property'

type PropertyFormProps = {
  /** 編集時の初期値（新規のときは未指定） */
  initialValues?: Partial<PropertyInput>
  submitLabel: string
  onSubmit: (values: PropertyInput) => Promise<void>
  onCancel?: () => void
}

/**
 * 物件の新規登録・編集で共通の入力フォーム
 */
export function PropertyForm({
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
}: PropertyFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '')
  const [rentYen, setRentYen] = useState<string>(
    initialValues?.rentYen !== undefined ? String(initialValues.rentYen) : '',
  )
  const [area, setArea] = useState(initialValues?.area ?? '')
  const [layout, setLayout] = useState(initialValues?.layout ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [rentError, setRentError] = useState<string | null>(null)

  // 編集モーダルを開き直したときにフィールドを同期
  useEffect(() => {
    setName(initialValues?.name ?? '')
    setRentYen(initialValues?.rentYen !== undefined ? String(initialValues.rentYen) : '')
    setArea(initialValues?.area ?? '')
    setLayout(initialValues?.layout ?? '')
  }, [initialValues])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setRentError(null)
    const yen = Number.parseInt(rentYen, 10)
    if (Number.isNaN(yen) || yen < 0) {
      setRentError('家賃は 0 以上の整数で入力してください。')
      return
    }
    setSubmitting(true)
    try {
      await onSubmit({
        name: name.trim(),
        rentYen: yen,
        area: area.trim(),
        layout: layout.trim(),
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="property-form" onSubmit={(e) => void handleSubmit(e)}>
      <label className="auth-form__label">
        物件名
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="off"
        />
      </label>
      <label className="auth-form__label">
        家賃（円）
        <input
          type="number"
          required
          min={0}
          step={1}
          value={rentYen}
          onChange={(e) => setRentYen(e.target.value)}
          aria-invalid={rentError ? true : undefined}
        />
      </label>
      {rentError ? (
        <p className="form-error" role="alert">
          {rentError}
        </p>
      ) : null}
      <label className="auth-form__label">
        エリア
        <input
          type="text"
          required
          value={area}
          onChange={(e) => setArea(e.target.value)}
          autoComplete="off"
        />
      </label>
      <label className="auth-form__label">
        間取り
        <input
          type="text"
          required
          placeholder="例: 1LDK"
          value={layout}
          onChange={(e) => setLayout(e.target.value)}
          autoComplete="off"
        />
      </label>
      <div className="property-form__actions">
        {onCancel ? (
          <button type="button" className="btn btn-outline" onClick={onCancel} disabled={submitting}>
            キャンセル
          </button>
        ) : null}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? '送信中...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
