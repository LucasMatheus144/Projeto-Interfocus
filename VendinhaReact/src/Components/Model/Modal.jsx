import styles from './modal.module.css';

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
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="multiply" onClick={onClose}>
                        <path fill="#000000ff" d="M13.41,12l6.3-6.29a1,1,0,1,0-1.42-1.42L12,10.59,5.71,4.29A1,1,0,0,0,4.29,5.71L10.59,12l-6.3,6.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l6.29,6.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"></path>
                    </svg>
                </div>
                <div className={styles.add}>
                    {children}
                </div>
            </div>
        )
    }
    return null
}