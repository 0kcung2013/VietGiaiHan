import { motion } from 'framer-motion'
import aboutMain from '../../../assets/images/about-main.jpg'
import aboutSecond from '../../../assets/images/about-second.jpg'
import heroWood from '../../../assets/images/hero-wood.jpg'
import styles from './index.module.css'

type GalleryItem = {
  title: string
  image: string
  variant: 'feature' | 'small' | 'strip'
  position?: string
}

const gallery: GalleryItem[] = [
  { title: 'Chi tiết vân gỗ', image: heroWood, variant: 'feature', position: 'center center' },
  { title: 'Không gian xưởng', image: aboutMain, variant: 'small', position: 'center top' },
  { title: 'Chạm khắc thủ công', image: '/images/product/den-ngu-go.jpg', variant: 'small', position: 'center center' },
  { title: 'Đồ gia dụng hoàn thiện', image: '/images/product/hop-tra-go.jpg', variant: 'small', position: 'center center' },
  { title: 'Tre nứa đan tay', image: '/images/product/gio-tre.jpg', variant: 'small', position: 'center center' },
  { title: 'Sản phẩm trưng bày', image: aboutSecond, variant: 'strip', position: 'center 40%' },
]

function GalleryTile({ item, index }: { item: GalleryItem; index: number }) {
  return (
    <motion.figure
      className={`${styles.tile} ${styles[`${item.variant}Tile`]}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.55, delay: index * 0.05 }}
    >
      <img
        src={item.image}
        alt={item.title}
        loading={index === 0 ? 'eager' : 'lazy'}
        style={{ objectPosition: item.position }}
      />
      <figcaption>{item.title}</figcaption>
    </motion.figure>
  )
}

export function GalleryShowcase() {
  const [featureItem, ...restItems] = gallery
  const sideItems = restItems.slice(0, 4)
  const stripItem = restItems[4]

  return (
    <section className={styles.section} id="gallery">
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
        >
          <p className={styles.label}>Bộ sưu tập</p>
          <h2 className={styles.heading}>Vật liệu thật, đường nét thật, giá trị bền lâu</h2>
        </motion.div>

        <div className={styles.galleryLayout}>
          <GalleryTile item={featureItem} index={0} />

          <div className={styles.sideGrid}>
            {sideItems.map((item, index) => (
              <GalleryTile item={item} index={index + 1} key={item.title} />
            ))}
          </div>

          <GalleryTile item={stripItem} index={5} />
        </div>
      </div>
    </section>
  )
}
