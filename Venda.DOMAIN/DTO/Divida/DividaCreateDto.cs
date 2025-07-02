using Venda.DOMAIN.ValuesObject;

namespace Venda.DOMAIN.DTO.Divida
{
    public class DividaCreateDto
    {
        public int IdDivida { get; set; }
        public int ClienteId { get; set; }

        public decimal Valor { get; set; }

        public DateTime DataCadastro { get; private set; }

        public DateTime? DataPagamento { get; set; }

        public string Descricao { get; set; }

        public SituacaoDivida Situacao { get; set; } = SituacaoDivida.Devendo;
    }
}
