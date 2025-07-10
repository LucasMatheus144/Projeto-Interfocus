import { Link, Outlet } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import styles from './compartilhado.module.css';


// esse svg vai repetir em toda LI
function SetaSvg() {
    return (
        <svg className={styles.seta} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="Arrow">
            <path d="m5.654 1044.83 4.97 4.688.656-.62-4.313-4.069 4.313-4.07-.655-.618-4.971 4.688z" overflow="visible" transform="translate(-1.03 -1106.225)scale(1.06642)" fill="#a4a6ac"></path>
        </svg>
    )
}

// preencher a extensão 
function CadastroMenu() {
    const [itemExpandido, setItemExpandido] = useState(null);

    const toggleItem = (ident) => {
        setItemExpandido(prev => (prev === ident ? null : ident));
    };

    return (
        <div className={styles.menuextends}>
            <h3 className={styles.titulo}>CADASTRO</h3>
            <ul className={styles.listagem}>
                <li className={styles.item}>
                    <div className={`${styles.itemHeader} ${itemExpandido === 'cliente' ? styles.exibeai : ''}`} onClick={() => toggleItem('cliente')}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="User">
                            <path d="M0 .996v13h3.58v-.547h.002a4.393 4.393 0 0 1 4.38-4.453h.003c.013 0 .024.004.037.004 2.42.001 4.395 2 4.416 4.457h.002v.54H16v-13H0zm1 1h14v11h-1.61a5.515 5.515 0 0 0-3.535-4.66A2.984 2.984 0 0 0 11 6c0-1.65-1.35-3-3-3S5 4.35 5 6c0 .946.452 1.781 1.14 2.332a5.407 5.407 0 0 0-3.538 4.664H1v-11zM8 4c1.11 0 2 .89 2 2a1.991 1.991 0 0 1-1.975 1.998c-.023 0-.046-.004-.07-.004v.002A1.99 1.99 0 0 1 6 6c0-1.11.89-2 2-2z" fill="#a4a6ac" ></path>
                        </svg>
                        <span>Cliente</span>
                        <SetaSvg />
                    </div>
                    <div className={`${styles.lsta} ${itemExpandido === 'cliente' ? styles.active : ''}`}>
                        <Link to="/"><span>Home Page</span></Link>
                    </div>
                </li>
                <li className={styles.item}>
                    <div className={`${styles.itemHeader} ${itemExpandido === 'divida' ? styles.exibeai : ''}`} onClick={() => toggleItem('divida')}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" id="Mastercard">
                            <path d="M14,105H114a14.01588,14.01588,0,0,0,14-14V33a14.01584,14.01584,0,0,0-14-14H14A14.01584,14.01584,0,0,0,0,33V91A14.01588,14.01588,0,0,0,14,105ZM4,64.17975l5.96979-3.29907a9.94481,9.94481,0,0,1-1.66943-3.64752L4,59.60968V33A10,10,0,0,1,14,23H70.24609L47.36792,35.64319A9.93261,9.93261,0,0,1,47.96,39v.88611L78.51581,23H114a10,10,0,0,1,10,10V91a10,10,0,0,1-10,10H14A10,10,0,0,1,4,91Z" fill="#a4a6ac" ></path>
                            <path d="M18.04 61H37.96a6.0068 6.0068 0 0 0 6-6V39a6.0068 6.0068 0 0 0-6-6H18.04a6.0068 6.0068 0 0 0-6 6V55A6.0068 6.0068 0 0 0 18.04 61zm21.92-6a2 2 0 0 1-2 2H34.70007l.05969-6H39.96zM34.68018 37H37.96a2 2 0 0 1 2 2v2H34.68018zm-8.32031 0h4.32031v4a4.045 4.045 0 0 0 4.07959 4H39.96v2H34.75977a4.045 4.045 0 0 0-4.07959 4v6H26.35986zM16.04 39a2 2 0 0 1 2-2h4.31989v4H16.04zm0 6h6.31989v4H16.04zm0 8h6.31989v4H18.04a2 2 0 0 1-2-2zM95 97a11.91843 11.91843 0 0 0 6.5-1.92773 12 12 0 1 0 0-20.14453A11.99476 11.99476 0 1 0 95 97zm9.56476-19.21655a8 8 0 1 1 0 14.43311 11.91032 11.91032 0 0 0 0-14.43311zM101.5 80.34827a7.96287 7.96287 0 0 1 0 9.30347 7.96287 7.96287 0 0 1 0-9.30347zM95 77a7.954 7.954 0 0 1 3.43524.78345 11.91032 11.91032 0 0 0 0 14.43311A7.99677 7.99677 0 1 1 95 77zM24 65a2 2 0 0 0 0 4H38a2 2 0 0 0 0-4zM46 69H60a2 2 0 0 0 0-4H46a2 2 0 0 0 0 4zM68 69H82a2 2 0 0 0 0-4H68a2 2 0 0 0 0 4zM90 69h14a2 2 0 0 0 0-4H90a2 2 0 0 0 0 4zM10 83H54a2 2 0 0 0 0-4H10a2 2 0 0 0 0 4zM10 91H34a2 2 0 0 0 0-4H10a2 2 0 0 0 0 4zM89.57178 42.58185l4.58112 3.49969L92.37994 51.819a4 4 0 0 0 6.24994 4.35956L103 52.84009l4.37012 3.3385a4 4 0 0 0 6.24994-4.35956l-1.77295-5.73749 4.51788-3.45135a3.99943 3.99943 0 0 0-2.36-7.22693h-5.4577L106.82172 29.819a4 4 0 0 0-7.64337 0L97.4527 35.40326H92a4 4 0 0 0-2.42822 7.17859zm10.83148-3.17859L103 31l2.59674 8.40326H114l-6.7984 5.19348L109.7984 53 103 47.80646 96.2016 53l2.5968-8.40326L92 39.40326z" fill="#a4a6ac"></path>
                        </svg>

                        <span>Faturas</span>
                        <SetaSvg />
                    </div>
                    <div className={`${styles.lsta} ${itemExpandido === 'divida' ? styles.active : ''}`}>
                        <Link to="/dividas"><span>Divida page</span></Link>
                    </div>
                </li>
            </ul>
        </div>
    );
}


function RelatorioMenu() {
    const [itemExpandido, setItemExpandido] = useState(null);

    const toggleItem = (id) => {
        setItemExpandido(prev => (prev === id ? null : id));
    };

    return (
        <div className={styles.menuextends}>
            <h3 className={styles.titulo}>RELATORIO</h3>
            <ul className={styles.listagem}>
                <li className={styles.item}>
                    <div className={`${styles.itemHeader} ${itemExpandido === 'relatorio' ? styles.exibeai : ''}`} onClick={() => toggleItem('relatorio')}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" id="ReportFiles">
                            <path d="M40.12 15.71 29.29 4.88A3 3 0 0 0 27.17 4H10a3 3 0 0 0-3 3v5a1 1 0 0 0 2 0V7a1 1 0 0 1 1-1h17v9a3 3 0 0 0 3 3h9v23a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1V16a1 1 0 0 0-2 0v25a3 3 0 0 0 3 3h28a3 3 0 0 0 3-3V17.83a3 3 0 0 0-.88-2.12ZM29 15V7.41L37.59 16H30a1 1 0 0 1-1-1Zm-3 6h-4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V22a1 1 0 0 0-1-1Zm-1 14h-2V23h2Zm-7-8h-4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1Zm-1 8h-2v-6h2Zm12-10v11a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V25a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1Zm2 1h2v9h-2Z" fill="#a4a6ac"></path>
                        </svg>

                        <span>A Receber</span>
                        <SetaSvg />
                    </div>
                    <div className={`${styles.lsta} ${itemExpandido ? styles.active : ''}`}>
                        <Link to="/relatorios">
                            <span>Relatorio Page</span>
                        </Link>
                    </div>
                </li>
            </ul>
        </div>
    );
}
// fim preencher extensão


function Menu() {
    const [ativo, setAtivo] = useState(''); // isso é para evitar ativar todos as tags abrirem ao mesmo tempo quando receber o evento CLICK

    const menuRef = useRef(null);

    useEffect(() => {
        const observerClick = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setAtivo('');
            }
        };

        document.addEventListener('mousedown', observerClick);
        return () => {
            document.removeEventListener('mousedown', observerClick);
        };
    }, []);

    return (
        <>
            <nav ref={menuRef} className={styles.lateral}>
                <div className={styles.icone}>
                    <div>
                        <li>
                            <a className={`${styles['link-icon']} ${ativo === 'cadastro' ? styles.ativo : ''}`} onClick={() => setAtivo(ativo === 'cadastro' ? '' : 'cadastro')}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="Invoice">
                                    <path d="M9.5,10.5H12a1,1,0,0,0,0-2H11V8A1,1,0,0,0,9,8v.55a2.5,2.5,0,0,0,.5,4.95h1a.5.5,0,0,1,0,1H8a1,1,0,0,0,0,2H9V17a1,1,0,0,0,2,0v-.55a2.5,2.5,0,0,0-.5-4.95h-1a.5.5,0,0,1,0-1ZM21,12H18V3a1,1,0,0,0-.5-.87,1,1,0,0,0-1,0l-3,1.72-3-1.72a1,1,0,0,0-1,0l-3,1.72-3-1.72a1,1,0,0,0-1,0A1,1,0,0,0,2,3V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V13A1,1,0,0,0,21,12ZM5,20a1,1,0,0,1-1-1V4.73L6,5.87a1.08,1.08,0,0,0,1,0l3-1.72,3,1.72a1.08,1.08,0,0,0,1,0l2-1.14V19a3,3,0,0,0,.18,1Zm15-1a1,1,0,0,1-2,0V14h2Z" fill="#0078ff" ></path>
                                </svg>
                            </a>
                        </li>
                    </div>
                    <div>
                        <li>
                            <a className={`${styles['link-icon']} ${ativo === 'relatorio' ? styles.ativo : ''}`} onClick={() => setAtivo(ativo === 'relatorio' ? '' : 'relatorio')}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="BarGraph">
                                    <path d="M12,6a1,1,0,0,0-1,1V17a1,1,0,0,0,2,0V7A1,1,0,0,0,12,6ZM7,12a1,1,0,0,0-1,1v4a1,1,0,0,0,2,0V13A1,1,0,0,0,7,12Zm10-2a1,1,0,0,0-1,1v6a1,1,0,0,0,2,0V11A1,1,0,0,0,17,10Zm2-8H5A3,3,0,0,0,2,5V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V5A3,3,0,0,0,19,2Zm1,17a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V5A1,1,0,0,1,5,4H19a1,1,0,0,1,1,1Z" fill="#0078ff" ></path>
                                </svg>
                            </a>
                        </li>
                    </div>
                </div>

                <div className={styles.logo}>
                    <img src="https://bagimgs.s3.us-east-1.amazonaws.com/icon.png" alt="Foto icone" />
                </div>
            </nav>
            <div ref={menuRef} className={`${styles.extensao} ${ativo ? styles.ativo : ''}`}>
                {ativo === 'cadastro' && <CadastroMenu />}
                {ativo === 'relatorio' && <RelatorioMenu />}
            </div>
        </>
    );
}


export default function Layout() {
    return (
        <>
            <header>
                <Menu />
            </header>
            <main>
                <Outlet />
            </main>
        </>
    );
}
