import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}>Việt Giai Hân</div>
          <p className={styles.tagline}>Đồ gỗ mỹ nghệ thủ công cao cấp</p>
          <p className={styles.description}>
            Chuyên sản xuất sản phẩm từ gỗ, đồ mỹ nghệ, tre nứa và vật liệu tự nhiên
            với tinh thần thủ công Việt Nam.
          </p>
        </div>

        <div className={styles.col}>
          <div className={styles.colTitle}>Sản phẩm</div>
          <a href="/#products">Đồ gỗ nội thất</a>
          <a href="/#products">Đồ mỹ nghệ</a>
          <a href="/#products">Đồ gia dụng</a>
        </div>

        <div className={styles.col}>
          <div className={styles.colTitle}>Công ty</div>
          <a href="/#about">Về chúng tôi</a>
          <a href="/#process">Quy trình</a>
          <a href="/#representative">Người đại diện</a>
        </div>

        <div className={styles.col}>
          <div className={styles.colTitle}>Liên hệ</div>
          <p>Tổ 3, KP Tân Hóa, P. Tân Khánh, TP.HCM</p>
          <p>0xxx xxx xxx</p>
          <p>info@vietgiaihan.vn</p>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© 2026 Công ty Việt Giai Hân. Mọi quyền được bảo lưu.</span>
        <span>Đại diện: Trần Huỳnh Thanh Tâm</span>
      </div>
    </footer>
  )
}
