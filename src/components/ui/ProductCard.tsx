import { useState } from 'react'
import { IconPackage } from '@tabler/icons-react'
import styles from './ProductCard.module.css'

export interface ProductCardProps {
  id: string
  title: string
  category: string
  description: string
  imageUrl?: string
  badge?: 'new' | 'bestseller' | null
  onClick?: () => void
}

const badgeLabel = {
  new: 'Mới',
  bestseller: 'Bán chạy',
} as const

export function ProductCard({
  title,
  category,
  description,
  imageUrl,
  badge,
  onClick,
}: ProductCardProps) {
  const [hasImageError, setHasImageError] = useState(false)
  const shouldShowImage = Boolean(imageUrl) && !hasImageError

  return (
    <article className={styles.card} onClick={onClick}>
      <div className={styles.imageWrap}>
        {shouldShowImage ? (
          <img
            src={imageUrl}
            alt={title}
            className={styles.img}
            loading="lazy"
            onError={() => setHasImageError(true)}
          />
        ) : (
          <div className={styles.placeholder} aria-hidden="true">
            <IconPackage size={48} stroke={1.5} />
          </div>
        )}

        {badge ? (
          <span className={`${styles.badge} ${styles[badge]}`}>{badgeLabel[badge]}</span>
        ) : null}
      </div>

      <div className={styles.content}>
        <p className={styles.category}>{category}</p>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <span className={styles.link}>
          <span>Xem chi tiết</span>
          <span>→</span>
        </span>
      </div>
    </article>
  )
}
