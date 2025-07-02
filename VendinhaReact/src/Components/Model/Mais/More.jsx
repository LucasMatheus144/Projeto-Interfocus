import { useEffect, useRef, useState } from "react";
import { listarPorId } from '../../../services/clienteService';
import styles from './more.module.css';
import FormCliente from '../../FormCliente/FormCliente'
import TemCerteza from "../Confirmation/TemCerteza";

export default function Mais({ isOpen, onClose, attform, cliente }) {
    const [active, activeButton] = useState(false);
    const [editarModel, editarAciveModule] = useState(false);
    const [excluir, excluirSet] = useState(false);
    const [get, setApi] = useState();
    const ref = useRef(null);

   useEffect(() => {
    if (editarModel || active) {
        (async () => {
            try {
               const result =  await listarPorId(cliente.id);
               setApi(result.data)
            } catch (err) {
                console.error("Erro ao buscar dados:", err);
            }
        })();
    }
}, [editarModel, active]);

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
        };
    }, [isOpen]);

    if (!isOpen) return null;
    return (
        <div ref={ref} className={styles.addmais}>
            <ul>
                <li>
                    <button onClick={() => activeButton(true)}>Visualizar</button>
                    <FormCliente isOpen={active} onClose={() => activeButton(false)} onAttHomePage={attform} visualizar={true} obj={get} />
                </li>
                <li>
                    <button onClick={() => editarAciveModule(true)}>Editar</button>
                    <FormCliente isOpen={editarModel} onClose={() => editarAciveModule(false)} onAttHomePage={attform} visualizar={false} obj={get} />
                </li>
                <li>
                    <button onClick={() => excluirSet(true)}>Excluir</button>
                    <TemCerteza isAbrir={excluir} onClose={() => excluirSet(false)} id={cliente.id} attForm={attform}/>
                </li>

            </ul>
        </div>
    );
}
