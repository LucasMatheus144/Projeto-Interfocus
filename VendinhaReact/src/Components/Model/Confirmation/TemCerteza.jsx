import styles from './temcerteza.module.css';
import { excluirCliente } from '../../../services/clienteService';
import { deletarDivida } from '../../../services/dividaService';


export default function TemCerteza({ isAbrir, onClose, id, attForm, obj }) {
    if (!isAbrir) return false;

    const gerarExclusao = async () => {
        console.log(id);
        const status = await (obj === true ? deletarDivida(id) : excluirCliente(id) );

        if (status == 200) {
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
                        <button className={styles.nao} type="button" onClick={onClose} >Não</button>
                        <button className={styles.sim} type="submit" onClick={gerarExclusao}>Sim</button>
                    </div>
                </div>
            </div>
        </div>

    );

}