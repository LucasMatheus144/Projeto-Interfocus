namespace Venda.DOMAIN.DTO.Relatorio
{
    public class RelatorioDto
    {
        public int CountClientes { get; set; }
        public decimal AReceber { get; set; }   

        public decimal Recebido { get; set; }

        public List<DtoRelatorio> Detalhes { get; set; } = new List<DtoRelatorio>();
    }

    public class DtoRelatorio
    {
        public string Nome { get; set; } = string.Empty;
        public string Cpf { get; set; } = string.Empty;
        public string? Email { get; set; }

        public decimal VaiReceber { get; set; }

        public decimal JaPagou { get; set; }

        public decimal Total { get; set; }
    }
}
