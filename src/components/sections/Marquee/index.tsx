import styles from './index.module.css'

const items = [
  'Đồ gỗ mỹ nghệ',
  'Chế tác thủ công',
  'Gỗ tự nhiên',
  'Tre nứa truyền thống',
  'Tinh hoa Việt Nam',
  'Sản xuất theo yêu cầu',
]

export function Marquee() {
  const loop = [...items, ...items]

  return (
    <section className={styles.marquee} aria-label="Năng lực sản xuất">
      <div className={styles.track}>
        {loop.map((item, index) => (
          <span className={styles.item} key={`${item}-${index}`}>
            {item}
          </span>
        ))}
      </div>
    </section>
  )
}
