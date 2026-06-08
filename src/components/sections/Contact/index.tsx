import { motion } from 'framer-motion'
import { useForm } from '@mantine/form'
import { IconClock, IconMail, IconMapPin, IconPhone } from '@tabler/icons-react'
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

export function Contact() {
  const form = useForm({
    initialValues: { name: '', email: '', phone: '', product: '', message: '' },
    validate: {
      name: (value) => (value.trim().length < 2 ? 'Vui lòng nhập họ tên' : null),
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Email không hợp lệ'),
      phone: (value) => (value.trim().length < 9 ? 'Vui lòng nhập số điện thoại' : null),
      message: (value) => (value.trim().length < 10 ? 'Vui lòng mô tả yêu cầu ít nhất 10 ký tự' : null),
    },
  })

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

          <motion.form
            className={styles.form}
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            onSubmit={form.onSubmit(() => form.reset())}
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

            <button className={styles.submit} type="submit">
              Gửi yêu cầu tư vấn
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
