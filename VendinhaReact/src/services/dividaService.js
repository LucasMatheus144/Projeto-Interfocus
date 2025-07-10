//const URL_API = "http://104.131.110.118"

const URL_API = "http://localhost:5200"

export async function listarPorId(id) {

    const response = await fetch(`${URL_API}/api/divida/unicidade/${id}`, {
        method: "GET"
    });


    if (response.status == 200) {
        var result = await response.json();
        return {
            status: response.status,
            data: result
        }
    }
    return {
        status: response.status,
        data: null
    }
}

export async function salvarDivida(divida) {
    const response = await fetch(`${URL_API}/api/divida`, {
        method: divida.idDivida > 0 ? "PUT" : "POST",
        body: JSON.stringify(divida),
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

export function listarDividas(pesquisa, limit, offset) {
    return fetch(`${URL_API}/api/divida?search=${pesquisa || ""}&limit=${limit}&offset=${offset}`, {
        method: "GET"
    }).then(async resultado => {
        if (resultado.status == 200) {
            const data = await resultado.json();
            return {
                status: resultado.status,
                __count: data.totalRegistro,
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

export async function deletarDivida(id) {
    const response = await fetch(`${URL_API}/api/divida/${id}`, {
        method: "DELETE",
    })
    let result = null;

    try {
        result = await response.json();
    } catch (e) {
        result = { mensagem: "Erro ao processar resposta da API." };
    }
    return {
        status: response.status,
        data: result
    };
}

export async function gerarPersonalizado(limit,offset) {
    const response = await fetch(`${URL_API}/api/divida/personalizado?&limit=${limit}&offset=${offset}`, {
        method: "GET"
    });

    if (response.status == 200) {
        var result = await response.json();
        return {
            status: response.status,
            __count : result.countClientes,
            aReceber: result.aReceber,
            recebido: result.recebido,
            detalhes: result.detalhes
        }
    }
    return {
        status: response.status,
        __count:null,
        aReceber: null,
        recebido: null,
        detalhes: null
    }

}

export async function listarPorCliente(idcliente) {
    const response = await fetch(`${URL_API}/api/divida/cliente?idcliente=${idcliente}`, {
        method: "GET"
    });

    if (response.status == 200) {
        var result = await response.json();
        return {
            status: response.status,
            data: result
        }
    }
    return {
        status: response.status,
        data: null
    }
    
}