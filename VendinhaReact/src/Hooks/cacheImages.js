import { useEffect, useState, useCallback } from "react";

const NOME_CACHE = 'clientes-imagens';

export function useImagemCliente(idCliente, urlBanco, imagemPadrao) {
    const [fotoUrl, setFotoUrl] = useState(imagemPadrao);

    // Carrega imagem do cache, banco ou default
    const carregarImagem = useCallback(async () => {
        if (!idCliente) return setFotoUrl(imagemPadrao);

        const cache = await caches.open(NOME_CACHE);
        const response = await cache.match(`/clientes/foto/${idCliente}`);

        if (response) {
            const blob = await response.blob();
            setFotoUrl(URL.createObjectURL(blob));
        } else if (urlBanco) {
            setFotoUrl(urlBanco);
        } else {
            setFotoUrl(imagemPadrao);
        }
    }, [idCliente, urlBanco, imagemPadrao]);

    // Salva imagem no cache após upload
    const salvarImagemNoCache = async (idCliente, file) => {
        const cache = await caches.open('clientes-imagens');
        const response = new Response(file, {
            headers: { 'Content-Type': file.type }
        });

        await cache.put(`/clientes/foto/${idCliente}`, response);
    };

    // Limpa imagem do cache
    const limparImagemDoCache = useCallback(async () => {
        const cache = await caches.open(NOME_CACHE);
        await cache.delete(`/clientes/foto/${idCliente}`);
    }, [idCliente]);

    useEffect(() => {
        carregarImagem();
    }, [carregarImagem]);

    return { fotoUrl, salvarImagemNoCache, limparImagemDoCache };
}
