import { useEffect, useState } from "react";
import styles from './form.module.css'
import Model from '../Model/Modal';
import { salvarCliente } from '../../services/clienteService';
import Alerta from '../Model/Alertas/Alerta';



export default function FormCliente({ isOpen, onClose, onAttHomePage, visualizar, obj }) {
    const [alertas, setAlertas] = useState([]);

    const verificaView = visualizar;

    const enviarForm = async (event) => {
        event.preventDefault();

        const form = event.target;
        const oData = new FormData(form);

        const cliente = {
            id: oData.get("id") || null,
            nome: oData.get("nome"),
            cpf: oData.get("cpf"),
            email: oData.get("email") || null,
            dataNascimento: oData.get("data-nascimento")
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
                        {/* {verificaView ? (
                            

                        ) : (
                            <>
                                
                            
                            </>
                        )} */}
                        <label htmlFor="file" className={styles.upload}>
                            <div className={styles.icon}>
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"></path> </g></svg>
                            </div>
                            <div className="text">
                                <span>Salvar Arquivo</span>
                            </div>
                            <input id="file" type="file" accept="image/jpeg, image/png" disabled={verificaView} />
                        </label>
                        <div className={styles.grupo}>
                            <label htmlFor="nome">Nome do Cliente</label>
                            <input type="text" name="nome" required maxLength={25} defaultValue={obj?.nome ?? ""} disabled={verificaView} />
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.col}>
                            <label htmlFor="cpf">CPF</label>
                            <input type="text" name="cpf" placeholder="000.000.000-00" maxLength={14} required defaultValue={obj?.cpf ?? ""} disabled={verificaView} />
                        </div>
                        <div className={styles.col}>
                            <label htmlFor="data-nascimento">Data de Nascimento</label>
                            <input type="date" name="data-nascimento" required defaultValue={obj?.datanascimento ?? ""} disabled={verificaView} />
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
            </Model>

        </>
    )

}