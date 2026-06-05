import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { getProductBySlug, type Product } from '../services/productService'
import { createConsultationRequest } from '../services/consultationService'
import styles from './ProductDetailPage.module.css'

const FALLBACK_IMAGE = '/images/product/binh-hoa.jpg'
const PHONE_REGEX = /^[0-9]{9,11}$/

function resolveImageUrl(imageUrl: string, failed: boolean): string {
  if (failed) {
    return FALLBACK_IMAGE
  }

  return imageUrl || FALLBACK_IMAGE
}

interface FormValues {
  fullName: string
  phone: string
  message: string
}

interface FormErrors {
  fullName?: string
  phone?: string
}

function validateForm(values: FormValues): FormErrors {
  const errors: FormErrors = {}

  if (!values.fullName.trim()) {
    errors.fullName = 'Vui lòng nhập họ và tên.'
  }

  if (!values.phone.trim()) {
    errors.phone = 'Vui lòng nhập số điện thoại.'
  } else if (!PHONE_REGEX.test(values.phone.trim())) {
    errors.phone = 'Số điện thoại chỉ chứa số, từ 9 đến 11 chữ số.'
  }

  return errors
}

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(Boolean(slug))
  const [error, setError] = useState<string | null>(null)
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())
  const [currentSlug, setCurrentSlug] = useState(slug)

  const [isContactOpen, setIsContactOpen] = useState(false)
  const [formValues, setFormValues] = useState<FormValues>({ fullName: '', phone: '', message: '' })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  if (slug !== currentSlug) {
    setCurrentSlug(slug)
    setProduct(null)
    setIsLoading(Boolean(slug))
    setError(null)
    setFailedImages(new Set())
  }

  useEffect(() => {
    if (!slug) {
      return
    }

    let isMounted = true

    getProductBySlug(slug)
      .then((item) => {
        if (!isMounted) {
          return
        }

        setProduct(item)
      })
      .catch(() => {
        if (!isMounted) {
          return
        }

        setError('Không tìm thấy sản phẩm hoặc không thể kết nối đến máy chủ.')
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [slug])

  const imgSrc = product ? resolveImageUrl(product.imageUrl, failedImages.has(product.slug)) : ''
  const shouldShowImage = Boolean(imgSrc) && product !== null && !failedImages.has(product.slug)

  const handleImageError = (productSlug: string) => {
    setFailedImages((prev) => {
      const next = new Set(prev)
      next.add(productSlug)
      return next
    })
  }

  const openContactModal = useCallback(() => {
    setIsContactOpen(true)
  }, [])

  const closeContactModal = useCallback(() => {
    setIsContactOpen(false)
    setFormValues({ fullName: '', phone: '', message: '' })
    setFormErrors({})
    setIsSubmitted(false)
    setIsSubmitting(false)
    setSubmitError(null)

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!isContactOpen) {
      return undefined
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isContactOpen])

  useEffect(() => {
    if (!isContactOpen) {
      return undefined
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeContactModal()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isContactOpen, closeContactModal])

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closeContactModal()
    }
  }

  const handleInputChange = (field: keyof FormValues) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: event.target.value }))

    if (field !== 'message' && formErrors[field as keyof FormErrors]) {
      setFormErrors((prev) => {
        const next = { ...prev }
        delete next[field as keyof FormErrors]
        return next
      })
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!product || isSubmitting) {
      return
    }

    const errors = validateForm(formValues)

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    setFormErrors({})

    try {
      await createConsultationRequest({
        fullName: formValues.fullName.trim(),
        phone: formValues.phone.trim(),
        message: formValues.message.trim(),
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
      })

      setIsSubmitted(true)

      closeTimerRef.current = setTimeout(() => {
        closeContactModal()
      }, 1500)
    } catch {
      setSubmitError('Không thể gửi yêu cầu. Vui lòng thử lại hoặc liên hệ trực tiếp.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={styles.statusPage}>
          <div className={styles.spinner} />
          <p className={styles.statusText}>Đang tải thông tin sản phẩm…</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={styles.statusPage}>
          <h1 className={styles.errorTitle}>Không tìm thấy sản phẩm</h1>
          <p className={styles.errorText}>
            {error ?? 'Sản phẩm bạn tìm không tồn tại hoặc đã bị gỡ.'}
          </p>
          <Link to="/san-pham" className={styles.btnPrimary}>
            Quay lại danh sách
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Navbar />

      <nav className={styles.breadcrumb} aria-label="Đường dẫn">
        <Link to="/">Trang chủ</Link>
        <span className={styles.breadcrumbSep}>/</span>
        <Link to="/san-pham">Sản phẩm</Link>
        <span className={styles.breadcrumbSep}>/</span>
        <span className={styles.breadcrumbCurrent}>{product.name}</span>
      </nav>

      <section className={styles.hero}>
        <div className={styles.imageSide}>
          {shouldShowImage ? (
            <img
              src={imgSrc}
              alt={product.name}
              onError={() => handleImageError(product.slug)}
            />
          ) : (
            <div className={styles.imageFallback}>{product.name}</div>
          )}
        </div>

        <div className={styles.infoSide}>
          <span className={styles.category}>{product.categoryName}</span>
          <h1 className={styles.title}>{product.name}</h1>
          <p className={styles.description}>{product.description}</p>

          <div className={styles.badges}>
            <span className={styles.badge}>
              <span className={styles.badgeIcon}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </span>
              Chế tác thủ công
            </span>
            <span className={styles.badge}>
              <span className={styles.badgeIcon}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87" />
                  <path d="M16 3.13a4 4 0 010 7.75" />
                </svg>
              </span>
              Gỗ tự nhiên
            </span>
            <span className={styles.badge}>
              <span className={styles.badgeIcon}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </span>
              Bảo hành chất lượng
            </span>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.btnPrimary} onClick={openContactModal}>
              Liên hệ tư vấn
            </button>
            <Link to="/san-pham" className={styles.btnSecondary}>
              ← Quay lại sản phẩm
            </Link>
          </div>
        </div>
      </section>

      <hr className={styles.divider} />

      <section className={styles.infoSection}>
        <h2 className={styles.sectionTitle}>Thông tin sản phẩm</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Chất liệu</span>
            <p className={styles.infoValue}>Gỗ tự nhiên</p>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Danh mục</span>
            <p className={styles.infoValue}>{product.categoryName}</p>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Trạng thái</span>
            <p className={styles.infoValue}>
              {product.status === 'Active' ? 'Đang bán' : product.status}
            </p>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Mã sản phẩm</span>
            <p className={styles.infoValue}>{product.slug}</p>
          </div>
        </div>
      </section>

      <section className={styles.storySection}>
        <div className={styles.storyInner}>
          <div className={styles.storyContent}>
            <span className={styles.storyLabel}>
              <span className={styles.storyLine} />
              Câu chuyện sản phẩm
            </span>
            <h2 className={styles.storyTitle}>
              {product.name} — Tinh hoa từ {product.categoryName}
            </h2>
            <p className={styles.storyText}>
              {product.description} Mỗi chi tiết trên sản phẩm đều được nghệ nhân
              Việt Nam chế tác tỉ mỉ bằng đôi bàn tay tài hoa và tâm huyết. Từ khâu
              lựa chọn gỗ nguyên liệu đến giai đoạn hoàn thiện cuối cùng, chúng tôi
              cam kết mang đến cho bạn một tác phẩm nghệ thuật độc bản, đậm chất văn
              hóa truyền thống Việt Nam.
            </p>
          </div>
          <div className={styles.storyVisual}>
            {shouldShowImage ? (
              <img src={imgSrc} alt={product.name} onError={() => handleImageError(product.slug)} />
            ) : (
              <div className={styles.imageFallback}>{product.name}</div>
            )}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Bạn quan tâm đến sản phẩm này?</h2>
        <p className={styles.ctaSub}>
          Liên hệ ngay để được tư vấn chi tiết về sản phẩm, giá cả và chính sách
          vận chuyển.
        </p>
        <div className={styles.ctaActions}>
          <button type="button" className={styles.btnPrimary} onClick={openContactModal}>
            Liên hệ ngay
          </button>
          <Link to="/san-pham" className={styles.btnSecondary}>
            Xem thêm sản phẩm khác
          </Link>
        </div>
      </section>

      <Footer />

      {isContactOpen ? (
        <div className={styles.overlay} onClick={handleOverlayClick} role="presentation">
          <div className={styles.modalCard} ref={modalRef} role="dialog" aria-modal="true" aria-label="Tư vấn sản phẩm">
            <button type="button" className={styles.modalClose} onClick={closeContactModal} aria-label="Đóng">
              ×
            </button>

            {isSubmitted ? (
              <div className={styles.successMessage}>
                <div className={styles.successIcon}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <p className={styles.successText}>
                  Cảm ơn bạn, Việt Giải Hân sẽ liên hệ tư vấn trong thời gian sớm nhất.
                </p>
              </div>
            ) : (
              <>
                <div className={styles.modalHeader}>
                  <h2 className={styles.modalTitle}>Tư vấn sản phẩm</h2>

                  <div className={styles.modalProduct}>
                    <div className={styles.modalProductImg}>
                      {shouldShowImage ? (
                        <img src={imgSrc} alt={product.name} />
                      ) : (
                        <div className={styles.modalProductFallback}>{product.name}</div>
                      )}
                    </div>
                    <div className={styles.modalProductInfo}>
                      <span className={styles.modalProductCategory}>{product.categoryName}</span>
                      <p className={styles.modalProductName}>{product.name}</p>
                      <span className={styles.modalProductSlug}>Mã: {product.slug}</span>
                    </div>
                  </div>
                </div>

                <form className={styles.modalBody} onSubmit={handleSubmit} noValidate>
                  <input
                    type="hidden"
                    name="productId"
                    value={product.id}
                  />
                  <input
                    type="hidden"
                    name="productName"
                    value={product.name}
                  />
                  <input
                    type="hidden"
                    name="productSlug"
                    value={product.slug}
                  />

                  <div className={styles.formRow}>
                    <label className={styles.formLabel} htmlFor="contact-fullName">
                      Họ và tên <span style={{ color: '#c0392b' }}>*</span>
                    </label>
                    <input
                      id="contact-fullName"
                      type="text"
                      className={`${styles.formInput} ${formErrors.fullName ? styles.formInputHasError : ''}`}
                      placeholder="Nguyễn Văn A"
                      value={formValues.fullName}
                      onChange={handleInputChange('fullName')}
                    />
                    {formErrors.fullName ? (
                      <span className={styles.formError}>{formErrors.fullName}</span>
                    ) : null}
                  </div>

                  <div className={styles.formRow}>
                    <label className={styles.formLabel} htmlFor="contact-phone">
                      Số điện thoại <span style={{ color: '#c0392b' }}>*</span>
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      className={`${styles.formInput} ${formErrors.phone ? styles.formInputHasError : ''}`}
                      placeholder="0912 345 678"
                      value={formValues.phone}
                      onChange={handleInputChange('phone')}
                    />
                    {formErrors.phone ? (
                      <span className={styles.formError}>{formErrors.phone}</span>
                    ) : null}
                  </div>

                  <div className={styles.formRow}>
                    <label className={styles.formLabel} htmlFor="contact-message">
                      Nhu cầu tư vấn
                    </label>
                    <textarea
                      id="contact-message"
                      className={styles.formTextarea}
                      placeholder="Bạn quan tâm đến sản phẩm này, muốn biết thêm về giá, chất liệu, hoặc chính sách vận chuyển…"
                      value={formValues.message}
                      onChange={handleInputChange('message')}
                    />
                  </div>

                  {submitError ? (
                    <div style={{
                      padding: '12px 16px',
                      marginBottom: '18px',
                      border: '1px solid rgba(192, 57, 43, 0.3)',
                      borderRadius: '6px',
                      background: 'rgba(192, 57, 43, 0.05)',
                      color: '#c0392b',
                      fontSize: '13px',
                      lineHeight: '1.5',
                    }}>
                      {submitError}
                    </div>
                  ) : null}

                  <div className={styles.modalFooter}>
                    <button
                      type="button"
                      className={styles.btnCancel}
                      onClick={closeContactModal}
                      disabled={isSubmitting}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className={styles.btnSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Đang gửi…' : 'Gửi tư vấn'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
