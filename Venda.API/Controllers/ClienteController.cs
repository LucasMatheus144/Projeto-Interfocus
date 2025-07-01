using Microsoft.AspNetCore.Mvc;
using Venda.DOMAIN.Entities;
using Venda.DOMAIN.Services;

namespace Venda.API.Controllers
{
    [Route("api/[controller]")]
    public class ClienteController : Controller
    {
        private readonly ClienteService service;

        public ClienteController(ClienteService service)
        {
            this.service = service;
        }

        [HttpGet]
        public IActionResult Get(string? search, int limit, int offset)
        {
            var pesquisa = string.IsNullOrWhiteSpace(search) ? null : search;

            return Ok(service.ConsultaClienteFiltroePaginacao(pesquisa, limit, offset));
        }

        [HttpGet]
        [Route("unicidade/{id}")]
        public IActionResult RetornarUnicoCliente(int id)
        {
            return Ok(service.RetornaClienteId(id));
        }

        [HttpGet]
        [Route("labels")]
        public IActionResult ConstruirLabel()
        {
            return Ok(service.SelecionarCliente());
        }

        [HttpPost]
        public IActionResult Post([FromBody] Cliente model)
        {
            var cadastra = service.CadastraCliente(model, out List<ExceptionMsg> erro);

            if (!cadastra)
            {
                return UnprocessableEntity(erro);
            }

            return Ok(cadastra);
        }

        [HttpPut]
        public IActionResult Put([FromBody] Cliente model)
        {
            var atualiza = service.EditarCliente(model, out List<ExceptionMsg> erro);
            if (!atualiza)
            {
                return UnprocessableEntity(erro);
            }
            return Ok(atualiza);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var exclui = service.DeleteCliente(id);
            if (!exclui)
            {
                return NotFound(exclui);
            }
            return Ok(exclui);
        }
    }
}
