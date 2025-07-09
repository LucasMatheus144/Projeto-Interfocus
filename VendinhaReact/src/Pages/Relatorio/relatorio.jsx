import { useEffect, useState } from 'react';
import { gerarPersonalizado } from '../../services/dividaService';
import { formatarValor } from '../../services/validarService';

import styles from './relatorio.module.css';
import Paginacao from '../../Components/Paginacao/Paginacao';

function Info({ titulo, valor }) {
    return (
        <div className={styles.sessao}>
            <div className={styles.gptexto}>
                <h3>{titulo}</h3>
            </div>
            <div className={styles.result}>
                <h3>R$</h3>
                <span>{valor}</span>
            </div>
        </div>
    );
}

export default function Relatorio() {
    const [dados, setDados] = useState([]);

    const [page, setPage] = useState(0);
    const [totalClientes, setTotal] = useState(0);

    const limit = 10;

    // Efeitos para atualização de componentes

    const chamaListagem = async (pageatual) => {
        try {
            const result = await gerarPersonalizado(limit,pageatual);
            if (result.status === 200) {
                setDados(result);
                setTotal(result.__count);
            }
        } catch (error) {
            console.error('Erro ao chamar API:', error);
        }
    };

    useEffect(() => {
        chamaListagem(page);
    }, [page]);

    return (
        <div className={styles.container}>
            <h3>Relatorio de Valores</h3>
            <div className={styles.grupo}>
                <Info titulo="A Receber" valor={formatarValor(dados.aReceber)} />
                <Info titulo="Recebido" valor={formatarValor(dados.recebido)} />
            </div>
            <section className={styles.datatable}>
                <table className={styles.tabela} id="tabela">
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Cpf</th>
                            <th>Email</th>
                            <th>Contas A Receber</th>
                            <th>Contas Pagas</th>
                            <th>Total por cliente</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {dados.detalhes?.map((c, index) => (
                            <tr key={index} className={styles.frame}>
                                <td>{c.nome}</td>
                                <td>{c.cpf}</td>
                                <td>{c.email}</td>
                                <td>R$: {formatarValor(c.vaiReceber)}</td>
                                <td>R$: {formatarValor(c.jaPagou)}</td>
                                <td>R$: {formatarValor(c.total)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
            <Paginacao limit={limit} total={totalClientes} attPage={(paginaAtual) => chamaListagem(paginaAtual)}/>
        </div>
    );
}
