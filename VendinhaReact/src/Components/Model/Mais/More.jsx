import { useEffect, useRef, useState } from "react";
import { listarPorId } from '../../../services/clienteService';
import styles from './more.module.css';
import FormCliente from '../../FormCliente/FormCliente';
import TemCerteza from "../../Confirmation/TemCerteza";
import ViewCliente from "../../ViewCliente/_Cliente";
import Alerta from "../../Alertas/Alerta";

export default function Mais({ isOpen, onClose, attform, cliente }) {
    const [formAberto, setFormAberto] = useState(false);
    const [modoVisualizacao, setModoVisualizacao] = useState(true);
    const [excluir, setExcluir] = useState(false);
    const [clienteData, setClienteData] = useState();

    const [alerta, setAlerta] = useState({
        isAbrir: false,
        status: true, // true: sucesso | false: erro
        txtError: ""
    });

    const abrirSucesso = () => {
        setAlerta({
            isAbrir: true,
            status: true,
            txtError: "",
        });

        setTimeout(() => {
            setAlerta(prev => ({ ...prev, isAbrir: false }));
        }, 8000);
    };
    const ref = useRef(null);


    useEffect(() => {
        if (formAberto) {
            (async () => {
                try {
                    const result = await listarPorId(cliente.id);
                    setClienteData(result.data);
                } catch (err) {
                    console.error("Erro ao buscar dados:", err);
                }
            })();
        }
    }, [formAberto]);

    useEffect(() => {
        function clicarForaEvento(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                onClose();
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", clicarForaEvento);
        }
        return () => {
            document.removeEventListener("mousedown", clicarForaEvento);
            setFormAberto(null);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (

        <>
            <Alerta
                isAbrir={alerta.isAbrir}
                status={alerta.status}
                txtError={alerta.txtError}
                isFechar={() => setAlerta((prev) => ({ ...prev, isAbrir: false }))}
            />
            <div ref={ref} className={styles.addmais}>
                <ul>
                    <li>
                        <button onClick={() => { setModoVisualizacao(true); setFormAberto(true); }}>Visualizar</button>
                    </li>
                    <li>
                        <button onClick={() => { setModoVisualizacao(false); setFormAberto(true); }}>Editar</button>
                    </li>
                    <li>
                        <button onClick={() => setExcluir(true)}>Excluir</button>
                    </li>
                </ul>
                {formAberto && modoVisualizacao && (
                    <ViewCliente obj={clienteData} />
                )}

                {formAberto && !modoVisualizacao && (
                    <FormCliente isOpen={formAberto} onClose={() => setFormAberto(false)} onAttHomePage={attform} obj={clienteData} onAlertaSucesso={abrirSucesso} />
                )}
                <TemCerteza isAbrir={excluir} onClose={() => setExcluir(false)} id={cliente.id} attForm={attform} obj={false} />
            </div>
        </>
    );
}
