using Venda.DOMAIN.Entities;
using Venda.DOMAIN.ValuesObject;

namespace Venda.DOMAIN.DTO.Cliente
{
    ///<sumary>
    ///Essa classe foi deita para a exibição e paginação de dados no Front-end.
    ///No front vou ordenar os clientes e preciso ter o total de clientes.
    ///</sumary>

    public class ClienteDtoExibicao
    {
        public int TotalClientes { get; set; }
        public List<DadosClienteDto> Result { get; set; }
    }


    public class DadosClienteDto
    {
        public int Id { get; set; }
        public string Nome { get; set; } 
        public string Cpf { get; set; } 
        public SituacaoCliente Situacao { get; set; }
        public string Email { get; set; } 

        public string stringFoto { get; set; }

        public int Idade { get; set; }
        public decimal TotalDivida { get; set; }
    }
}
