import css from './alerta.module.css';
import { FaCheckCircle } from "react-icons/fa";
import { TbXboxXFilled } from "react-icons/tb";
import { IoClose } from "react-icons/io5";


/**
 * Componente de alerta customizado.
 * @param {boolean} props.isAbrir - Define se o alerta está visível.
 * @param {boolean} props.status - Indica se o alerta é de sucesso (true) ou erro (false).
 * @param {string} props.txtError - Se for de erro, mensagem exibida no alerta.
 * @param {Function} props.isFechar - Função chamada ao fechar o alerta.
 */
export default function Alerta({ isAbrir, status, txtError, isFechar }) {
    if (!isAbrir) return null;

    return (
            <div className={`${css.alerta} ${css.active} ${status ? css.sucess : css.erro}`}>
                <div className={css.contentAlerta}>
                    {status ? (
                        <FaCheckCircle className={css.iconsucess} />
                    ) : (
                        <TbXboxXFilled className={css.iconerror} />
                    )}

                    <div className={css.mensagem}>
                        <span className={`${css.texto} ${css.tx1}`}>
                            {status ? "Sucesso" : "Erro"}
                        </span>
                        <span className={css.texto}>
                            {status ? "Operação realizada com sucesso!" : txtError}
                        </span>
                    </div>
                </div>

                <IoClose className={css.close} onClick={isFechar} />

                <div className={`${css.progress} ${status ? css.sucess : css.erro}`}></div>
            </div>
    );

}