import { useEffect, useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import { ProductCard, type ProductCardProps } from '../../ui/ProductCard'
import { getFeaturedProducts, type Product } from '../../../services/productService'
import { fallbackProducts } from '../../../data/productFallbacks'
import styles from './index.module.css'

function mapProductToCard(product: Product): ProductCardProps {
  return {
    id: product.slug,
    title: product.name,
    category: product.categoryName,
    description: product.description,
    imageUrl: product.imageUrl,
    badge: product.isFeatured ? 'bestseller' : null,
  }
}

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
}

const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
}

export function ProductsSection() {
  const [products, setProducts] = useState<ProductCardProps[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    getFeaturedProducts()
      .then((items) => {
        if (!isMounted) {
          return
        }

        setProducts(items.map(mapProductToCard))
        setErrorMessage(null)
      })
      .catch(() => {
        if (!isMounted) {
          return
        }

        setProducts(fallbackProducts)
        setErrorMessage('Không thể tải sản phẩm từ API. Đang hiển thị dữ liệu mẫu.')
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className={styles.section} id="products">
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          <p className={styles.label}>Sản phẩm nổi bật</p>
          <h2 className={styles.heading}>Bộ sưu tập được tuyển chọn</h2>
          <p className={styles.sub}>
            Những thiết kế tiêu biểu cho chất liệu gỗ tự nhiên, đường nét thủ công và phong cách sống tinh tế.
          </p>
          <a className={styles.viewAll} href="/san-pham">
            Xem tất cả sản phẩm
          </a>
        </motion.div>

        {isLoading ? <p className={styles.status}>Đang tải sản phẩm...</p> : null}
        {errorMessage ? <p className={styles.status}>{errorMessage}</p> : null}

        <motion.div
          className={styles.grid}
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={cardVariants}>
              <ProductCard {...product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
