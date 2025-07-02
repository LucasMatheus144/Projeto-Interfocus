import Model from '../Model/Modal';
import styles from './divida.module.css';
import Alerta from '../Model/Alertas/Alerta';

import { salvarDivida } from '../../services/dividaService';
import { useEffect, useState } from 'react';

export default function Divida({ isOpen, onClose, onAtualizar, obj }) {
    const [alertas, setAlertas] = useState([]);

    const fecharAlerta = (index) => {
        setAlertas(prev => {
            const novaLista = [...prev];
            novaLista.splice(index, 1);
            return novaLista;
        });
    };

    const processarFormulario = async (form) => {
        const oData = new FormData(form);

        const divida = {
            idDivida: oData.get("divida") || 0,
            clienteId: oData.get("id"),
            valor: oData.get("valor"),
            dataPagamento: oData.get("pagamento") || null,
            descricao: oData.get("observacao")
        };

        const resultado = await salvarDivida(divida);
        if (resultado.status === 200) {
            onAtualizar();
            onClose();
            setAlertas([{ exibir: true, status: true, mensagem: "Operação realizada com sucesso!" }]);
        } else {
            const mensagens = resultado?.data ?? resultado;
            const listaDeErros = Array.isArray(mensagens) && mensagens.length > 0
                ? mensagens.map(msg => ({ exibir: true, status: false, mensagem: msg.mensagem }))
                : [{ exibir: true, status: false, mensagem: "Erro desconhecido." }];
            setAlertas(listaDeErros);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        processarFormulario(event.target);
    };

    useEffect(() => {
        if (alertas.length > 0) {
            const timeout = setTimeout(() => {
                setAlertas(prev => prev.slice(1));
            }, 8000);
            return () => clearTimeout(timeout);
        }
    }, [alertas]);

    return (
        <>
            <div className={styles.agrupamento}>
                {alertas.map((a, index) => (
                    <Alerta
                        key={index}
                        isAbrir={a.exibir}
                        status={a.status}
                        txtError={a.mensagem}
                        isFechar={() => fecharAlerta(index)}
                    />
                ))}
            </div>
            <Model isOpen={isOpen} onClose={onClose}>
                <form action="POST" className={styles.formulario} onSubmit={handleSubmit}>
                    <input type="number" name="divida" defaultValue={obj?.idDivida ?? 0} className={styles.ocultar} />
                    <input type="number" name="id" defaultValue={obj?.id ?? ""} className={styles.ocultar} />

                    <label>Nome do cliente</label>
                    <input type="text" name="fictio" defaultValue={obj.nome} disabled />

                    <div className={styles.row}>
                        <div className={styles.col}>
                            <label>Valor</label>
                            <input name="valor" type="number"  placeholder="0.00" required />
                        </div>

                        <div className={styles.col}>
                            <label>Data de pagamento</label>
                            <input name="pagamento" type="date" />
                        </div>
                    </div>

                    <label>Descrição</label>
                    <input name="observacao" type="text" placeholder="Descreva aqui..." required />

                    <div className={styles.buttoes}>
                        <button className={styles.cancelar} onClick={onClose} type="button">Cancelar</button>
                        <button className={styles.cadastrar} type="submit">Cadastrar</button>
                    </div>
                </form>
            </Model>
        </>
    );
}
