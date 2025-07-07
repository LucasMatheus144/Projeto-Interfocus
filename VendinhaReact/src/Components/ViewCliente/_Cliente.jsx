import styles from './view.module.css';
import user from '../../assets/user.png';

import { dataAniversario } from '../../services/validarService';

export default function ViewCliente({ obj }) {

    return (
        <div className={styles.view}>

            <div className={styles.gpimagem}>
                <div className={styles.imagem}>
                    <img src={obj?.urlFoto ?? user} alt="imagem" loading="lazy" />
                    <div className={styles.infoprincipal}>
                        <div className={styles.nome}>
                            <h3>{obj?.nome}</h3>
                        </div>
                        <div className={styles.identificador}>
                            <h3>ID : {obj?.id}</h3>
                            {obj?.situacao === 1 ? (
                                <span className={styles.adimplente}>Adimplente</span>
                            ) : (
                                <span className={styles.inadimplente}>Inadimplente</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className={styles.dadosusuario}>
                    <h4>DADOS DO CLIENTE</h4>
                    <div className={styles.infodadosuser}>
                        <div>
                            <div className={styles.resposta}>
                                <label>CPF</label>
                                <span>{obj?.cpf}</span>
                            </div>
                        </div>
                        <div >
                            <div className={styles.resposta}>
                                <label>EMAIL</label>
                                <span>{obj?.email}</span>
                            </div>
                        </div>
                        <div>
                            <div className={styles.resposta}>
                                <label>Nascimento</label>
                                <span>{dataAniversario(obj?.dataNascimento)}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}