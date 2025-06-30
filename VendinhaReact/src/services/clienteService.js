const URL_API = "http://localhost:5200"

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

export function listarClientes(pesquisa, limit, offset) {
    return fetch(`${URL_API}/api/cliente?search=${pesquisa || ""}&limit=${limit}&offset=${offset}`, {
        method: "GET"
    }).then(async resultado => {
        if (resultado.status == 200) {
            const data = await resultado.json();
            return {
                status: resultado.status,
                __count: data.totalClientes,
                data: data.result
            }
        }
        return {
            status: resultado.status,
            __count: 0,
            data: null
        }
    })
}

export async function excluirCliente(id) {
    const response = await fetch(`${URL_API}/api/cliente/${id}`, {
        method: "DELETE",
    })
    return response.status;
}