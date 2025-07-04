import { useState, useEffect, useRef, useMemo } from "react";
import { preencheSelectList } from "../../services/clienteService";
import { FaSearch } from "react-icons/fa";
import styles from './inputselect.module.css';

export default function InputSelect({ setClienteIdSelecionado }) {
    const [ativarDrop, SetativarDrop] = useState(false);
    const [listaCompleta, setListaCompleta] = useState([]);
    const [filtro, setFiltro] = useState("");

    const observerClick = useRef(null);

    useEffect(() => {
        const carregarLista = async () => {
            try {
                const dados = await preencheSelectList();
                setListaCompleta(dados.data);
            } catch (err) {
                console.error("Erro ao carregar lista:", err);
            }
        };

        carregarLista();
    }, []);

    useEffect(() => {
        const qndClickFora = (event) => {
            if (observerClick.current && !observerClick.current.contains(event.target)) {
                SetativarDrop(false);
            }
        };

        document.addEventListener("mousedown", qndClickFora);
        return () => {
            document.removeEventListener("mousedown", qndClickFora);
        };
    }, []);

    const filtrados = useMemo(() => {
        return listaCompleta.filter((item) =>
            item.nome.toLowerCase().includes(filtro.toLowerCase())
        );
    }, [filtro, listaCompleta]);

    const selecionar = (item) => {
        setFiltro(item.nome);
        setClienteIdSelecionado(item.id);
        SetativarDrop(false);
    };

    return (
        <div className={styles.todo} ref={observerClick}>
            <label>Seleciona o Cliente</label>
            <input type="text" autoCorrect="off" spellCheck="false" placeholder="Cliente" value={filtro} onClick={() => SetativarDrop(true)} readOnly />
            <div className={`${styles.listagem} ${ativarDrop ? styles.active : ""}`}>
                <div className={`${styles.filter} ${ativarDrop ? styles.active : ""}`}>
                    <FaSearch className={styles.icon} />
                    <input type="text" className={styles.inputss} value={filtro} onChange={(e) => setFiltro(e.target.value)} />
                </div>
                {filtrados.length > 0 && (
                    <ul>
                        {filtrados.map((item) => (
                            <li key={item.id} onClick={() => selecionar(item)}>
                                {item.nome}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
