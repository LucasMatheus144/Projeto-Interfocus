import { useState, useEffect, useRef, lazy } from "react";
import { listarDividas, salvarDivida, listarPorId } from '../../services/dividaService';
import { formatarData, formatarValor } from '../../services/validarService';
import { PageProvider } from "../../Contexts/PageContext";

import styles from './divida.module.css';
import Search from '../../Components/InputSearch/Search';
import Paginacao from "../../Components/Paginacao/Paginacao";
import Alerta from "../../Components/Alertas/Alerta";
import Loading from "../../Components/loading/loading";

const Divida = lazy(() => import('../../Components/FormDivida/Divida'));
const TemCerteza = lazy(() => import('../../Components/Confirmation/TemCerteza'));

const StatusDivida = {
    NAO_PAGO: 1,
    PAGO: 2
};

export default function Dividas() {
    const {
        modalOpen, setModalOpen,
        viewMode, setViewMode,
        excluirAberto, setExcluirAberto,
        dividaSelecionada, setDividaSelecionada,
        dividaParaExcluir, setDividaParaExcluir,
        dividas,
        totalDivida,
        pesquisa, setPesquisa,
        page, setPage,
        pop, setPop,
        loading,
        selecionado, setSelecionado,
        pagar, setPagar,
        podePagar,
        refTabela,
        refBotao,
        abrirFormulario,
        chamaListagem, limit
    } = useDivida(StatusDivida);

    return (
        <>
            <div id="agrupamento">
                {pop.map((a, index) => (
                    <Alerta key={index} isAbrir={a.exibir} status={a.status} txtError={a.mensagem} isFechar={() => {
                        const novaLista = [...pop];
                        novaLista.splice(index, 1);
                        setPop(novaLista);
                    }} />
                ))}
            </div>
            <PageProvider>
                <div className={styles.topo}><h3>Listagem de Dívidas</h3></div>
                <header className={styles.container}>
                    <Cadastros setPesquisa={setPesquisa} refBotao={refBotao} podePagar={podePagar} setPagar={setPagar} abrirFormulario={abrirFormulario} />
                </header>

                {modalOpen && (
                    <Divida
                        isOpen={modalOpen}
                        onClose={() => setModalOpen(false)}
                        onAtualizar={chamaListagem}
                        obj={dividaSelecionada}
                        view={viewMode}
                    />
                )}

                <section className={styles.datatable}>
                    <TableDividas
                        dividas={dividas} selecionado={selecionado} setSelecionado={setSelecionado} confirmarExclusao={(id) => { setDividaParaExcluir(id); setExcluirAberto(true); }}
                        abrirFormulario={abrirFormulario} setViewMode={setViewMode} refTabela={refTabela} setModalOpen={setModalOpen} setDividaSelecionada={setDividaSelecionada}
                    />
                </section>

                <Paginacao limit={limit} total={totalDivida} exibindo={dividas.length} attPage={setPage} />

                {excluirAberto && (
                    <TemCerteza isAbrir={excluirAberto} onClose={() => setExcluirAberto(false)} id={dividaParaExcluir} attForm={setPage} obj={true} />
                )}

                {loading && <Loading />}
            </PageProvider>
        </>
    );
}

function useDivida(StatusDivida, limit = 10) {
    const [modalOpen, setModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState(false);
    const [excluirAberto, setExcluirAberto] = useState(false);
    const [dividaSelecionada, setDividaSelecionada] = useState(null);
    const [dividaParaExcluir, setDividaParaExcluir] = useState(null);
    const [dividas, setDividas] = useState([]);
    const [totalDivida, setTotal] = useState(0);
    const [pesquisa, setPesquisa] = useState("");
    const [page, setPage] = useState(0);
    const [pop, setPop] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selecionado, setSelecionado] = useState(null);
    const [pagar, setPagar] = useState(false);

    const refTabela = useRef(null);
    const refBotao = useRef(null);

    const podePagar = dividas.find(c => c.idDivida === selecionado)?.status === StatusDivida.NAO_PAGO;

    const chamaListagem = async (paginaAtual) => {
        setLoading(true);
        const result = await listarDividas(pesquisa, limit, paginaAtual);
        if (result.status === 200) {
            setTotal(result.__count);
            setDividas(result.data);
        }
        setLoading(false);
    };

    const abrirFormulario = (divida = null) => {
        setDividaSelecionada(divida);
        setViewMode(false);
        setModalOpen(true);
    };

    const executaPagarDivida = async () => {
        setLoading(true);
        const res = await listarPorId(selecionado);
        if (res.status === 200) {
            const x = res.data;
            const payload = {
                idDivida: x.id,
                clienteId: x.cliente.id,
                valor: x.valor,
                dataCadastro: x.dataCadastro,
                dataPagamento: new Date(),
                descricao: x.descricao,
                situacao: x.situacao
            };

            const resultado = await salvarDivida(payload);
            if (resultado.status === 200) {
                chamaListagem(0);
                setSelecionado(null);
                setPop([{ exibir: true, status: true, mensagem: "Nota Fiscal emitida com sucesso!" }]);
            } else {
                const mensagens = resultado?.data ?? resultado;
                const listaDeErros = Array.isArray(mensagens) && mensagens.length > 0
                    ? mensagens.map(msg => ({ exibir: true, status: false, mensagem: msg.mensagem }))
                    : [{ exibir: true, status: false, mensagem: "Erro desconhecido." }];
                setPop(listaDeErros);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                refTabela.current && !refTabela.current.contains(event.target) &&
                refBotao.current && !refBotao.current.contains(event.target)
            ) {
                setSelecionado(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (pop.length > 0) {
            const timeout = setTimeout(() => setPop([]), 8000);
            return () => clearTimeout(timeout);
        }
    }, [pop]);

    useEffect(() => {
        if (pagar && podePagar) {
            executaPagarDivida();
            setPagar(false);
        }
    }, [pagar]);

    useEffect(() => {
        const timeout = setTimeout(() => chamaListagem(page), 400);
        return () => clearTimeout(timeout);
    }, [pesquisa, page]);

    return {
        modalOpen, setModalOpen,
        viewMode, setViewMode,
        excluirAberto, setExcluirAberto,
        dividaSelecionada, setDividaSelecionada,
        dividaParaExcluir, setDividaParaExcluir,
        dividas, setDividas,
        totalDivida, setTotal,
        pesquisa, setPesquisa,
        page, setPage,
        pop, setPop,
        loading,
        selecionado, setSelecionado,
        pagar, setPagar,
        podePagar,
        refTabela,
        refBotao,
        abrirFormulario,
        chamaListagem,
        executaPagarDivida, limit
    };
}

function TableDividas({ dividas, selecionado, setSelecionado, confirmarExclusao, abrirFormulario, setViewMode, refTabela, setModalOpen, setDividaSelecionada }) {
    return (
        <table className={styles.tabela} ref={refTabela} id="tabela">
            <thead>
                <tr>
                    <th></th>
                    <th>Cliente</th>
                    <th>Cadastro</th>
                    <th>Pagamento</th>
                    <th>Status</th>
                    <th>Valor</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {dividas.map((c, index) => (
                    <tr key={index} className={styles.frame}>
                        <td><input type="checkbox" checked={selecionado === c.idDivida} onChange={() => setSelecionado(c.idDivida)} /></td>
                        <td>{c.nome}</td>
                        <td>{formatarData(c.cadastro)}</td>
                        <td>{formatarData(c.pagamento)}</td>
                        <td><div className={c.status === StatusDivida.NAO_PAGO ? styles.devendo : styles.pago}>{c.status === StatusDivida.NAO_PAGO ? 'Não Pago' : 'Pago'}</div></td>
                        <td>R$: {formatarValor(c.valor)}</td>
                        <td>
                            {c.status === StatusDivida.PAGO && c.url_pdf && (
                                <span onClick={() => window.open(c.url_pdf, '_blank')} style={{ cursor: 'pointer' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="Download">
                                        <path d="M21,14a1,1,0,0,0-1,1v4a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V15a1,1,0,0,0-2,0v4a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V15A1,1,0,0,0,21,14Zm-9.71,1.71a1,1,0,0,0,.33.21.94.94,0,0,0,.76,0,1,1,0,0,0,.33-.21l4-4a1,1,0,0,0-1.42-1.42L13,12.59V3a1,1,0,0,0-2,0v9.59l-2.29-2.3a1,1,0,1,0-1.42,1.42Z" fill="#a4a6ac"></path>
                                    </svg>
                                </span>
                            )}
                            <span onClick={() => { setDividaSelecionada(c); setViewMode(true); setModalOpen(true); }}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 12" id="View">
                                    <path d="M12 6c0 1.148-.895 2.077-2 2.077s-2-.93-2-2.076c0-1.148.895-2.077 2-2.077s2 .93 2 2.077m-2 3.923c-2.989 0-5.805-1.477-7.601-3.923C4.195 3.554 7.011 2.076 10 2.076s5.805 1.478 7.601 3.925C15.805 8.447 12.989 9.924 10 9.924M10 0C5.724 0 1.999 2.417 0 6c1.999 3.584 5.724 6 10 6s8.001-2.416 10-6c-1.999-3.583-5.724-6-10-6" fill="#a4a6ac"></path>
                                </svg>

                            </span>
                            <span onClick={() => { abrirFormulario(c); setViewMode(false) }}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="edit">
                                    <path d="M21.8 4.5c-.3-.7-.9-1.3-1.6-1.6-1.5-.6-3.2.1-3.9 1.5l-4.6 10.3c-.4.9-.5 2-.4 2.9l.4 2.2c.1.3.3.6.6.7.1.1.3.1.4.1.2 0 .4-.1.5-.2l1.9-1.2c.9-.6 1.5-1.3 1.9-2.3l4.6-10.3c.5-.6.5-1.4.2-2.1zm-6.4 11.8c-.3.6-.7 1-1.2 1.4l-.7.4-.1-.7c-.1-.6 0-1.2.2-1.8l3.5-8 1.8.7-3.5 8zM20 5.9l-.2.5-1.8-.7.2-.5c.2-.4.5-.6.9-.6.1 0 .3 0 .4.1.2.1.4.3.5.5.1.3.1.5 0 .7zM3 17h4c.6 0 1-.4 1-1s-.4-1-1-1H3c-.6 0-1 .4-1 1s.4 1 1 1zm6 2H3c-.6 0-1 .4-1 1s.4 1 1 1h6c.6 0 1-.4 1-1s-.4-1-1-1z" fill="#a4a6ac"></path>
                                </svg>
                            </span>
                            <span onClick={() => confirmarExclusao(c.idDivida)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="Delete">
                                    <path fill="none" d="M0 0h24v24H0V0z"></path>
                                    <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" fill="#a4a6ac"></path>
                                </svg>
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function Cadastros({ setPesquisa, refBotao, podePagar, setPagar, abrirFormulario }) {
    return (
        <div className={styles.pesquisa}>
            <Search observavdorPesquisa={setPesquisa} />
            <div className={styles.grupobtn} ref={refBotao}>
                <button className={`${styles.pagardivida} ${!podePagar ? styles.botaoDesativado : ''}`} onClick={() => setPagar(true)} disabled={!podePagar}>
                    <svg xmlns="http://www.w3.org/2000/svg" id="Plus" x="0" y="0" version="1.1" viewBox="0 0 92 92">
                        <path id="XMLID_933_" d="M72.5 46.5c0 2.5-2 4.5-4.5 4.5H50v17c0 2.5-2 4.5-4.5 4.5S41 70.5 41 68V51H24c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5h17V24c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5v18h18c2.5 0 4.5 2 4.5 4.5z" fill="#ffff"></path>
                    </svg>
                    Pagar Divida
                </button>
                <button className={styles.novadivida} onClick={() => abrirFormulario(null)} >
                    <svg xmlns="http://www.w3.org/2000/svg" id="Plus" x="0" y="0" version="1.1" viewBox="0 0 92 92">
                        <path id="XMLID_933_" d="M72.5 46.5c0 2.5-2 4.5-4.5 4.5H50v17c0 2.5-2 4.5-4.5 4.5S41 70.5 41 68V51H24c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5h17V24c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5v18h18c2.5 0 4.5 2 4.5 4.5z" fill="#ffff"></path>
                    </svg> Novo Divida
                </button>
            </div>
        </div>
    );
}
