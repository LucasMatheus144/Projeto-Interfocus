using Venda.DOMAIN.ValuesObject;

namespace Venda.DOMAIN.DTO.Divida
{
    public class DividaClienteViewDto
    {
        public int IdCliente { get; set; }

        public decimal Valor { get; set; }

        public DateTime? Pagamento { get; set; }

        public SituacaoDivida Situacao { get; set; }
    }
}
