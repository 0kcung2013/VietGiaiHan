import { motion } from 'framer-motion'
import styles from './index.module.css'

const categories = [
  {
    title: 'Nội thất trong nhà',
    text: 'Bàn, tủ và điểm nhấn gỗ tự nhiên cho không gian sống ấm áp.',
    image: '/images/product/tu-go-tre.jpg',
  },
  {
    title: 'Nghệ thuật trang trí',
    text: 'Tác phẩm mỹ nghệ thủ công tạo chiều sâu cho phòng khách và quà tặng.',
    image: '/images/product/binh-hoa.jpg',
  },
  {
    title: 'Đồ gia dụng',
    text: 'Vật dụng gỗ bền đẹp, xử lý mịn và thân thiện trong sử dụng hằng ngày.',
    image: '/images/product/khay-go.jpg',
  },
  {
    title: 'Sản phẩm từ tre',
    text: 'Tre nứa đan tay, nhẹ bền và giữ tinh thần vật liệu tự nhiên Việt Nam.',
    image: '/images/product/gio-tre.jpg',
  },
]

export function CategoriesShowcase() {
  return (
    <section className={styles.section} id="categories">
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55 }}
        >
          <p className={styles.label}>Danh mục sản phẩm</p>
          <h2 className={styles.heading}>Khám phá bộ sưu tập thủ công</h2>
          <p className={styles.sub}>
            Từ nội thất, đồ gia dụng đến mỹ nghệ trang trí, mỗi nhóm sản phẩm đều
            được hoàn thiện theo ngôn ngữ thủ công riêng.
          </p>
        </motion.div>

        <div className={styles.grid}>
          {categories.map((category, index) => (
            <motion.article
              className={styles.card}
              key={category.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <img
                src={category.image}
                alt={category.title}
                className={styles.image}
                loading="lazy"
              />
              <div className={styles.overlay} />
              <div className={styles.content}>
                <span className={styles.cardNumber}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3>{category.title}</h3>
                <p>{category.text}</p>
                <a href="#products" className={styles.cta}>
                  Xem thêm
                  <span className={styles.ctaArrow} aria-hidden="true">
                    →
                  </span>
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
