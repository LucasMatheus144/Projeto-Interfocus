const carregarImagem = useCallback(async () => {
    if (!idCliente) return setFotoUrl(imagemPadrao);

    //verifica se existe
    if (typeof caches !== 'undefined') {
        try {
            const cache = await caches.open(NOME_CACHE);
            const response = await cache.match(`/clientes/foto/${idCliente}`);
    
            if (response) {
                const blob = await response.blob();
                return setFotoUrl(URL.createObjectURL(blob));
            }
        } catch (err) {
            console.warn("Erro ao acessar o cache:", err);
        }
    }

    if (urlBanco) {
        setFotoUrl(urlBanco);
    } else {
        setFotoUrl(imagemPadrao);
    }
}, [idCliente, urlBanco, imagemPadrao]);

const salvarImagemNoCache = async (idCliente, file) => {
    if (typeof caches === 'undefined') return;

    try {
        const cache = await caches.open(NOME_CACHE);
        const response = new Response(file, {
            headers: { 'Content-Type': file.type }
        });

        await cache.put(`/clientes/foto/${idCliente}`, response);
    } catch (err) {
        console.warn("Erro ao salvar no cache:", err);
    }
};

const limparImagemDoCache = useCallback(async () => {
    if (typeof caches === 'undefined') return;

    try {
        const cache = await caches.open(NOME_CACHE);
        await cache.delete(`/clientes/foto/${idCliente}`);
    } catch (err) {
        console.warn("Erro ao limpar cache:", err);
    }
}, [idCliente]);
