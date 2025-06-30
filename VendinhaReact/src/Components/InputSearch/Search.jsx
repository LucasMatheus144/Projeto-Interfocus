import { useState } from "react";
import styles from './search.module.css'
import { FaSearch } from "react-icons/fa";

export default function Search( {observavdorPesquisa} ){
    const [search, setSearch] = useState("");

    const observerChange = (e) =>{
        const valor = e.target.value;
        setSearch(valor);
        observavdorPesquisa(valor);
    }

    return (
        <>
            <div className={styles.where}>
                <FaSearch  className={styles.icon}/>
                <input className={styles.inputss} type="text" value={search} onChange={observerChange} placeholder="Where cliente = ?" />
            </div>
        </>
    )
}