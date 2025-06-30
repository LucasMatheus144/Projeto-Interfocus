import { useEffect, useState } from "react";
import { listarClientes } from '../../services/clienteService';
import { FaPlus } from "react-icons/fa";
import Search from '../../Components/InputSearch/Search';
import Cards from '../../Components/Cards/Cards';
import FormCliente from "../../Components/FormCliente/FormCliente";
import styles from './home.module.css';

export default function HomePage() {
    /*FormCliente*/
    const [abrir, setOpen] = useState(false);

    /* Chamada API */
    const [clientes, setClientes] = useState([]);
    const [pesquisa, setPesquisa] = useState("");
    const [totalClientes, setTotal] = useState(0);

    /*Paginação*/
    const [page, setPage] = useState(0);
    const limit = 10;
    const pageTotal = Math.ceil(totalClientes / limit);

    // Efeitos para atualização de componentes
    useEffect(() => {
        var timeout = setTimeout(() => {
            chamaListagem();
        }, 600);

        return () => {
            clearTimeout(timeout);
        }
    }, [page, pesquisa])

    // Dispara ação
    const chamaListagem = async () => {
        const result = await listarClientes(pesquisa, limit, page);
        if (result.status == 200) {
            setTotal(result.__count);
            setClientes(result.data);
        }
    }
    const disparaPesquisa = (valor) => {
        setPage(0);
        setPesquisa(valor);
    }

    const goNext = () => {
        if ( page < totalClientes - 1){
            setPage(prev => prev + 1)
        }
    };   
    const goVoltar = () => {
        if (page > 0) {
            setPage(prev => prev - 1);
        }
    };

    return (
        <>
            <header className={styles.container}>
                <div className={styles.pesquisa}>
                    <Search observavdorPesquisa={disparaPesquisa}></Search>
                    <div>
                        <button className={styles.novocliente} onClick={() => setOpen(true)} ><FaPlus /> Novo Cliente</button>
                    </div>
                </div>
            </header>
            <FormCliente isOpen={abrir} onClose={() => setOpen(false)} onAttHomePage={chamaListagem} ></FormCliente>
            <section className={styles.grid}>
                {clientes.map(c =>
                    <Cards key={c.id} cliente={c} onAtualizar={chamaListagem} />
                )}
            </section>
             <div className={styles.paginacao}>
                <div className={styles.paginationInfo}> Itens {page * limit + 1} - {(page * limit) + clientes.length} de {totalClientes}</div>
                <div className={styles.paginationControls}>
                    <span>Página </span>
                    <a className={`${styles.previous} ${page === 0 ? styles.disabled : ''}`} onClick={goVoltar} disabled={page === 0} >&lt;</a>
                    <input value={page + 1} className={styles.pageNumber} readOnly />
                    <a onClick={goNext} disabled={page >= totalClientes - 1} className={`${styles.next} ${(page >= totalClientes - 1) ? styles.disabled : ''}`}>&gt;</a>
                    <span> de {pageTotal}</span>
                </div>
            </div>

        </>
    )
}