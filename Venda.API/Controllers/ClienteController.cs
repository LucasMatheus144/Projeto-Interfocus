using Microsoft.AspNetCore.Mvc;
using Venda.DOMAIN.DTO.Cliente;
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
        public IActionResult Post([FromBody]ClienteDtoCreateUpdate model)
        {
            var cadastra = service.CadastraCliente(model, out List<ExceptionMsg> erro);

            return (cadastra != null) ? Ok(cadastra) : UnprocessableEntity(erro);
        }

        [HttpPut]
        public IActionResult Put([FromBody] Cliente model)
        {
            var atualiza = service.EditarCliente(model, out List<ExceptionMsg> erro);

            return atualiza ? Ok(atualiza) : UnprocessableEntity(erro);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var exclui = service.DeleteCliente(id);
            
            return exclui ? Ok(exclui) : NotFound(exclui);
        }

        [HttpPost("upload/{id_cliente}")]
        [Consumes("multipart/form-data")]
        public IActionResult UploadProfilePic(int id_cliente)
        {

            var imagem = Request.Form.Files.FirstOrDefault();
            if (imagem == null || imagem.Length == 0)
            {
                return BadRequest("Nenhuma imagem foi enviada.");
            }

            var upload = service.AlterarESalvarFoto(id_cliente, imagem);
          
            return Ok(upload);
        }
    }
}
