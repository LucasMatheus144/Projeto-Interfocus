import { useEffect, useState } from 'react';
import { usePaginaAtual } from '../../Contexts/PageContext';
import styles from './paginacao.module.css';

/**
 * @param {number} props.limit - Quantos itens por página
 * @param {number} props.total - Total de registros disponíveis
 * @param {number} props.exibindo - Qntde de registros sendo exibidos
 * @param {Function} props.attPage - Callback para solicitar nova página
 */
export default function Paginacao({ limit, total, exibindo, attPage }) {
    const [page, setPage] = useState(0);
    const [visualPage, setVisualPage] = useState(0);
    const { paginaAtualRef } = usePaginaAtual();

    const pageTotal = Math.ceil(total / limit);
    const isFirstPage = visualPage === 0;
    const isLastPage = (visualPage + 1) * limit >= total;

    const inicio = total === 0 || exibindo === 0 ? 0 : visualPage * limit + 1;
    const fim = inicio + exibindo - 1;

    const goNext = () => {
        if (!isLastPage) {
            setPage((prev) => prev + 1);
        }
    };

    const goPrev = () => {
        if (!isFirstPage) {
            setPage((prev) => prev - 1);
        }
    };

    useEffect(() => {
        paginaAtualRef.current = page;
        attPage?.(page);
    }, [page]);

    useEffect(() => {
        setVisualPage(page);
    }, [exibindo]);

    return (
        <div className={styles.paginacao}>
            <div className={styles.paginationInfo}>
                Itens {inicio} - {fim} de {total}
            </div>
            <div className={styles.paginationControls}>
                <span>Página </span>
                <a className={`${styles.previous} ${isFirstPage ? styles.disabled : ''}`} onClick={goPrev}>&lt;</a>
                <input value={paginaAtualRef.current + 1} className={styles.pageNumber} readOnly />
                <a className={`${styles.next} ${isLastPage ? styles.disabled : ''}`} onClick={goNext}>&gt;</a>
                <span> de {pageTotal}</span>
            </div>
        </div>
    );
}
