import styles from './paginacao.module.css';

export default function Paginacao({ page, limit, total, onPrev, onNext }) {
    const pageTotal = Math.ceil(total / limit);
    const isFirstPage = page === 0;
    const isLastPage = (page + 1) * limit >= total;

    return (
        <div className={styles.paginacao}>
            <div className={styles.paginationInfo}>
                Itens {page * limit + 1} - {(page * limit) + Math.min(limit, total - page * limit)} de {total}
            </div>
            <div className={styles.paginationControls}>
                <span>Página </span>
                <a className={`${styles.previous} ${isFirstPage ? styles.disabled : ''}`} onClick={onPrev}>&lt;</a>
                <input value={page + 1} className={styles.pageNumber} readOnly />
                <a className={`${styles.next} ${isLastPage ? styles.disabled : ''}`} onClick={onNext}>&gt;</a>
                <span> de {pageTotal}</span>
            </div>
        </div>
    );
}
