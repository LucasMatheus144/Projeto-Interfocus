import Model from '../Model/Modal';
import styles from './divida.module.css';
import Alerta from '../Model/Alertas/Alerta';

import { salvarDivida } from '../../services/dividaService';
import { useEffect, useState } from 'react';


export default function Divida({ isOpen, onClose, onAtualizar, obj }) {

    const [alertas, setAlertas] = useState([]);


    const enviarForm = async (event) => {
        event.preventDefault();

        const form = event.target;
        const oData = new FormData(form);

        const divida = {
            idDivida: oData.get("divida")|| 0,
            clienteId: oData.get("id"),
            valor: oData.get("valor"),
            dataPagamento: oData.get("pagamento") || null,
            descricao: oData.get("observacao")
        }

        const resultado = await salvarDivida(divida);
        if (resultado.status == 200) {
            onAtualizar();
            onClose();
        }
    }

    
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
                        isFechar={() => {
                            const novaLista = [...alertas];
                            novaLista.splice(index, 1);
                            setAlertas(novaLista);
                        }}
                    />
                ))}
            </div>
            <Model isOpen={isOpen} onClose={onClose}>
                <form action="POST" className={styles.formulario} onSubmit={enviarForm}>
                    <input type="number" name="divida" className={styles.ocultar} />
                    <input type="number" name="id" defaultValue={obj?.id ?? ""} className={styles.ocultar} />

                    <label>Nome do cliente</label>
                    <input type="text" name="fictio" defaultValue={obj.nome} disabled />

                    <div className={styles.row}>
                        <div className={styles.col}>
                            <label>Valor</label>
                            <input name="valor" placeholder="0.00 (separador por .)" required />
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
    )

    
}