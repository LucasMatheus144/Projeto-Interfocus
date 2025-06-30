import { Link, Outlet } from 'react-router-dom';
import { LiaUserSolid } from "react-icons/lia";
import { CiCreditCard1 } from "react-icons/ci";
import styles from './compartilhado.module.css';
import logo from '../../assets/icon.png';

export function Menu() {
    return (
        <nav className={styles.lateral}>
            <div className={styles.logo}>
                <img src={logo} alt="Foto icone" />
            </div>
            <div className={styles.navegacao}>
                <ul>
                    <li> 
                        <LiaUserSolid /> 
                        <Link to="/">Cliente</Link>
                    </li>
                    <li> 
                        <CiCreditCard1 /> 
                        <Link to="/dividas">Dividas</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default function Layout() {
    return (
        <>
            <header className={styles.container}>
                <Menu />
            </header>
            <main>
                <Outlet />
            </main>
        </>
    );
}
