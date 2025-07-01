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
        public IActionResult Get()
        {
            return Ok(service.RetornaTodasDividas());
        }

        [HttpPost]
        public IActionResult Cadastra([FromBody] DividaCreateDto obj)
        {
            var cadastra = service.CadastraDivida(obj, out List<ExceptionMsg> erro);

            if (!cadastra)
            {
                return UnprocessableEntity(erro);
            }

            return Ok(cadastra);
        }

        [HttpPut]
        public IActionResult Editar([FromBody] DividaCreateDto obj)
        {
            var editar = service.EditarDivida(obj, out List<ExceptionMsg> erro);

            if (!editar)
            {
                return UnprocessableEntity(erro);
            }

            return Ok(editar);
        }

        [HttpDelete("{id}")]
        public IActionResult Excluir(int id)
        {
            var deletar = service.ExcluirDivida(id);

            if (!deletar)
            {
                return NotFound(deletar);
            }

            return Ok(deletar);
        }
    }
}
