import { useEffect, useState } from 'react';
import { excluirCliente } from '../../services/clienteService';
import { deletarDivida } from '../../services/dividaService';

import styles from './temcerteza.module.css';
import Alerta from '../Alertas/Alerta';


export default function TemCerteza({ isAbrir, onClose, id, attForm, obj }) {
    if (!isAbrir) return null;
    var valida = obj === false;

    const [popup, setPopup] = useState([]);


    useEffect(() => {
        if (popup.length > 0) {
            const timeout = setTimeout(() => {
                setPopup(prev => prev.slice(1));
            }, 8000);
            return () => clearTimeout(timeout);
        }
    }, [popup]);

    const gerarExclusao = async () => {
        const status = await (valida ? excluirCliente(id) : deletarDivida(id));

        if (status.status === 200) {
            onClose();
            attForm(0);
            setPopup([{ exibir: true, status: true, mensagem: "Operação realizada com sucesso!" }]);
        } else {
            const mensagens = status?.data ?? status;
            const listaDeErros = Array.isArray(mensagens) && mensagens.length > 0
                 mensagens.map(msg => ({
                    exibir: true,
                    status: false,
                    mensagem: msg.mensagem
                }));
            setPopup(listaDeErros);
            onClose();
            attForm(0);
        }

    }
    return (
        <>

            {
                popup.map((a, index) => (
                    <Alerta key={index} isAbrir={a.exibir} status={a.status} txtError={a.mensagem} isFechar={() => {
                        const novaLista = [...popup];
                        novaLista.splice(index, 1);
                        setPopup(novaLista);
                    }} />
                ))
            }
            < div className={styles.componente} >
                <div className={styles.dialogo}>
                    <div className={styles.content}>
                        <div className={styles.header}>
                            <h5 className={styles.titulo}>Exclusão</h5>
                        </div>
                        <div className={styles.descricao}> Confirma a exclusão do cadastro?
                            {valida &&
                                <>
                                    <br />
                                    <strong>Todas as dividas atreladas serão apagadas.</strong>
                                </>
                            }

                        </div>
                        <div className={styles.finale}>
                            <button className={styles.nao} type="button" onClick={onClose} >Não</button>
                            <button className={styles.sim} type="button" onClick={gerarExclusao}>Sim</button>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );

}