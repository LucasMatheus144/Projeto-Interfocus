import { useState, useReducer, useMemo, useEffect } from "react";
import { salvarCliente } from '../../services/clienteService';

import styles from './form.module.css';
import Model from '../Model/Modal';
import Alerta from '../Model/Alertas/Alerta';
import user from '../../assets/user.png';

export default function FormCliente({ isOpen, onClose, onAttHomePage, visualizar, obj }) {
    const [alertas, setAlertas] = useState([]);

    const mascaraCpf = (valor) => {
        if (!valor) return "";
        const somenteNumeros = valor.replace(/\D/g, '').slice(0, 11);
        return somenteNumeros
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    };

    const [cpf, setCpf] = useReducer((_, novoValor) => mascaraCpf(novoValor), mascaraCpf(obj?.cpf ?? ""));

    const verificaView = useMemo(() => visualizar, [visualizar]);

    const criarCliente = (oData) => ({
        id: oData.get("id") || 0,
        nome: oData.get("nome"),
        cpf: oData.get("cpf"),
        email: oData.get("email") || null,
        dataNascimento: oData.get("data-nascimento"),
        situacao: 1
    });

    const enviarForm = async (event) => {
        event.preventDefault();
        const form = event.target;
        const oData = new FormData(form);
        const cliente = criarCliente(oData);

        const resultado = await salvarCliente(cliente);
        if (resultado.status === 200) {
            setCpf(null); // isso é para remover o CPF digitado do form ao dar o POST
            onClose();
            onAttHomePage();
            setAlertas([{ exibir: true, status: true, mensagem: "Operação realizada com sucesso!" }]);
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
                <form method='POST' onSubmit={enviarForm} className={styles.cadastraCliente}>
                    <input type="number" name="id" defaultValue={obj?.id ?? ""} className={styles.ocultar} />

                    <div className={styles.row}>
                        {verificaView ? (
                            <>
                                <div className={styles.imagem}>
                                    <img src={user} alt="imagem" loading="lazy" />
                                </div>
                                <div className={styles.grupo}>
                                    <label htmlFor="nome">Nome do Cliente</label>
                                    <input type="text" name="nome" required maxLength={25} defaultValue={obj?.nome ?? ""} disabled={verificaView} />
                                </div>
                            </>
                        ) : (
                            <>
                                <label htmlFor="file" className={styles.upload}>
                                    <div className={styles.icon}></div>
                                    <div className="text">
                                        <span>Salvar Arquivo</span>
                                    </div>
                                    <input id="file" type="file" accept="image/jpeg, image/png" disabled={verificaView} />
                                </label>
                                <div className={styles.grupo}>
                                    <label htmlFor="nome">Nome do Cliente</label>
                                    <input type="text" name="nome" required maxLength={25} defaultValue={obj?.nome ?? ""} disabled={verificaView} />
                                </div>
                            </>
                        )}
                    </div>
                    <div className={styles.row}>
                        <div className={styles.col}>
                            <label htmlFor="cpf">CPF</label>
                            <input type="text" name="cpf" placeholder="000.000.000-00" maxLength={14} required value={cpf} onChange={(e) => setCpf(e.target.value)} disabled={verificaView} />
                        </div>
                        <div className={styles.col}>
                            <label htmlFor="data-nascimento">Data de Nascimento</label>
                            <input type="date" name="data-nascimento" required defaultValue={obj?.dataNascimento?.split('T')[0] ?? ""} disabled={verificaView}
                            />
                        </div>
                    </div>
                    <div className={styles.grupo}>
                        <label htmlFor="email">E-mail</label>
                        <input type="email" name="email" maxLength={50} defaultValue={obj?.email ?? ""} disabled={verificaView} />
                    </div>
                    <div className={styles.buttoes}>
                        <button className={styles.cancelar} type="button" onClick={onClose}>Cancelar</button>
                        {!verificaView && (<button className={styles.cadastrar} type="submit">Cadastrar</button>)}
                    </div>
                </form>
            </Model>
        </>
    );
}
