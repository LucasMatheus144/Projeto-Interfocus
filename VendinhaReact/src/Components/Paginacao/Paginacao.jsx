import { useState, useEffect } from 'react';
import styles from './paginacao.module.css';

export default function Paginacao({ limit, total, attPage }) {
    const [page, setPage] = useState(0);

    const pageTotal = Math.ceil(total / limit);
    const isFirstPage = page === 0;
    const isLastPage = (page + 1) * limit >= total;

    const goNext = () => {
        if (!isLastPage) setPage((prev) => prev + 1);
    };

    const goPrev = () => {
        if (!isFirstPage) setPage((prev) => prev - 1);
    };

     useEffect(() => {
        setPage(0);
    }, [total]);

    useEffect(() => {
        var timeout = setTimeout(() => {
            attPage?.(page);
        }, 300);

        return () => {
            clearTimeout(timeout);
        }
    }, [page])

    return (
        <div className={styles.paginacao}>
            <div className={styles.paginationInfo}>
                Itens {page * limit + 1} - {(page * limit) + Math.min(limit, total - page * limit)} de {total}
            </div>
            <div className={styles.paginationControls}>
                <span>Página </span>
                <a className={`${styles.previous} ${isFirstPage ? styles.disabled : ''}`} onClick={goPrev}>&lt;</a>
                <input value={page + 1} className={styles.pageNumber}  spellCheck="false" readOnly />
                <a className={`${styles.next} ${isLastPage ? styles.disabled : ''}`} onClick={goNext}>&gt;</a>
                <span> de {pageTotal}</span>
            </div>
        </div>
    );
}
