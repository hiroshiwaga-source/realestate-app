import type { Property, PropertyInput } from '../types/property'
import { PropertyForm } from './PropertyForm'

type PropertyEditModalProps = {
  property: Property
  onSave: (input: PropertyInput) => Promise<void>
  onClose: () => void
}

/**
 * 物件編集用モーダル（オーバーレイ＋フォーム）
 */
export function PropertyEditModal({ property, onSave, onClose }: PropertyEditModalProps) {
  return (
    <div
      className="modal-overlay"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="property-edit-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="property-edit-title" className="modal-panel__title">
          物件を編集
        </h2>
        <PropertyForm
          initialValues={{
            name: property.name,
            rentYen: property.rentYen,
            area: property.area,
            layout: property.layout,
          }}
          submitLabel="保存する"
          onSubmit={onSave}
          onCancel={onClose}
        />
      </div>
    </div>
  )
}
