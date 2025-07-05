import { useState } from "react"
import { IoMdMore } from "react-icons/io";
import { useImagemCliente } from "../../Hooks/cacheImages";

import styles from './cards.module.css';
import user from '../../assets/user.png';
import Mais from '../Model/Mais/More';
import Divida from "../FormDivida/Divida";


export default function Cards({ cliente, onAtualizar, aberto, onAbrir }) {
    const [maisAberto, setMaisAberto] = useState(false);
    const { fotoUrl } = useImagemCliente(cliente.id, cliente.stringFoto, user);

    return (
        <div className={styles.wrapper}>
            <div className={styles.info}>
                <div className={styles.imagem}>
                    <img src={fotoUrl ?? cliente.stringFoto ?? user} alt="imagem" loading="lazy" />
                </div>
                <div className={styles.adicional}>
                    <h3 className={styles.principal}>{cliente.nome}</h3>
                    <h3 className={styles.secundario}>{cliente.cpf}</h3>
                </div>
                <IoMdMore className={styles.dore} onClick={() => setMaisAberto(true)} />
            </div>

            <div className={styles.restante}>
                <div className={styles.email}>
                    <h3 className={styles.txtprincipal}>Email: <strong className={styles.secundario}>{cliente.email}</strong></h3>
                </div>
                <div className={styles.valor}>
                    <h3 className={styles.txtprincipal}>Idade: <strong className={styles.secundario}>{cliente.idade} anos</strong></h3>
                    {cliente.situacao === 1 ? (
                        <span className={styles.adimplente}>Adimplente</span>
                    ) : (
                        <span className={styles.inadimplente}>Inadimplente</span>
                    )}
                </div>
                <div className={styles.status}>
                    <h3 className={styles.txtprincipal}>R$: {cliente.totalDivida}</h3>
                </div>
                <div className={styles.nova}>
                    <button onClick={onAbrir}>Adicionar Dívida</button>
                </div>
            </div>

            <Mais isOpen={maisAberto} onClose={() => setMaisAberto(false)} cliente={cliente} attform={onAtualizar} />

            {aberto && (
                <Divida isOpen={true} onClose={() => onAbrir()} onAtualizar={onAtualizar} obj={cliente} view={false} />
            )}
        </div>
    );
}
