import { createContext, useContext, useRef } from "react";

const PageContext = createContext();

// Foi feito isso conseguir guardar o numero da Pagina sempre quando for atualizar o formulario, assim quando editar  ou salvar qualquer registro em qualquer pagina, 
// ele atualiza a pagina de acordo com o PageNumber atual, assim não buga o Alerta e nem o Paginação e evitando passar multiplos props desnecessarios.

// Vi essa metodologia na alura | Rocketseat
export const PageProvider = ({ children }) => {
    const paginaAtualRef = useRef(0); 

    return (
        <PageContext.Provider value={{ paginaAtualRef }}>
            {children}
        </PageContext.Provider>
    );
};

function usePageAtual() {
    const context = useContext(PageContext);
    if (!context) {
        return null
    }
    return context;
}

export const usePaginaAtual = usePageAtual;