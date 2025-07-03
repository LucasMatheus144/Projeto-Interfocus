import { useState, useEffect } from "react";
import { preencheSelectList } from "../../services/clienteService";

import styles from './inputselect.module.css';

export default function InputSelect({ setClienteIdSelecionado  }) {
    const [listaCompleta, setListaCompleta] = useState([]); // lista original da API
    const [filtro, setFiltro] = useState(""); // termo digitado
    const [filtrados, setFiltrados] = useState([]); // lista exibida
    const [idSelecionado, setIdSelecionado] = useState(null);

    useEffect(() => {
        const carregarLista = async () => {
            try {
                const dados = await preencheSelectList(); // busca sem filtro
                setListaCompleta(dados.data);
                setFiltrados(dados.data);
            } catch (err) {
                console.error("Erro ao carregar lista:", err);
            }
        };

        carregarLista();
    }, []);

    useEffect(() => {
        if (filtro.trim().length === 0) {
            setFiltrados(listaCompleta);
            return;
        }

        const resultado = listaCompleta.filter((item) =>
            item.nome.toLowerCase().includes(filtro.toLowerCase())
        );

        setFiltrados(resultado);
    }, [filtro, listaCompleta]);

     const selecionar = (item) => {
        setFiltro(item.nome);
        setIdSelecionado(item.id); 
        setClienteIdSelecionado(item.id);
        setFiltrados([]);
    };

    return (
        <div className={styles.todo}>
            <label>Seleciona o Cliente</label>
            <input type="text" value={filtro} onChange={(e) => { setFiltro(e.target.value); setIdSelecionado(null); }} />

            {filtrados.length > 0 && filtro.length > 0 && (
                <ul>
                    {filtrados.map((item) => (
                        <li key={item.id} onClick={() => selecionar(item)}>{item.nome}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}
