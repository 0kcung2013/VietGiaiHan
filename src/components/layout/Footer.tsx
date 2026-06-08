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
          <div className={styles.colTitle}>Liên kết nhanh</div>
          <a href="/#about">Câu chuyện thương hiệu</a>
          <a href="/#products">Sản phẩm nổi bật</a>
          <a href="/#process">Quy trình chế tác</a>
        </div>

        <div className={styles.col}>
          <div className={styles.colTitle}>Danh mục</div>
          <a href="/#categories">Nội thất trong nhà</a>
          <a href="/#categories">Nghệ thuật trang trí</a>
          <a href="/#categories">Đồ gia dụng</a>
          <a href="/#categories">Sản phẩm từ tre</a>
        </div>

        <div className={styles.col}>
          <div className={styles.colTitle}>Liên hệ</div>
          <p>Tổ 3, KP Tân Hóa, P. Tân Khánh, TP.HCM</p>
          <p>0xxx xxx xxx</p>
          <p>info@vietgiaihan.vn</p>
          <p>Thứ 2 - Thứ 7: 08:00 - 17:30</p>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© 2026 Công ty Việt Giai Hân. Mọi quyền được bảo lưu.</span>
        <span>Đại diện: Trần Huỳnh Thanh Tâm</span>
      </div>
    </footer>
  )
}
