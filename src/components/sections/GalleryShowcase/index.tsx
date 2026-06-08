import { motion } from 'framer-motion'
import aboutMain from '../../../assets/images/about-main.jpg'
import aboutSecond from '../../../assets/images/about-second.jpg'
import heroWood from '../../../assets/images/hero-wood.jpg'
import styles from './index.module.css'

const gallery = [
  { title: 'Chi tiết vân gỗ', image: heroWood, className: 'large' },
  { title: 'Không gian xưởng', image: aboutMain, className: 'wide' },
  { title: 'Chạm khắc thủ công', image: '/images/product/den-ngu-go.jpg', className: 'tall' },
  { title: 'Đồ gia dụng hoàn thiện', image: '/images/product/hop-tra-go.jpg', className: '' },
  { title: 'Tre nứa đan tay', image: '/images/product/gio-tre.jpg', className: '' },
  { title: 'Sản phẩm trưng bày', image: aboutSecond, className: 'wide' },
]

export function GalleryShowcase() {
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

        <div className={styles.grid}>
          {gallery.map((item, index) => (
            <motion.figure
              className={`${styles.tile} ${item.className ? styles[item.className] : ''}`}
              key={item.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.55, delay: index * 0.05 }}
            >
              <img src={item.image} alt={item.title} loading="lazy" />
              <figcaption>{item.title}</figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
