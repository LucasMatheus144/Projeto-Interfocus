
import { useState, useEffect } from "react";
import { listarDividas } from '../../services/dividaService';
import { formatarData } from '../../services/validarService';

import { FaPlus } from "react-icons/fa";
import { AiOutlineEdit } from "react-icons/ai";
import { GrFormView } from "react-icons/gr";
import { MdDeleteOutline } from "react-icons/md";


import styles from './divida.module.css';
import Search from '../../Components/InputSearch/Search';
import Paginacao from "../../Components/Paginacao/Paginacao";

export default function Dividas() {
    const [divida, serDivida] = useState([]);
    const [pesquisa, setPesquisa] = useState("");
    const [totalDivida, setTotal] = useState(0);

    /*Paginação*/
    const [page, setPage] = useState(0);
    const limit = 10;

    const chamaListagem = async () => {
        const result = await listarDividas(pesquisa, limit, page);
        if (result.status == 200) {
            setTotal(result.__count);
            serDivida(result.data);
        }
    }

    const disparaPesquisa = (valor) => {
        setPage(0);
        setPesquisa(valor);
    }

    useEffect(() => {
        var timeout = setTimeout(() => {
            chamaListagem();
        }, 700);

        return () => {
            clearTimeout(timeout);
        }
    }, [page, pesquisa])


    const goNext = () => {
        if (page < totalDivida - 1) {
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
                        <button className={styles.novadivida} ><FaPlus /> Novo Divida</button>
                    </div>
                </div>
            </header>
            <section className={styles.datatable}>
                <table className={styles.tabela} id="tabela">
                    <thead>
                        <tr>
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
                                <td>{c.nome}</td>
                                <td>{formatarData(c.cadastro)}</td>
                                <td>{formatarData(c.pagamento)}</td>
                                <td>{c.status === 1 ? 'Não Pago' : 'Pago'}</td>
                                <td>R$:{c.valor}</td>
                                <td>
                                    <span><GrFormView /></span>
                                    <span><AiOutlineEdit /></span>
                                    <span><MdDeleteOutline /></span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
            <Paginacao page={page} limit={limit} total={totalDivida} onPrev={goVoltar} onNext={goNext} />
        </>
    )
}