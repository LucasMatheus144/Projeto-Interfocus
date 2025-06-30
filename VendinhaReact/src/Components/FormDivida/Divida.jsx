import Model from '../Model/Modal';
import styles from './divida.module.css';

export default function Divida({ isOpen, onClose, obj }) {
    if (!isOpen) return null;

    return (
        <>
            <Model isOpen={isOpen} onClose={onClose}>
                <form action="POST" className={styles.formulario}>
                    <input type="number" name="id" defaultValue={obj?.id ?? ""} className={styles.ocultar} />
                </form>
            </Model>

        </>
    )
}