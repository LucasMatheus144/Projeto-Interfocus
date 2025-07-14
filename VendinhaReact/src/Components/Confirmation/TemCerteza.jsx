import { excluirCliente } from '../../services/clienteService';
import { deletarDivida } from '../../services/dividaService';
import styles from './temcerteza.module.css';

/**
* @param {boolean} props.isAbrir - Define se o modal está visível.
 * @param {Function} props.onClose - Função chamada ao fechar o modal.
 * @param {number|string} props.id - ID do item para deletar.
 * @param {Function} props.attForm - Atualizar pagina após a ação.
 * @param {Bolean} props.obj - Aqui é pra decidir se vai excluir o cliente ou a divida
 */
export default function TemCerteza({ isAbrir, onClose, id, attForm, obj }) {
    if (!isAbrir) return null;
    var valida = obj === false;

    const gerarExclusao = async () => {
        const status = await (valida ? excluirCliente(id) : deletarDivida(id));

        if (status.status === 200) {
            onClose();
            attForm(0);
        } else {
            onClose();
            attForm(0);
        }
    }
    return (
        < div className={styles.componente} >
            <div className={styles.dialogo}>
                <div className={styles.content}>
                    <div className={styles.header}>
                        <h5 className={styles.titulo}>Exclusão</h5>
                    </div>
                    <div className={styles.descricao}> Confirma a exclusão do cadastro?
                        {valida &&
                            <>
                                <br />
                                <strong>Todas as dividas atreladas serão apagadas.</strong>
                            </>
                        }
                    </div>
                    <div className={styles.finale}>
                        <button className={styles.nao} type="button" onClick={onClose} >Não</button>
                        <button className={styles.sim} type="button" onClick={gerarExclusao}>Sim</button>
                    </div>
                </div>
            </div>
        </div >

    );

}