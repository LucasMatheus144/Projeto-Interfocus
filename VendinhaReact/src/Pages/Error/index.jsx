import styles from './index.module.css';

export default function NotFound() {
  return (
    <section id={styles.notFound}>
      <div id={styles.title}></div>
      <br />
      <div className={styles.circles}>
        <p>
          404 <br />
          <small>PAGE NÃO ENCONTRADA</small>
        </p>
        <span className={`${styles.circle} ${styles.big}`}></span>
        <span className={`${styles.circle} ${styles.med}`}></span>
        <span className={`${styles.circle} ${styles.small}`}></span>
      </div>
    </section>
  );
}
