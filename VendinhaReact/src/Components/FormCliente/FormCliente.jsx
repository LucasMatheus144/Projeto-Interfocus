import { useState, useReducer, useEffect } from "react";
import { salvarCliente, enviarImagem } from '../../services/clienteService';
import { useImagemCliente } from "../../Hooks/cacheImages";
import { usePaginaAtual } from "../../Contexts/PageContext";

import styles from './form.module.css';
import Model from '../Model/Modal';
import Alerta from '../Alertas/Alerta';

const urlUser = 'https://bagimgs.s3.us-east-1.amazonaws.com/user.png';

/**
 * @param {boolean} props.isOpen - Define se o modal do formulário está aberto.
 * @param {Function} props.onClose - Função chamada para fechar o formulário.
 * @param {Function} props.onAttHomePage - Função para atualizar a listagem na página principal.
 * @param {Object|null} props.obj - Objeto qé passado, se for null é um novo cadastro ?? editar cadastro.
 * @param {Function} props.onAlertaSucesso - Função para exibir alerta de sucesso em outro componente.
 */
export default function FormCliente({ isOpen, onClose, onAttHomePage, obj, onAlertaSucesso }) {

    const { fotoUrl, salvarImagemNoCache } = useImagemCliente(obj?.id, obj?.urlFoto, urlUser);
    const [imagemPreview, setImagemPreview] = useState(null); // exibir a imagem antes de salvar
    const [alertas, setAlertas] = useState([]);
    const { paginaAtualRef } = usePaginaAtual();

    const mascaraCpf = (valor) => {
        if (!valor) return "";
        const somenteNumeros = valor.replace(/\D/g, '').slice(0, 11);
        return somenteNumeros
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    };

    const [cpf, setCpf] = useReducer((_, novoValor) => mascaraCpf(novoValor), mascaraCpf(obj?.cpf ?? ""));

    const criarCliente = (oData) => ({
        id: oData.get("id") || 0,
        nome: oData.get("nome"),
        cpf: oData.get("cpf"),
        email: oData.get("email") || null,
        dataNascimento: oData.get("data-nascimento"),
        situacao: 1
    });


    const fluxoTela = () => {
        setCpf(null); // isso é para remover o CPF digitado do form ao dar o POST
        gatilhoClosePop();
        onAlertaSucesso?.(true);
        onAttHomePage(paginaAtualRef.current);
    };

    const enviarForm = async (event) => {
        event.preventDefault();
        const form = event.target;
        const oData = new FormData(form);
        const cliente = criarCliente(oData);
        const arquivo = oData.get("foto"); // separar o arquivo para enviar o POST serado do cliente
        if (!arquivo || arquivo.size === 0) {
            cliente.urlFoto = obj?.urlFoto ?? null; // salvar a url caso for editar
        }
        const resultado = await salvarCliente(cliente);
        if (resultado.status === 200) {
            const idCliente = resultado.data.id ?? obj?.id;

            if (arquivo && arquivo.size > 0) {
                const cache = salvarImagemNoCache(idCliente, arquivo);
                const envio = enviarImagem(idCliente, arquivo);
                Promise.all([cache, envio]); // Foi nescessario pq existe um delay pra salvar a imagem no Bucket, assim salvo no cache e exibo na tela
                // await enviarImagem(idCliente, arquivo);
                // await salvarImagemNoCache(idCliente, arquivo);
            }
            fluxoTela();

        } else {
            const mensagens = resultado?.data ?? resultado;
            const listaDeErros = Array.isArray(mensagens) && mensagens.length > 0
                ? mensagens.map(msg => ({ exibir: true, status: false, mensagem: msg.mensagem }))
                : [{ exibir: true, status: false, mensagem: "Erro desconhecido." }];
            setAlertas(listaDeErros);
        }
    };

    useEffect(() => {
        if (obj?.cpf) {
            setCpf(obj.cpf);
        }
    }, [obj?.cpf]);


    const qndAlterarImagem = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagemPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const gatilhoClosePop = () => {
        setImagemPreview(null);
        onClose();
    };

    useEffect(() => {
        if (alertas.length > 0) {
            const timeout = setTimeout(() => {
                setAlertas(prev => prev.slice(alertas.length));
            }, 8000);
            return () => clearTimeout(timeout);
        }
    }, [alertas]);

    return (
        <Model isOpen={isOpen} onClose={gatilhoClosePop} >
            <div id="agrupamento">
                {alertas.map((a, index) => (
                    <Alerta key={index} isAbrir={a.exibir} status={a.status} txtError={a.mensagem}
                        isFechar={() => {
                            const novaLista = [...alertas];
                            novaLista.splice(index, 1);
                            setAlertas(novaLista);
                        }}
                    />
                ))}
            </div>
            <form method='POST' encType="multipart/form-data" onSubmit={enviarForm} className={styles.cadastraCliente} >
                <input type="number" name="id" defaultValue={obj?.id ?? ""} className={styles.ocultar} />
                <div className={styles.row}>
                    {(!imagemPreview && !obj?.urlFoto) ? (
                        <div className={styles.upload} onClick={() => document.getElementById('file').click()}>
                            <div className={styles.icon}></div>
                            <div className="text"><span>Salvar Arquivo</span></div>
                        </div>
                    ) : (
                        <div className={styles.imagem} onClick={() => document.getElementById('file').click()}>
                            <img src={imagemPreview ?? obj?.urlFoto} alt="imagem" loading="lazy" />

                        </div>
                    )}
                    <input id="file" name="foto" type="file" accept="image/jpeg, image/png, image/jpg" onChange={qndAlterarImagem} style={{ display: 'none' }} />

                    <div className={styles.grupo}>
                        <label htmlFor="nome">Nome do Cliente <strong id="obrigatorio">*</strong></label>
                        <input type="text" name="nome" required maxLength={25} defaultValue={obj?.nome ?? ""} />
                    </div>

                </div>
                <div className={styles.row}>
                    <div className={styles.col}>
                        <label htmlFor="cpf">CPF <strong id="obrigatorio">*</strong></label>
                        <input type="text" name="cpf" placeholder="000.000.000-00" maxLength={14} required value={cpf} onChange={(e) => setCpf(e.target.value)} />
                    </div>
                    <div className={styles.col}>
                        <label htmlFor="data-nascimento">Data de Nascimento <strong id="obrigatorio">*</strong> </label>
                        <input type="date" name="data-nascimento" required defaultValue={obj?.dataNascimento?.split('T')[0] ?? ""}
                        />
                    </div>
                </div>
                <div className={styles.grupo}>
                    <label htmlFor="email">E-mail</label>
                    <input type="text" name="email" maxLength={50} defaultValue={obj?.email ?? ""} />
                </div>
                <div className={styles.buttoes}>
                    <button className={styles.cancelar} type="button" onClick={gatilhoClosePop}>Cancelar</button>
                    <button className={styles.cadastrar} type="submit">Cadastrar</button>
                </div>
            </form>
        </Model>
    );
}
