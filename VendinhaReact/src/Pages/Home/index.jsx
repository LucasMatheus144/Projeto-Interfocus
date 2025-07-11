import { useEffect, useState } from "react";
import { listarClientes } from '../../services/clienteService';
import { FaPlus } from "react-icons/fa";

import Search from '../../Components/InputSearch/Search';
import Cards from '../../Components/Cards/Cards';
import FormCliente from "../../Components/FormCliente/FormCliente";
import Paginacao from "../../Components/Paginacao/Paginacao";
import styles from './home.module.css';

export default function HomePage() {
    /*FormCliente*/
    const [abrir, setOpen] = useState(false);
    const [clienteComDividaAberta, setClienteComDividaAberta] = useState(null);

    /* Chamada API */
    const [clientes, setClientes] = useState([]);
    const [pesquisa, setPesquisa] = useState("");
    const [totalClientes, setTotal] = useState(0);

    /*Paginação*/
    const [page, setPage] = useState(0);
    const limit = 10;

    const [alerta, setAlerta] = useState(null);

    const exibirAlerta = (mensagem) => {
        setAlerta({ exibir: true, status: true, mensagem });
        setTimeout(() => setAlerta(null), 8000);
    };
    // Efeitos para atualização de componentes
    useEffect(() => {
        var timeout = setTimeout(() => {
            chamaListagem(page);
        }, 600);

        return () => {
            clearTimeout(timeout);
        }
    }, [pesquisa])

    // Dispara ação
    const chamaListagem = async (pageAtual) => {
        const result = await listarClientes(pesquisa, limit, pageAtual);
        if (result.status === 200) {
            setTotal(result.__count);
            setClientes(result.data);
        }
    }

    const handlePageChange = (paginaAtual) => {
        setCurrentPage(paginaAtual);
    };
    const disparaPesquisa = (valor) => {
        setPage(0);
        setPesquisa(valor);
    }

    const atualizarPagePaginacao = () => {
        chamaListagem(page);
    }

    const alternarFormularioDivida = (clienteId) => {
        setClienteComDividaAberta(prev => prev === clienteId ? null : clienteId);
    };

    return (
        <>
            {alerta?.exibir && (
                <Alerta tipo="sucesso" mensagem={alerta.mensagem} onClose={() => setAlerta(null)} />
            )}
            <header className={styles.container}>
                <div className={styles.pesquisa}>
                    <Search observavdorPesquisa={disparaPesquisa}></Search>
                    <div>
                        <button className={styles.novocliente} onClick={() => setOpen(true)} ><FaPlus /> Novo Cliente</button>
                    </div>
                </div>
            </header>
            <FormCliente isOpen={abrir} onClose={() => setOpen(false)} onAttHomePage={atualizarPagePaginacao} numPage={handlePageChange} onAlertaSucesso={exibirAlerta}></FormCliente>
            <section className={styles.grid}>
                {clientes.map(c =>
                    <Cards key={c.id} cliente={c} onAtualizar={chamaListagem} aberto={clienteComDividaAberta === c.id} onAbrir={() => alternarFormularioDivida(c.id)} />
                )}
            </section>
            <footer className={styles.lowerpage}>
                <Paginacao limit={limit} total={totalClientes} attPage={(paginaAtual) => {
                    setPage(paginaAtual);
                    chamaListagem(paginaAtual);
                }} />
            </footer>
        </>
    )
}