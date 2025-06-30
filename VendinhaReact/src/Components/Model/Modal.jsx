import styles from './modal.module.css';
import { IoClose } from "react-icons/io5";


export default function Modal({ children, isOpen, onClose }) {

    if (isOpen) {
        return (
            <div className={`${styles.modal} ${!isOpen ? styles.ocultar : ""}`}>
                <div className={styles.topside}>
                    <IoClose  className={styles.close} onClick={onClose}/> 
                </div>
                <div className={styles.add}>
                    {children}
                </div>        
            </div>
        )
    }

    return null

}