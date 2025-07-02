using Venda.DOMAIN.ValuesObject;

namespace Venda.DOMAIN.DTO.Divida
{
    public class DividaDtoExibicao
    {
        public int TotalRegistro { get; set; }
         
        public List<DadosDividaDTO> Result { get; set; }
    }

    public class DadosDividaDTO
    {
        public int IdDivida { get; set; }

        public string Nome { get; set; }

        public DateTime Cadastro { get; set; }

        public DateTime? Pagamento { get; set; }

        public decimal Valor { get; set; }

        public SituacaoDivida Status { get; set; }
    }
}
