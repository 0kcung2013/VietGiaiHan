import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from '@mantine/form'
import { IconCheck, IconClipboardList, IconFile, IconLoader2, IconUpload, IconX } from '@tabler/icons-react'
import { createJobApplication, uploadCv } from '../../../services/jobApplicationService'
import styles from './index.module.css'

const POSITION_OPTIONS = [
  'Nhân viên kinh doanh',
  'Thợ thủ công',
  'Nhân viên CSKH',
]

export function JobApplication() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [cvFileName, setCvFileName] = useState('')
  const [cvUploading, setCvUploading] = useState(false)
  const [cvUrl, setCvUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm({
    initialValues: { fullName: '', phone: '', email: '', position: '', message: '' },
    validate: {
      fullName: (value) => (value.trim().length < 2 ? 'Vui lòng nhập họ tên' : null),
      phone: (value) => (/^[0-9]{9,11}$/.test(value.trim()) ? null : 'Số điện thoại từ 9 đến 11 chữ số'),
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Email không hợp lệ'),
      position: (value) => (value.trim().length > 0 ? null : 'Vui lòng chọn vị trí'),
    },
  })

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    if (!allowedTypes.includes(file.type)) {
      setSubmitError('Chỉ chấp nhận file PDF, DOC hoặc DOCX.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setSubmitError('Dung lượng file tối đa 5MB.')
      return
    }

    setCvFile(file)
    setCvFileName(file.name)
    setCvUrl('')
    setSubmitError('')
  }

  function handleRemoveCv() {
    setCvFile(null)
    setCvFileName('')
    setCvUrl('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit() {
    setSubmitError('')
    setIsSubmitting(true)

    try {
      let finalCvUrl = cvUrl
      let finalCvFileName = cvFileName

      if (cvFile && !cvUrl) {
        setCvUploading(true)
        const uploaded = await uploadCv(cvFile)
        finalCvUrl = uploaded.url
        finalCvFileName = uploaded.fileName
        setCvUrl(uploaded.url)
        setCvUploading(false)
      }

      await createJobApplication({
        fullName: form.values.fullName.trim(),
        phone: form.values.phone.trim(),
        email: form.values.email.trim(),
        position: form.values.position,
        cvUrl: finalCvUrl || undefined,
        cvFileName: finalCvFileName || undefined,
        message: form.values.message.trim() || undefined,
      })

      setIsSubmitted(true)
      form.reset()
      handleRemoveCv()
    } catch {
      setSubmitError('Không thể gửi hồ sơ. Vui lòng thử lại sau.')
      setCvUploading(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className={styles.section} id="tuyen-dung">
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <p className={styles.label}>Tuyển dụng</p>
          <h2 className={styles.heading}>Gia nhập đội ngũ Viet Giai Hân</h2>
          <p className={styles.sub}>Gửi hồ sơ ứng tuyển để trở thành một phần của đội ngũ thợ thủ công và nhân viên chuyên nghiệp.</p>
        </motion.div>

        {isSubmitted ? (
          <motion.div
            className={styles.successBox}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <IconCheck size={44} stroke={1.5} color="#2e7d32" />
            <div className={styles.successTitle}>Gửi hồ sơ thành công!</div>
            <div className={styles.successSub}>Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.</div>
            <button className={styles.resetBtn} type="button" onClick={() => setIsSubmitted(false)}>
              Gửi hồ sơ khác
            </button>
          </motion.div>
        ) : (
          <motion.form
            className={styles.form}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            onSubmit={form.onSubmit(() => void handleSubmit())}
          >
            <div className={styles.row}>
              <label className={styles.field}>
                <span>Họ và tên *</span>
                <input type="text" placeholder="Nguyễn Văn A" {...form.getInputProps('fullName')} />
                {form.errors.fullName ? <small>{form.errors.fullName}</small> : null}
              </label>
              <label className={styles.field}>
                <span>Số điện thoại *</span>
                <input type="tel" placeholder="0xxx xxx xxx" {...form.getInputProps('phone')} />
                {form.errors.phone ? <small>{form.errors.phone}</small> : null}
              </label>
            </div>

            <div className={styles.row}>
              <label className={styles.field}>
                <span>Email *</span>
                <input type="email" placeholder="email@example.com" {...form.getInputProps('email')} />
                {form.errors.email ? <small>{form.errors.email}</small> : null}
              </label>
              <label className={styles.field}>
                <span>Vị trí ứng tuyển *</span>
                <select {...form.getInputProps('position')}>
                  <option value="">Chọn vị trí</option>
                  {POSITION_OPTIONS.map((pos) => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
                {form.errors.position ? <small>{form.errors.position}</small> : null}
              </label>
            </div>

            <label className={styles.field}>
              <span>CV đính kèm</span>
              <div className={styles.uploadArea}>
                <input
                  key={cvFileName || 'empty'}
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className={styles.fileInput}
                />
                {cvFileName ? (
                  <div className={styles.filePreview} onClick={() => fileInputRef.current?.click()}>
                    <IconFile size={18} stroke={1.5} />
                    <span className={styles.fileName}>{cvFileName}</span>
                    <button className={styles.removeFileBtn} type="button" onClick={(e) => { e.stopPropagation(); handleRemoveCv(); }} aria-label="Xóa file">
                      <IconX size={14} stroke={2} />
                    </button>
                  </div>
                ) : (
                  <div className={styles.uploadPlaceholder} onClick={() => fileInputRef.current?.click()}>
                    <IconUpload size={20} stroke={1.5} />
                    <span>Chọn file PDF, DOC hoặc DOCX (tối đa 5MB)</span>
                  </div>
                )}
              </div>
            </label>

            <label className={styles.field}>
              <span>Thông tin bổ sung</span>
              <textarea rows={4} placeholder="Kinh nghiệm, lý do ứng tuyển..." {...form.getInputProps('message')} />
            </label>

            {submitError ? (
              <div className={styles.errorBox}>{submitError}</div>
            ) : null}

            <button className={styles.submit} type="submit" disabled={isSubmitting || cvUploading}>
              {isSubmitting || cvUploading ? (
                <span className={styles.submitLoading}>
                  <IconLoader2 size={16} className={styles.spinner} />
                  {cvUploading ? 'Đang tải CV...' : 'Đang gửi...'}
                </span>
              ) : (
                <span className={styles.submitContent}>
                  <IconClipboardList size={16} />
                  Gửi hồ sơ ứng tuyển
                </span>
              )}
            </button>
          </motion.form>
        )}
      </div>
    </section>
  )
}
