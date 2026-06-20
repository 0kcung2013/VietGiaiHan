import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from '@mantine/form'
import { useSearchParams } from 'react-router-dom'
import { IconCheck, IconClock, IconLoader2, IconMail, IconMapPin, IconPhone } from '@tabler/icons-react'
import { createConsultationRequest } from '../../../services/consultationService'
import styles from './index.module.css'

const infos = [
  {
    icon: IconMapPin,
    label: 'Địa chỉ',
    value: 'Thửa đất số 564, Tờ bản đồ số 13, Đường ĐX03, Tổ 3, Khu phố Tân Hóa, Phường Tân Khánh, TP.HCM',
  },
  { icon: IconPhone, label: 'Điện thoại', value: '0xxx xxx xxx' },
  { icon: IconMail, label: 'Email', value: 'info@vietgiaihan.vn' },
  { icon: IconClock, label: 'Giờ làm việc', value: 'Thứ 2 - Thứ 7: 08:00 - 17:30' },
]

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function Contact() {
  const [searchParams] = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm({
    initialValues: { name: '', email: '', phone: '', product: '', message: '' },
    validate: {
      name: (value) => (value.trim().length < 2 ? 'Vui lòng nhập họ tên' : null),
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Email không hợp lệ'),
      phone: (value) => (value.trim().length < 9 ? 'Vui lòng nhập số điện thoại' : null),
      message: (value) => (value.trim().length < 10 ? 'Vui lòng mô tả yêu cầu ít nhất 10 ký tự' : null),
    },
  })

  useEffect(() => {
    const name = searchParams.get('name')
    const phone = searchParams.get('phone')
    const product = searchParams.get('product')
    const message = searchParams.get('message')

    if (name || phone || product || message) {
      form.setValues({
        name: name ?? '',
        email: '',
        phone: phone ?? '',
        product: product ?? '',
        message: message ?? '',
      })
    }
  }, [])

  async function handleSubmit() {
    setSubmitError('')
    setIsSubmitting(true)

    try {
      const productName = form.values.product || 'Tư vấn chung'
      await createConsultationRequest({
        fullName: form.values.name.trim(),
        phone: form.values.phone.trim(),
        message: form.values.message.trim(),
        productId: 0,
        productName,
        productSlug: slugify(productName),
      })

      setIsSubmitted(true)
      form.reset()
    } catch {
      setSubmitError('Không thể gửi yêu cầu. Vui lòng thử lại hoặc liên hệ trực tiếp.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className={styles.section} id="contact">
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <p className={styles.label}>Liên hệ</p>
          <h2 className={styles.heading}>Bạn cần một sản phẩm gỗ được chế tác riêng?</h2>
          <p className={styles.sub}>Gửi yêu cầu để được tư vấn chất liệu, kiểu dáng, kích thước và báo giá phù hợp.</p>
        </motion.div>

        <div className={styles.grid}>
          <motion.div
            className={styles.infoCol}
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            {infos.map((info) => (
              <div className={styles.infoItem} key={info.label}>
                <div className={styles.infoIcon}>
                  <info.icon size={18} stroke={1.5} />
                </div>
                <div>
                  <div className={styles.infoLabel}>{info.label}</div>
                  <div className={styles.infoValue}>{info.value}</div>
                </div>
              </div>
            ))}
          </motion.div>

          {isSubmitted ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '48px 24px',
              textAlign: 'center',
            }}>
              <IconCheck size={40} stroke={1.5} color="#2e7d32" />
              <div style={{ fontSize: '18px', fontWeight: 600, color: '#2e7d32' }}>
                Gửi yêu cầu thành công!
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
              </div>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                style={{
                  marginTop: '8px',
                  padding: '10px 24px',
                  border: '1px solid #b8860b',
                  borderRadius: '6px',
                  background: 'transparent',
                  color: '#b8860b',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Gửi yêu cầu khác
              </button>
            </div>
          ) : (
            <motion.form
              className={styles.form}
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              onSubmit={form.onSubmit(() => void handleSubmit())}
            >
              <div className={styles.row}>
                <label className={styles.field}>
                  <span>Họ và tên *</span>
                  <input type="text" placeholder="Nguyễn Văn A" {...form.getInputProps('name')} />
                  {form.errors.name ? <small>{form.errors.name}</small> : null}
                </label>
                <label className={styles.field}>
                  <span>Số điện thoại *</span>
                  <input type="tel" placeholder="0xxx xxx xxx" {...form.getInputProps('phone')} />
                  {form.errors.phone ? <small>{form.errors.phone}</small> : null}
                </label>
              </div>

              <label className={styles.field}>
                <span>Email *</span>
                <input type="email" placeholder="email@example.com" {...form.getInputProps('email')} />
                {form.errors.email ? <small>{form.errors.email}</small> : null}
              </label>

              <label className={styles.field}>
                <span>Sản phẩm quan tâm</span>
                <select {...form.getInputProps('product')}>
                  <option value="">Chọn loại sản phẩm</option>
                  <option>Đồ gỗ nội thất</option>
                  <option>Đồ mỹ nghệ trang trí</option>
                  <option>Đồ gia dụng gỗ</option>
                  <option>Sản phẩm tre nứa</option>
                </select>
              </label>

              <label className={styles.field}>
                <span>Nội dung yêu cầu *</span>
                <textarea rows={4} placeholder="Mô tả yêu cầu của bạn..." {...form.getInputProps('message')} />
                {form.errors.message ? <small>{form.errors.message}</small> : null}
              </label>

              {submitError ? (
                <div style={{
                  padding: '12px 16px',
                  marginBottom: '18px',
                  border: '1px solid rgba(192, 57, 43, 0.3)',
                  borderRadius: '6px',
                  background: 'rgba(192, 57, 43, 0.05)',
                  color: '#c0392b',
                  fontSize: '14px',
                }}>
                  {submitError}
                </div>
              ) : null}

              <button className={styles.submit} type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                    <IconLoader2 size={16} className={styles.spinner} />
                    Đang gửi...
                  </span>
                ) : (
                  'Gửi yêu cầu tư vấn'
                )}
              </button>
            </motion.form>
          )}
        </div>
      </div>
    </section>
  )
}
