import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function ProductCard({ product }) {
  const { id, category, title, description, badge } = product
  const imageUrl = product.imageUrl || product.image
  const [hasImageError, setHasImageError] = useState(false)
  const shouldShowImage = Boolean(imageUrl) && !hasImageError

  return (
    <article className="sp-card">
      <div className="sp-card__img-wrap">
        {shouldShowImage ? (
          <img src={imageUrl} alt={title} loading="lazy" onError={() => setHasImageError(true)} />
        ) : (
          <div className="sp-card__placeholder" aria-hidden="true">
            <span>{title}</span>
          </div>
        )}
      </div>
      <div className="sp-card__body">
        <span className="sp-card__category">{category}</span>
        <h3 className="sp-card__title">{title}</h3>
        <p className="sp-card__desc">{description}</p>
        <div className="sp-card__footer">
          <span className="sp-card__badge">{badge}</span>
          <Link to={`/san-pham/${id}`} className="sp-card__cta">
            Xem chi tiết <span className="sp-card__arrow">→</span>
          </Link>
        </div>
      </div>
    </article>
  )
}
