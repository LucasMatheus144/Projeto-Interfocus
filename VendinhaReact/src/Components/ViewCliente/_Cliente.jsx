import { useEffect, useState } from 'react';
import { listarPorCliente } from '../../services/dividaService';
import { dataAniversario, formatarData, formatarValor } from '../../services/validarService';

import styles from './view.module.css';

const StatusDivida = {
    NAO_PAGO: 1,
    PAGO: 2
};

const urlUser = 'https://bagimgs.s3.us-east-1.amazonaws.com/user.png';

/**
 * @param {Object} props.obj - Objeto para conseguir preencher todos os dados que precisamos
 */
export default function ViewCliente({ obj }) {
    const [divida, setDivida] = useState([]);

    useEffect(() => {
        if (!obj?.id) return;
        (async () => {
            try {
                const result = await listarPorCliente(obj.id);
                setDivida(result.data);
            } catch (err) {
                console.error("Erro ao buscar dados:", err);
            }
        })();
    }, [obj?.id]);

    return (
        <div className={styles.view}>
            <div className={styles.gpimagem}>
                <ImagemCliente obj={obj} />
                <DadosCliente obj={obj} />
                <TituloSecao texto="Listagem De Dividas" />
                <TabelaDividas dividas={divida} />
            </div>
        </div>
    );
}


function ImagemCliente({ obj }) {
    return (
        <div className={styles.imagem}>
            <img src={obj?.urlFoto ?? urlUser} alt="imagem" loading="lazy" />
            <div className={styles.infoprincipal}>
                <div className={styles.nome}>
                    <h3>{obj?.nome}</h3>
                </div>
                <div className={styles.identificador}>
                    <h3>ID : {obj?.id}</h3>
                    {obj?.situacao === 1 ? (
                        <span className={styles.adimplente}>Adimplente</span>
                    ) : (
                        <span className={styles.inadimplente}>Inadimplente</span>
                    )}
                </div>
            </div>
        </div>
    );
}

function DadosCliente({ obj }) {
    return (
        <div className={styles.dadosusuario}>
            <h4>DADOS DO CLIENTE</h4>
            <div className={styles.infodadosuser}>
                <InfoLabel label="CPF" valor={obj?.cpf} />
                <InfoLabel label="EMAIL" valor={obj?.email} />
                <InfoLabel label="Nascimento" valor={dataAniversario(obj?.dataNascimento)} />
            </div>
        </div>
    );
}

function InfoLabel({ label, valor }) {
    return (
        <div className={styles.resposta}>
            <label>{label}</label>
            <span>{valor}</span>
        </div>
    );
}

function TituloSecao({ texto }) {
    return (
        <div className={styles.dividadados}>
            <h4>{texto}</h4>
        </div>
    );
}

function TabelaDividas({ dividas }) {
    return (
        <section className={styles.datatable}>
            <table className={styles.tabela} id="tabela">
                <thead>
                    <tr>
                        <th>Valor</th>
                        <th>Pagamento</th>
                        <th>Situação</th>

                    </tr>
                </thead>
                <tbody>
                    {dividas.map((c, index) => (
                        <tr key={index} className={styles.frame}>
                            <td>{formatarValor(c.valor)}</td>
                            <td>{formatarData(c.pagamento)}</td>
                            <td>
                                <div className={c.situacao === StatusDivida.NAO_PAGO ? styles.devendo : styles.pago}>
                                    {c.situacao === StatusDivida.NAO_PAGO ? 'Não Pago' : 'Pago'}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}