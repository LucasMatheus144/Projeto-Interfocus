import Model from '../Model/Modal';
import styles from './divida.module.css';
import Alerta from '../Alertas/Alerta';
import InputSelect from '../InputDataList/InputSelect';
import Loading from '../loading/loading';

import { salvarDivida, listarPorId } from '../../services/dividaService';
import { useEffect, useState } from 'react';
import { formataImput } from '../../services/validarService';

export default function Divida({ isOpen, onClose, onAtualizar, obj, view }) {
    const [dados, setDados] = useState(null);
    const [popup, setPopup] = useState([]);
    const [clienteIdSelecionado, setClienteIdSelecionado] = useState(0);
    const idDivida = obj?.idDivida ?? null; // evitar disparar toda vevz que o componente é renderizado
    const [loading, setLoading] = useState(false);

    const processarFormulario = async (form) => {
        const oData = new FormData(form);
        setLoading(true);

        const divida = {
            idDivida: oData.get("dividaid") || 0,
            clienteId: oData.get("clienteid"),
            valor: oData.get("valor"),
            dataPagamento: oData.get("pagamento") || null,
            descricao: oData.get("observacao")
        };

        const resultado = await salvarDivida(divida);

        if (resultado.status === 200) {
            setPopup([{ exibir: true, status: true, mensagem: "Operação realizada com sucesso!" }]);
            onAtualizar(0);
            onClose();

        } else {
            const mensagens = resultado?.data ?? resultado;
            const listaDeErros = Array.isArray(mensagens) && mensagens.length > 0
                ? mensagens.map(msg => ({ exibir: true, status: false, mensagem: msg.mensagem }))
                : [{ exibir: true, status: false, mensagem: "Erro desconhecido." }];
            setPopup(listaDeErros);
        }

        setLoading(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        processarFormulario(event.target);
    };


    useEffect(() => {
        if (!isOpen || !idDivida) return;

        const carregarDados = async () => {
            const res = await listarPorId(idDivida);
            if (res.status === 200) {
                setDados(res.data);
            }
        };

        carregarDados();
    }, [isOpen, idDivida]);

    useEffect(() => {
        if (popup.length > 0) {
            const timeout = setTimeout(() => {
                setAlertas(prev => prev.slice(1))
            }, 8000);
            return () => clearTimeout(timeout);
        }
    }, [popup]);

    return (
        <>
            {popup.map((a, index) => (
                <Alerta key={index} isAbrir={a.exibir} status={a.status} txtError={a.mensagem} isFechar={() => {
                    const novaLista = [...popup];
                    novaLista.splice(index, 1);
                    setPopup(novaLista);
                }} />
            ))}
            <Model isOpen={isOpen} onClose={onClose}>
                <form action="POST" className={styles.formulario} onSubmit={handleSubmit}>
                    <input type="number" name="clienteid" value={dados?.cliente?.id ?? obj?.id ?? clienteIdSelecionado} readOnly className={styles.ocultar} />
                    <input type="number" name="dividaid" value={dados?.id ?? 0} readOnly className={styles.ocultar} />

                    {/*qUANDO NAO FOR CADASTRAR DIVIDA PELA HOME PAGE E NEM EDITAR A DIVIDA*/}
                    {dados?.cliente?.nome ?? obj?.nome ? (
                        <>
                            <label>Nome do cliente</label>
                            <input type="text" name="fictio" value={dados?.cliente?.nome ?? obj?.nome ?? ""} disabled />
                        </>

                    ) : (
                        <>
                            <InputSelect setClienteIdSelecionado={setClienteIdSelecionado} />
                        </>
                    )}

                    <div className={styles.row}>
                        <div className={styles.col}>
                            <label>Valor <strong id="obrigatorio">*</strong></label>
                            <input name="valor" className={styles.spinner} type="number" step="0.01" placeholder="0.00" defaultValue={dados?.valor ?? ""} required disabled={view} />
                        </div>

                        <div className={styles.col}>
                            <label>Data de pagamento </label>
                            <input name="pagamento" type="datetime-local" defaultValue={formataImput(dados?.dataPagamento)} disabled={view} />
                        </div>
                    </div>

                    <label>Descrição <strong id="obrigatorio">*</strong></label>
                    <input name="observacao" type="text" placeholder="Descreva aqui..." defaultValue={dados?.descricao ?? ""} required disabled={view} />

                    <div className={styles.buttoes}>
                        <button className={styles.cancelar} onClick={onClose} type="button">Cancelar</button>
                        <button className={styles.cadastrar} type="submit">Cadastrar</button>
                    </div>
                </form>
            </Model>
            {loading && <Loading />}
        </>
    );
}

