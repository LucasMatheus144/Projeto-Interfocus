using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Venda.DOMAIN.Entities;
using Venda.DOMAIN.DTO.Divida;
using Venda.DOMAIN.Services;

namespace Venda.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DividaController : ControllerBase
    {
        private readonly DividaService service;

        public DividaController(DividaService service)
        {
            this.service = service;
        }

        [HttpGet]
        public IActionResult Get(string? search, int limit, int offset)
        {
            return Ok(service.ObterDividasFiltradas(search,limit,offset));
        }

        [HttpGet]
        [Route("unicidade/{id}")]
        public IActionResult TrazerPorId(int id)
        {
            return Ok(service.RetornaDividaPorId(id));
        }

        [HttpGet("personalizado")]
        public IActionResult Personalizado(int limit, int offset)
        {
            return Ok(service.RetornarRelatorio(limit,offset));
        }

        [HttpGet("cliente")]
        public IActionResult RetornaDividaCliente(int idcliente, int limit, int offset)
        {
            return Ok(service.RetornaDividaPorCliente(idcliente, limit, offset));
        }

        [HttpPost]
        public IActionResult Cadastra([FromBody] DividaCreateDto obj)
        {
            var cadastra = service.CadastraDivida(obj, out List<ExceptionMsg> erro);

            return cadastra ? Ok(cadastra) : UnprocessableEntity(erro);
        }

        [HttpPut]
        public IActionResult Editar([FromBody] DividaCreateDto obj)
        {
            var editar = service.EditarDivida(obj, out List<ExceptionMsg> erro);

            return editar ? Ok(editar) : UnprocessableEntity(erro);
        }

        [HttpDelete("{id}")]
        public IActionResult Excluir(int id)
        {
            var deletar = service.ExcluirDivida(id, out List<ExceptionMsg> erro);

            return deletar ? Ok(deletar) : UnprocessableEntity(erro);
        }
    }
}
