import Model from '../Model/Modal';
import styles from './divida.module.css';
import Alerta from '../Alertas/Alerta';
import InputSelect from '../InputDataList/InputSelect';
import Loading from '../loading/loading';

import { salvarDivida, listarPorId } from '../../services/dividaService';
import { useEffect, useState } from 'react';
import { formataImput } from '../../services/validarService';
import { usePaginaAtual } from "../../Contexts/PageContext";


/**
 * @param {boolean} props.isOpen - Define se o modal do formulário está aberto.
 * @param {Function} props.onClose - Função chamada para fechar o formulário.
 * @param {Function} props.onAttHomePage - Função para atualizar a listagem na página principal.
 * @param {Object|null} props.obj - Objeto qé passado, se for null é um novo cadastro ?? editar cadastro.
 * @param {boolean} props.view - Se for true, bloqueia os inputs para somente poder visualizar
 */
export default function Divida({ isOpen, onClose, onAtualizar, obj, view }) {
    const [dados, setDados] = useState(null);
    const [popup, setPopup] = useState([]);
    const [clienteIdSelecionado, setClienteIdSelecionado] = useState(0);
    const idDivida = obj?.idDivida ?? null; // evitar disparar toda vevz que o componente é renderizado
    const [loading, setLoading] = useState(false);

    const { paginaAtualRef } = usePaginaAtual();


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
            onAtualizar(paginaAtualRef.current);
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
                setPopup(prev => prev.slice(popup.length))
            }, 8000);
            return () => clearTimeout(timeout);
        }
    }, [popup]);

    return (
        <>
            <GrupoAlerta popup={popup} setPopup={setPopup} />
            <Model isOpen={isOpen} onClose={onClose}>
                <Formulario
                    handleSubmit={handleSubmit} dados={dados} obj={obj} clienteIdSelecionado={clienteIdSelecionado}
                    setClienteIdSelecionado={setClienteIdSelecionado} onClose={onClose} view={view} />
            </Model>
            {loading && <Loading />}
        </>
    );
}

function GrupoAlerta({ popup, setPopup }) {
    return (
        <div id="agrupamento">
            {popup.map((a, index) => (
                <Alerta
                    key={index}
                    isAbrir={a.exibir}
                    status={a.status}
                    txtError={a.mensagem}
                    isFechar={() => {
                        const novaLista = [...popup];
                        novaLista.splice(index, 1);
                        setPopup(novaLista);
                    }}
                />
            ))}
        </div>
    );
}

function Formulario({ handleSubmit, dados, obj, clienteIdSelecionado, setClienteIdSelecionado, onClose, view }) {
    return (
        <form action="POST" className={styles.formulario} onSubmit={handleSubmit}>
            <input type="number" name="clienteid" value={dados?.cliente?.id ?? obj?.id ?? clienteIdSelecionado} readOnly className={styles.ocultar} />
            <input type="number" name="dividaid" value={dados?.id ?? 0} readOnly className={styles.ocultar} />

            <ClienteInfo dados={dados} obj={obj} setClienteIdSelecionado={setClienteIdSelecionado} />

            <div className={styles.row}>
                <div className={styles.col}>
                    <label>Valor <strong id="obrigatorio" title="Campo obrigatório">*</strong></label>
                    <input name="valor" className={styles.spinner} type="number" step="0.01" placeholder="0.00" defaultValue={dados?.valor ?? ""} required disabled={view} />
                </div>

                <div className={styles.col}>
                    <label title="Se preenchido, a divida é incluida como paga">Data de pagamento </label>
                    <input name="pagamento" type="datetime-local" defaultValue={formataImput(dados?.dataPagamento)} disabled={view}  />
                </div>
            </div>

            <label>Descrição <strong id="obrigatorio" title="Campo obrigatório">*</strong></label>
            <input name="observacao" type="text" placeholder="Descreva aqui..." defaultValue={dados?.descricao ?? ""} required disabled={view} />

            <BotoesForm onClose={onClose} />
        </form>
    );
}

function ClienteInfo({ dados, obj, setClienteIdSelecionado }) {
    if (dados?.cliente?.nome || obj?.nome) {
        return (
            <div className={styles.dadosNomeCliente}>
                <label>Nome do cliente</label>
                <input className={styles.inputficticio} type="text" name="fictio" value={dados?.cliente?.nome ?? obj?.nome ?? ""}  disabled />
            </div>
        );
    }

    return <InputSelect setClienteIdSelecionado={setClienteIdSelecionado} />;
}

function BotoesForm({ onClose }) {
    return (
        <div className={styles.buttoes}>
            <button className={styles.cancelar} onClick={onClose} type="button">Cancelar</button>
            <button className={styles.cadastrar} type="submit">Cadastrar</button>
        </div>
    );
}