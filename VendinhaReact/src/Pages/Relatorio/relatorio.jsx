import { useEffect, useState } from 'react';
import { gerarPersonalizado } from '../../services/dividaService';
import { formatarValor } from '../../services/validarService';
import styles from './relatorio.module.css';


function Info({ titulo, valor }) {
    return (
        <div className={styles.sessao}>
            <div className={styles.gptexto}>
                <h3>{titulo}</h3>
            </div>
            <div className={styles.result}>
                <h3>R$</h3>
                <span>{valor}</span>
            </div>
        </div>
    );
}

export default function Relatorio() {
    const [dados, setDados] = useState([]);

    const chamaListagem = async () => {
        try {
            const result = await gerarPersonalizado();
            if (result.status === 200) {
                setDados(result.data); 
            }
        } catch (error) {
            console.error('Erro ao chamar API:', error);
        }
    };

    useEffect(() => {
        chamaListagem();
    }, []);

    return (
        <div className={styles.container}>
            <h3>Relatorio de Valores</h3>
            <div className={styles.grupo}>
                <Info titulo="A Receber" valor={formatarValor(dados.aReceber)} />
                <Info titulo="Recebido" valor={formatarValor(dados.recebido)} />
            </div>
        </div>
    );
}
