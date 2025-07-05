
import { useState, useEffect } from "react";
import { listarDividas, salvarDivida, listarPorId } from '../../services/dividaService';
import { formatarData } from '../../services/validarService';

import { FaPlus } from "react-icons/fa";
import { AiOutlineEdit } from "react-icons/ai";
import { GrFormView } from "react-icons/gr";
import { MdDeleteOutline } from "react-icons/md";


import styles from './divida.module.css';
import Search from '../../Components/InputSearch/Search';
import Paginacao from "../../Components/Paginacao/Paginacao";
import Divida from "../../Components/FormDivida/Divida";
import TemCerteza from "../../Components/Confirmation/TemCerteza";

export default function Dividas() {
    const [modalOpen, setModalOpen] = useState(false);
    const [divida, serDivida] = useState([]);
    const [pesquisa, setPesquisa] = useState("");
    const [dividaSelecionada, setDividaSelecionada] = useState(null);
    const [viewMode, setViewMode] = useState(false);
    const [excluirAberto, setExcluirAberto] = useState(false);
    const [dividaParaExcluir, setDividaParaExcluir] = useState(null);

    /*Paginação*/
    const [page, setPage] = useState(0);
    const [totalDivida, setTotal] = useState(0);
    const limit = 10;

    //CheckBox
    const [selecionado, setSelecionado] = useState(null);
    const [pagar , setPagar] = useState(false);

    const dividaSelecionadaInfo = divida.find(c => c.idDivida === selecionado);
    const podePagar = dividaSelecionadaInfo && dividaSelecionadaInfo.status === 1;

    const executaPagarDivida = async () => {
        const res = await listarPorId(selecionado);
        if (res.status === 200) {
            var x = res.data;

            const divida = {
                idDivida: x.id,
                clienteId: x.cliente.id,
                valor: x.valor,
                dataCadastro: x.dataCadastro,
                dataPagamento: new Date(),
                descricao: x.descricao,
                situacao: x.situacao
            };

            const resultado = await salvarDivida(divida);
            console.log(resultado);
            if (resultado.status === 200) {
                chamaListagem(0);               
            } 
        }
    };

    useEffect(() => {
        if (!podePagar) return;

        executaPagarDivida();
    }, [pagar]);


    const abrirFormulario = (divida = null) => {
        setDividaSelecionada(divida);
        setModalOpen(true);
    };

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

    const confirmarExclusao = (c) => {
        setDividaParaExcluir(c);
        setExcluirAberto(true);
    };

    useEffect(() => {
        var timeout = setTimeout(() => {
            chamaListagem(page);
        }, 700);

        return () => {
            clearTimeout(timeout);
        }
    }, [pesquisa])

    return (
        <>
            <header className={styles.container}>
                <div className={styles.pesquisa}>
                    <Search observavdorPesquisa={disparaPesquisa}></Search>
                    <div className={styles.grupobtn}>
                        <button className={`${styles.pagardivida} ${!podePagar ? styles.botaoDesativado : ''}`} onClick={ () => setPagar(true)} disabled={!podePagar} ><FaPlus /> Pagar Divida</button>
                        <button className={styles.novadivida} onClick={() => abrirFormulario(null)} ><FaPlus /> Novo Divida</button>
                    </div>
                </div>
            </header>
            {modalOpen && (
                <Divida isOpen={modalOpen} onClose={() => setModalOpen(false)} onAtualizar={chamaListagem} obj={dividaSelecionada} view={viewMode} />
            )}
            <section className={styles.datatable}>
                <table className={styles.tabela} id="tabela">
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
                                <td>{c.status === 1 ? 'Não Pago' : 'Pago'}</td>
                                <td>R$:{c.valor}</td>
                                <td>
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

        </>
    )
}