import styles from './modal.module.css';
import { IoClose } from "react-icons/io5";

/**
 * @param {React.ReactNode} props.children - Conteúdo que será renderizado dentro do modal.
 * @param {boolean} props.isOpen - Define se o modal está visível.
 * @param {Function} props.onClose - Função chamada ao fechar o modal.
 */
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