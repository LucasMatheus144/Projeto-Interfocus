using Microsoft.AspNetCore.Http;
using Venda.DOMAIN.ValuesObject;

namespace Venda.DOMAIN.DTO.Cliente
{
    public class ClienteDtoCreateUpdate
    {
        public int Id { get; set; }
        public string Nome { get; set; }

        public string Cpf { get; set; }

        public DateTime DataNascimento { get; set; }

        public string? Email { get; set; }

        public SituacaoCliente Situacao { get; set; }

        public IFormFile Foto { get; set; }
    }
}
