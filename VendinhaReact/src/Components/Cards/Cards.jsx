import { useState, useEffect } from "react"
import { IoMdMore } from "react-icons/io";
import styles from './cards.module.css';
import user from '../../assets/user.png';
import Mais from '../Model/Mais/More';
import Divida from "../FormDivida/Divida";


export default function Cards({ cliente, onAtualizar }) {
    const [more, setMore] = useState(false);
    const [newdivida, setDivida] = useState(false);

    return (

        <div className={styles.wrapper}>
            <div className={styles.info}>
                <div className={styles.imagem}>
                    <img src={user} alt="imagem" loading="lazy" />
                </div>
                <div className={styles.adicional}>
                    <h3 className={styles.principal}>{cliente.nome}</h3>
                    <h3 className={styles.secundario}>{cliente.cpf}</h3>
                </div>
                <IoMdMore className={styles.dore} onClick={() => setMore(true)} />
                <Mais isOpen={more} onClose={() => setMore(false)} cliente={cliente} attform={onAtualizar}></Mais>
            </div>
            <div className={styles.restante}>
                <div className={styles.email}>
                    <h3 className={styles.txtprincipal}>Email: <strong className={styles.secundario}>{cliente.email}</strong></h3>
                </div>
                <div className={styles.valor}>
                    <h3 className={styles.txtprincipal}>Idade: <strong className={styles.secundario}>{cliente.idade} anos</strong> </h3>
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
                    <button onClick={() => setDivida(true)}>Adicionar Divida</button>
                    <Divida isOpen={newdivida} onClose={() => setDivida(false)} onAtualizar={onAtualizar} obj={cliente} view={false} />
                </div>


            </div>

        </div>
    );
}