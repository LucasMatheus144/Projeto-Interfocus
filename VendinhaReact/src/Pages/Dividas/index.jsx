
import { useState, useEffect, useRef } from "react";
import { listarDividas, salvarDivida, listarPorId } from '../../services/dividaService';
import { formatarData, formatarValor } from '../../services/validarService';
import { FaPlus } from "react-icons/fa";
import { AiOutlineEdit } from "react-icons/ai";
import { GrFormView } from "react-icons/gr";
import { MdDeleteOutline } from "react-icons/md";
import { BsDownload } from "react-icons/bs";


import styles from './divida.module.css';
import Search from '../../Components/InputSearch/Search';
import Paginacao from "../../Components/Paginacao/Paginacao";
import Divida from "../../Components/FormDivida/Divida";
import TemCerteza from "../../Components/Confirmation/TemCerteza";
import Alerta from "../../Components/Alertas/Alerta";
import Loading from "../../Components/loading/loading";

const StatusDivida = {
    NAO_PAGO: 1,
    PAGO: 2
};

export default function Dividas() {
    //abrir modal
    const [modalOpen, setModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState(false);
    const [excluirAberto, setExcluirAberto] = useState(false);
    //preenche api
    const [divida, serDivida] = useState([]);
    //search
    const [pesquisa, setPesquisa] = useState("");
    // selecionar divida para pagamento rapido e selecionar a exclusão
    const [dividaSelecionada, setDividaSelecionada] = useState(null);
    const [dividaParaExcluir, setDividaParaExcluir] = useState(null);
    //alertas
    const [pop, setPop] = useState([]);
    const [loading, setLoading] = useState(false);
    /*Paginação*/
    const [page, setPage] = useState(0);
    const [totalDivida, setTotal] = useState(0);
    const limit = 10;
    //CheckBox
    const [selecionado, setSelecionado] = useState(null);
    const [pagar, setPagar] = useState(false);
    // logica para exibir o botão de Pagamento rapido
    const dividaSelecionadaInfo = divida.find(c => c.idDivida === selecionado);
    const podePagar = dividaSelecionadaInfo && dividaSelecionadaInfo.status === 1;
    // observadores
    const refBotao = useRef(null);
    const refTabela = useRef(null);

    useEffect(() => {
        if (pop.length > 0) {
            const timeout = setTimeout(() => {
                setPop(prev => prev.slice(1));
            }, 8000);
            return () => clearTimeout(timeout);
        }
    }, [pop]);

    useEffect(() => {
        if (!podePagar) return;

        executaPagarDivida();
        setPagar(false);  // isso é nescessario para poder clicar no btn mais vezes após o primeira divida paga
    }, [pagar]);

    useEffect(() => {
        var timeout = setTimeout(() => {
            chamaListagem(page);
        }, 700);

        return () => {
            clearTimeout(timeout);
        }
    }, [pesquisa])

    // isso é pra remover o checkbox quando clicar para fora do table
    useEffect(() => {
        function handleClickOutside(event) {
            const foraTabela = refTabela.current && !refTabela.current.contains(event.target); // olha a TABLE
            const foraBotao = refBotao.current && !refBotao.current.contains(event.target); // olha o botão de pagamento
            if (foraTabela && foraBotao) {
                setSelecionado(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const chamaListagem = async (paginaAtual) => {
        const result = await listarDividas(pesquisa, limit, paginaAtual);
        if (result.status == 200) {
            setTotal(result.__count);
            serDivida(result.data);
        }
    }

    const disparaPesquisa = (valor) => {
        setPage(0);
        setPesquisa(valor);
    }

    const abrirFormulario = (divida = null) => {
        setDividaSelecionada(divida);
        setModalOpen(true);
    };

    const executaPagarDivida = async () => {
        setLoading(true);
        const res = await listarPorId(selecionado);
        if (res.status === 200) {
            var x = res.data;

            const divida = {
                idDivida: x.id,
                clienteId: x.cliente.id,
                valor: x.valor,
                dataCadastro: x.dataCadastro,
                dataPagamento: new Date(),//.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }),  o deploy e o banco estão em Nova York ✈️
                descricao: x.descricao,
                situacao: x.situacao
            };

            const resultado = await salvarDivida(divida);
            console.log(resultado);
            if (resultado.status === 200) {
                chamaListagem(0);
                setSelecionado(null);
                setPop([{ exibir: true, status: true, mensagem: "Operação realizada com sucesso!" }]);
            } else {
                const mensagens = resultado?.data ?? resultado;
                const listaDeErros = Array.isArray(mensagens) && mensagens.length > 0
                    ? mensagens.map(msg => ({ exibir: true, status: false, mensagem: msg.mensagem }))
                    : [{ exibir: true, status: false, mensagem: "Erro desconhecido." }];
                setPop(listaDeErros);
            }

            setLoading(false);
        }
    };

    const confirmarExclusao = (c) => {
        setDividaParaExcluir(c);
        setExcluirAberto(true);
    };

    return (
        <>
            {pop.map((a, index) => (
                <Alerta key={index} isAbrir={a.exibir} status={a.status} txtError={a.mensagem}
                    isFechar={() => {
                        const novaLista = [...pop];
                        novaLista.splice(index, 1);
                        setPop(novaLista);
                    }}
                />
            ))}

            <div className={styles.topo}>
                <h3>Listagem de Dividas</h3>
            </div>
            <header className={styles.container}>
                <div className={styles.pesquisa}>
                    <Search observavdorPesquisa={disparaPesquisa}></Search>
                    <div className={styles.grupobtn} ref={refBotao} >
                        <button className={`${styles.pagardivida} ${!podePagar ? styles.botaoDesativado : ''}`} onClick={() => setPagar(true)} disabled={!podePagar} ><FaPlus /> Pagar Divida</button>
                        <button className={styles.novadivida} onClick={() => abrirFormulario(null)} ><FaPlus /> Novo Divida</button>
                    </div>
                </div>
            </header>
            {modalOpen && (
                <Divida isOpen={modalOpen} onClose={() => setModalOpen(false)} onAtualizar={chamaListagem} obj={dividaSelecionada} view={viewMode} />
            )}
            <section className={styles.datatable}>
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
                        {divida.map((c, index) => (
                            <tr key={index} className={styles.frame}>
                                <td><input type="checkbox" checked={selecionado === c.idDivida} onChange={() => setSelecionado(c.idDivida)} /></td>
                                <td>{c.nome}</td>
                                <td>{formatarData(c.cadastro)}</td>
                                <td>{formatarData(c.pagamento)}</td>
                                <td><div className={c.status === 1 ? styles.devendo : styles.pago}>{c.status === StatusDivida.NAO_PAGO ? 'Não Pago' : 'Pago'}</div></td>
                                <td>R$: {formatarValor(c.valor)}</td>
                                <td>
                                    {c.status === StatusDivida.PAGO && c.url_pdf && (
                                        <span onClick={() => window.open(c.url_pdf, '_blank')} style={{ cursor: 'pointer' }}>
                                            <BsDownload />
                                        </span>
                                    )}
                                    <span onClick={() => { setDividaSelecionada(c); setViewMode(true); setModalOpen(true); }}><GrFormView /></span>
                                    <span onClick={() => { abrirFormulario(c); setViewMode(false) }}><AiOutlineEdit /></span>
                                    <span onClick={() => confirmarExclusao(c.idDivida)}><MdDeleteOutline /></span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
            <Paginacao limit={limit} total={totalDivida} attPage={(paginaAtual) => chamaListagem(paginaAtual)} />

            <TemCerteza isAbrir={excluirAberto} onClose={() => setExcluirAberto(false)} id={dividaParaExcluir} attForm={(paginaAtual) => chamaListagem(paginaAtual)} obj={true} />
            {loading && <Loading />}
        </>
    )
}