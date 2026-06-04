import { motion } from 'framer-motion'
import styles from './index.module.css'

const companies = [
  'CÔNG TY TNHH MỘT THÀNH VIÊN DOANH THỊNH',
  'CÔNG TY TNHH GỖ ĐỈNH THÀNH',
  'CÔNG TY TNHH SƠN GỖ DU HỒNG',
]

export function Representative() {
  return (
    <section className={styles.section} id="representative">
      <div className={styles.inner}>
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className={styles.avatarCol}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className={styles.monogram} aria-hidden="true">
              THTT
            </div>
            <div className={styles.avatarRing}>
              <div className={styles.avatar}>
                <img
                  src="/images/representative.jpg"
                  alt="TRẦN HUỲNH THANH TÂM"
                />
              </div>
            </div>
          </motion.div>

          <div className={styles.divider} />

          <motion.div
            className={styles.info}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className={styles.badge}>NGƯỜI ĐẠI DIỆN</div>
            <div className={styles.nameWrap}>
              <h2 className={styles.name}>TRẦN HUỲNH THANH TÂM</h2>
              <div className={styles.role}>Đại diện pháp luật</div>
            </div>
            <div className={styles.infoLabel}>
              Đồng thời đại diện các đơn vị
            </div>
            <ul className={styles.companyList}>
              {companies.map((company, index) => (
                <motion.li
                  className={styles.companyItem}
                  key={company}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.55, delay: 0.45 + index * 0.08 }}
                >
                  <span className={styles.dot} />
                  <span>{company}</span>
                </motion.li>
              ))}
            </ul>

            <div className={styles.addressWrap}>
              <hr className={styles.addressRule} />
              <div className={styles.addressLabel}>Địa chỉ trụ sở</div>
              <p className={styles.address}>
                Thửa đất số 564, Tờ bản đồ số 13, Đường ĐX03, Tổ 3, Khu phố Tân Hóa,
                Phường Tân Khánh, Thành phố Hồ Chí Minh, Việt Nam
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
