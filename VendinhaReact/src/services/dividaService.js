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
    return response.status;
}

export async function gerarPersonalizado(){
     const response = await fetch(`${URL_API}/api/divida/personalizado`, {
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