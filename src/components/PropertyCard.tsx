import type { Property } from '../types/property'

type PropertyCardProps = {
  property: Property
  onEdit: (property: Property) => void
  onDelete: (id: string) => void
  busy?: boolean
}

/** 家賃を円表記で整形 */
function formatRent(yen: number) {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  }).format(yen)
}

/**
 * 物件名・家賃・エリア・間取りを表示し、編集・削除操作を提供するカード
 */
export function PropertyCard({ property, onEdit, onDelete, busy }: PropertyCardProps) {
  return (
    <article className="property-card">
      <h3 className="property-card__title">{property.name}</h3>
      <dl className="property-card__dl">
        <div>
          <dt>家賃</dt>
          <dd>{formatRent(property.rentYen)}</dd>
        </div>
        <div>
          <dt>エリア</dt>
          <dd>{property.area}</dd>
        </div>
        <div>
          <dt>間取り</dt>
          <dd>{property.layout}</dd>
        </div>
      </dl>
      <div className="property-card__actions">
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => onEdit(property)}
          disabled={busy}
        >
          編集
        </button>
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(property.id)}
          disabled={busy}
        >
          削除
        </button>
      </div>
    </article>
  )
}
