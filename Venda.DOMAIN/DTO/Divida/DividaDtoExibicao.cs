using Venda.DOMAIN.ValuesObject;

namespace Venda.DOMAIN.DTO.Divida
{
    public class DividaDtoExibicao
    {
        public int TotalRegistro { get; set; }
         
        public required List<DadosDividaDTO> Result { get; set; }
    }

    public class DadosDividaDTO
    {
        public int IdDivida { get; set; }

        public string Nome { get; set; } = string.Empty;

        public DateTime Cadastro { get; set; }

        public DateTime? Pagamento { get; set; }

        public decimal Valor { get; set; }

        public SituacaoDivida Status { get; set; }

        public string? Url_pdf { get; set; }
    }
}
