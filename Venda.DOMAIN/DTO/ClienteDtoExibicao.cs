using Venda.DOMAIN.ValuesObject;

namespace Venda.DOMAIN.DTO
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
        public string Nome { get; set; } = string.Empty;
        public string Cpf { get; set; } = string.Empty;
        public SituacaoCliente Situacao { get; set; }
        public decimal TotalDivida { get; set; }
    }
}
