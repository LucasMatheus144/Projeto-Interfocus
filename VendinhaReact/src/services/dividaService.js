const URL_API = "http://localhost:5200"


export async function listarPorId(id) {

    const response = await fetch(`${URL_API}/api/divida/`)
    
}

export async function salvarDivida(divida) {
    const response = await fetch(`${URL_API}/api/divida`, {
        method: divida.id ? "PUT" : "POST",
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
