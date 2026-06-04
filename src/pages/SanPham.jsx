import { useEffect, useMemo, useRef, useState } from 'react'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import ProductCard from '../components/ProductCard'
import PRODUCTS from '../data/products'
import { getProductCategories } from '../services/categoryService'
import { getProducts } from '../services/productService'
import '../styles/SanPham.css'

const ALL_CATEGORY = 'all'

const normalizeText = (value) =>
  value
    .toLocaleLowerCase('vi-VN')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const mapApiProductToPageProduct = (product) => ({
  id: product.slug,
  category: product.categoryName,
  categoryId: product.categoryId,
  categorySlug: product.categorySlug,
  title: product.name,
  description: product.description,
  badge: product.isFeatured ? 'Bán Chạy' : 'Mới',
  imageUrl: product.imageUrl,
  sortOrder: product.sortOrder,
})

const createSlug = (value) =>
  normalizeText(value)
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

const fallbackCategories = Array.from(
  new Map(
    PRODUCTS.map((product) => [
      product.category,
      {
        id: product.category,
        name: product.category,
        slug: createSlug(product.category),
      },
    ]),
  ).values(),
)

export default function SanPham() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState('featured')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const searchTimerRef = useRef()
  const searchInputRef = useRef(null)

  useEffect(() => {
    return () => clearTimeout(searchTimerRef.current)
  }, [])

  useEffect(() => {
    let isMounted = true

    getProductCategories()
      .then((items) => {
        if (isMounted) {
          setCategories(items)
        }
      })
      .catch(() => {
        if (isMounted) {
          setCategories(fallbackCategories)
        }
      })

    getProducts()
      .then((items) => {
        if (!isMounted) {
          return
        }

        setProducts(items.map(mapApiProductToPageProduct))
        setErrorMessage('')
      })
      .catch(() => {
        if (!isMounted) {
          return
        }

        setProducts(PRODUCTS)
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

  const filteredProducts = useMemo(() => {
    let items = [...products]

    if (activeCategory !== ALL_CATEGORY) {
      items = items.filter((item) => {
        const itemCategorySlug = item.categorySlug || createSlug(item.category)
        return itemCategorySlug === activeCategory
      })
    }

    const query = normalizeText(searchQuery.trim())
    if (query) {
      items = items.filter((item) => {
        const haystack = normalizeText(`${item.title} ${item.description}`)
        return haystack.includes(query)
      })
    }

    if (sortOrder === 'name-asc') {
      return items.sort((a, b) => a.title.localeCompare(b.title, 'vi'))
    }

    if (sortOrder === 'name-desc') {
      return items.sort((a, b) => b.title.localeCompare(a.title, 'vi'))
    }

    if (sortOrder === 'newest') {
      return items.sort((a, b) => Number(b.sortOrder ?? b.id) - Number(a.sortOrder ?? a.id))
    }

    return items
  }, [activeCategory, products, searchQuery, sortOrder])

  return (
    <div className="sp-page">
      <Navbar />

      <section className="sp-hero">
        <div className="sp-hero__inner">
          <div className="sp-hero__eyebrow">
            <span className="sp-hero__line" />
            <span className="sp-hero__label">BỘ SƯU TẬP</span>
          </div>
          <h1 className="sp-hero__title">Tất Cả Sản Phẩm</h1>
          <p className="sp-hero__subtitle">
            Khám phá bộ sưu tập thủ công mỹ nghệ gỗ tinh tế — được chế tác
            tỉ mỉ bởi nghệ nhân Việt Nam.
          </p>
        </div>
      </section>

      <div className="sp-filterbar">
        <div className="sp-filterbar__inner">
          <nav className="sp-tabs" aria-label="Lọc danh mục">
            {[{ id: ALL_CATEGORY, name: 'Tất cả', slug: ALL_CATEGORY }, ...categories].map((cat) => (
              <button
                key={cat.slug}
                className={`sp-tab ${activeCategory === cat.slug ? 'sp-tab--active' : ''}`}
                onClick={() => setActiveCategory(cat.slug)}
                aria-pressed={activeCategory === cat.slug}
                type="button"
              >
                {cat.name}
              </button>
            ))}
          </nav>

          <div className={`sp-search ${isSearchOpen ? 'sp-search--open' : ''}`}>
            <button
              className="sp-search__icon-btn"
              onClick={() => setIsSearchOpen((value) => !value)}
              aria-label="Mở tìm kiếm"
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <input
              ref={searchInputRef}
              type="search"
              className="sp-search__input"
              placeholder="Tìm kiếm sản phẩm…"
              aria-label="Tìm kiếm sản phẩm"
              onChange={(event) => {
                clearTimeout(searchTimerRef.current)
                searchTimerRef.current = setTimeout(() => setSearchQuery(event.target.value), 250)
              }}
            />
          </div>
        </div>
      </div>

      <section className="sp-section">
        <div className="sp-container">
          <div className="sp-meta">
            <p className="sp-meta__count" role="status" aria-live="polite">
              {isLoading
                ? 'Đang tải sản phẩm...'
                : filteredProducts.length > 0
                ? `Hiển thị ${filteredProducts.length} sản phẩm${activeCategory !== ALL_CATEGORY ? ` trong "${categories.find((category) => category.slug === activeCategory)?.name ?? activeCategory}"` : ''}`
                : ''}
            </p>
            <select
              className="sp-sort"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              aria-label="Sắp xếp sản phẩm"
            >
              <option value="featured">Sắp xếp: Nổi bật</option>
              <option value="name-asc">Tên A–Z</option>
              <option value="name-desc">Tên Z–A</option>
              <option value="newest">Mới nhất</option>
            </select>
          </div>

          {errorMessage ? <p className="sp-api-error">{errorMessage}</p> : null}

          {!isLoading && filteredProducts.length > 0 ? (
            <div className="sp-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : !isLoading ? (
            <div className="sp-empty">
              <p className="sp-empty__title">Không tìm thấy sản phẩm</p>
              <p className="sp-empty__sub">
                Thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác.
              </p>
              <button
                className="sp-empty__reset"
                onClick={() => {
                  if (searchInputRef.current) {
                    searchInputRef.current.value = ''
                  }
                  setActiveCategory(ALL_CATEGORY)
                  setSearchQuery('')
                }}
                type="button"
              >
                Xem tất cả sản phẩm
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <Footer />
    </div>
  )
}
