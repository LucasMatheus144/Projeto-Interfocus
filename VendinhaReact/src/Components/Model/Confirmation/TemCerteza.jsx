import styles from './temcerteza.module.css';
import { excluirCliente } from '../../../services/clienteService'

export default function TemCerteza({ isAbrir, onClose,id, attForm}) {
    if (!isAbrir) return false;

    const gerarExclusao = async() => {
        const status = await excluirCliente(id);
        if(status == 200){
            onClose();
            attForm();
        } 
    }
    return (
        <div className={styles.componente}>
            <div className={styles.dialogo}>
                <div className={styles.content}>
                    <div className={styles.header}>
                        <h5 className={styles.titulo}>Exclusão</h5>
                    </div>
                    <div className={styles.descricao}>
                        Confirma a exclusão do cadastro? <br />
                        <strong>Todas as dividas atreladas serão apagadas.</strong>
                    </div>
                    <div className={styles.finale}>
                        <button classNama={styles.nao} type="button" onClick={onClose} >Não</button>
                        <button classNama={styles.sim} type="submit" onClick={gerarExclusao}>Sim</button>
                    </div>
                </div>
            </div>
        </div>

    );

}