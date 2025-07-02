import { useEffect, useState } from "react";
import styles from './form.module.css'
import Model from '../Model/Modal';
import { salvarCliente } from '../../services/clienteService';
import Alerta from '../Model/Alertas/Alerta';
import user from '../../assets/user.png';


export default function FormCliente({ isOpen, onClose, onAttHomePage, visualizar, obj }) {
    const [alertas, setAlertas] = useState([]);

    const verificaView = visualizar;

    const enviarForm = async (event) => {
        event.preventDefault();

        const form = event.target;
        const oData = new FormData(form);

        const cliente = {
            id: oData.get("id") || 0,
            nome: oData.get("nome"),
            cpf: oData.get("cpf"),
            email: oData.get("email") || null,
            dataNascimento: oData.get("data-nascimento"),
            situacao: Number(1)
        }

        const resultado = await salvarCliente(cliente);
        if (resultado.status === 200) {
            onClose();
            onAttHomePage();
            setAlertas([{ exibir: true, status: true, mensagem: "Operação realizada com sucesso!" }]);
        } else {
            const mensagens = resultado?.data ?? resultado;

            const listaDeErros = Array.isArray(mensagens) && mensagens.length > 0
                ? mensagens.map(msg => ({
                    exibir: true,
                    status: false,
                    mensagem: msg.mensagem
                }))
                : [{
                    exibir: true,
                    status: false,
                    mensagem: "Erro desconhecido."
                }];

            setAlertas(listaDeErros);
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
                                    <input
                                        type="text"
                                        name="nome"
                                        required
                                        maxLength={25}
                                        defaultValue={obj?.nome ?? ""}
                                        disabled={verificaView}
                                    />
                                </div>
                            </>
                           
                            
                        ) : (
                            <>
                                <label htmlFor="file" className={styles.upload}>
                                    <div className={styles.icon}>
                                        {/* SVG aqui */}
                                    </div>
                                    <div className="text">
                                        <span>Salvar Arquivo</span>
                                    </div>
                                    <input id="file" type="file" accept="image/jpeg, image/png" disabled={verificaView} />
                                </label>
                                <div className={styles.grupo}>
                                    <label htmlFor="nome">Nome do Cliente</label>
                                    <input
                                        type="text"
                                        name="nome"
                                        required
                                        maxLength={25}
                                        defaultValue={obj?.nome ?? ""}
                                        disabled={verificaView}
                                    />
                                </div>
                            </>
                        )}

                    </div>
                    <div className={styles.row}>
                        <div className={styles.col}>
                            <label htmlFor="cpf">CPF</label>
                            <input type="text" name="cpf" placeholder="000.000.000-00" maxLength={14} required defaultValue={obj?.cpf ?? ""} disabled={verificaView} />
                        </div>
                        <div className={styles.col}>
                            <label htmlFor="data-nascimento">Data de Nascimento</label>
                            <input type="date" name="data-nascimento" required defaultValue={obj?.dataNascimento?.split('T')[0] ?? ""} disabled={verificaView} />
                        </div>
                    </div>
                    <div className={styles.grupo}>
                        <label htmlFor="email">E-mail</label>
                        <input type="email" name="email" maxLength={50} defaultValue={obj?.email ?? ""} disabled={verificaView} />
                    </div>
                    <div className={styles.buttoes}>
                        <button className={styles.cancelar} type="button" onClick={onClose}>Cancelar</button>
                        {!verificaView && (
                            <button className={styles.cadastrar} type="submit">Cadastrar</button>
                        )}
                    </div>
                </form>
            </Model >

        </>
    )

}