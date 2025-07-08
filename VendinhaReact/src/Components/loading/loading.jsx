import styles from './loading.module.css';

export default function Loading() {
    return (
        <>
            <div className={styles.carregar}>
                <svg className={styles.loader} viewBox="25 25 50 50">
                    <circle className={styles.bolinha} r="20" cy="50" cx="50"></circle>
                </svg>
            </div>
        </>

    );
}