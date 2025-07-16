import { useState, useCallback, useEffect } from "react"
import { IoMdMore } from "react-icons/io";
import { useImagemCliente } from "../../Hooks/cacheImages";
import { formatarValor } from "../../services/validarService";

import styles from './cards.module.css';
import Mais from '../Model/Mais/More';
import Divida from "../FormDivida/Divida";

const urlUser = 'https://bagimgs.s3.us-east-1.amazonaws.com/user.png';

/**
 * @param {Object} props.cliente - Objeto contendo os dados do cliente.
 * @param {Function} props.onAtualizar - Função que retorna para o componente principal se deve ser atualizado a Listagem ou não
 * @param {boolean} props.aberto - Indica se ja foi aberto o componente de dividas dentro do card (Cadastrar uma nova divida dentro do card)
 * @param {Function} props.onAbrir - Aqui faz abrir o o componente de Dividas no Card
 */

export default function Cards({ cliente, onAtualizar, aberto, onAbrir }) {
    const [maisAberto, setMaisAberto] = useState(false);
    const { fotoUrl } = useImagemCliente(cliente.id, cliente.stringFoto, urlUser);


    return (
        <div className={styles.wrapper}>
            <div className={styles.exibefoto}>
                <img src={fotoUrl ?? cliente.stringFoto ?? urlUser} alt="imagem" loading="lazy" width={100} height={100} />
            </div>
            <div className={styles.dados}>
                <h3 className={styles.principal}>{cliente.nome}</h3>
                <div className={styles.adicional}>
                    <h3 className={styles.secundario}>{cliente.cpf}</h3>
                    <h3 className={styles.txtprincipal}>{cliente.email}</h3>
                </div>
            </div>
            <div className={styles.extras}>
                <h3 className={styles.txtprincipal}>Idade: {cliente.idade} anos</h3>
                {cliente.situacao === 1 ? (
                    <span className={styles.adimplente}>Adimplente</span>
                ) : (
                    <span className={styles.inadimplente}>Inadimplente</span>
                )}
            </div>

            <div className={styles.infodivida}>
                <h3 className={styles.txtprincipal}>Devendo R$: {formatarValor(cliente.totalDivida)}</h3>
                <button onClick={onAbrir}>Adicionar Dívida</button>
            </div>

            <IoMdMore className={styles.dore} onClick={() => setMaisAberto(true)} />

            {maisAberto && (
                <Mais isOpen={true} onClose={() => setMaisAberto(false)} cliente={cliente} attform={onAtualizar} />
            )}

            {aberto && (
                <Divida isOpen={true} onClose={() => onAbrir()} onAtualizar={onAtualizar} obj={cliente} view={false} />
            )}
        </div>
    );
}
