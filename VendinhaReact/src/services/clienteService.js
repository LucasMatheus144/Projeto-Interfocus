import { URL_API } from "./validarService";


export async function salvarCliente(cliente) {
    const response = await fetch(`${URL_API}/api/cliente`, {
        method: cliente.id ? "PUT" : "POST",
        body: JSON.stringify(cliente),
        headers: {
            "Content-type": "application/json"
        }
    });

    var result = await response.json();
    return {
        status: response.status,
        data: result
    }
}

export async function listarClientes(pesquisa, limit, offset) {
    const response = await fetch(`${URL_API}/api/cliente?search=${pesquisa || ""}&limit=${limit}&offset=${offset}`, {
        method: "GET"
    });

    if (response.status == 200) {
        const data = await response.json();
        return {
                status: response.status,
                __count: data.totalClientes,
                data: data.result
            }
    }
     return {
            status: response.status,
            __count: 0,
            data: null
    }
}

export async function excluirCliente(id) {
    const response = await fetch(`${URL_API}/api/cliente/${id}`, {
        method: "DELETE",
    })
    return {
        status: response.status,
        data: { exibir: true, status: false, mensagem: "Gerou um erro!" }
    };
}

export async function listarPorId(id) {
    const response = await fetch(`${URL_API}/api/cliente/unicidade/${id}`, {
        method: "GET",
    });

    if (response.status === 200) {
        const data = await response.json();
        return {
            status: response.status,
            data: data
        };
    }

    return {
        status: response.status,
        data: null
    };
}

export async function preencheSelectList() {
    const response = await fetch(`${URL_API}/api/cliente/labels`, {
        method: "GET",
    });

    const data = await response.json();

    return {
        status: response.status,
        data: data
    };
}

export async function enviarImagem(idCliente, file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${URL_API}/api/cliente/upload/${idCliente}`, {
        method: "POST",
        body: formData
    });

    const result = await response.json();
    return {
        status: response.status,
        data: result
    };
}
