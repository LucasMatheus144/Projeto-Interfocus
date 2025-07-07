using System.ComponentModel.DataAnnotations;
using Venda.DOMAIN.Interfaces;
using Venda.DOMAIN.ValuesObject;

namespace Venda.DOMAIN.Entities
{
    public class Dividas : IEntidade
    {
        public int Id { get; set; }

        [Required]
        public decimal Valor { get; set; }

        public DateTime DataCadastro { get; private set; }

        public DateTime? DataPagamento { get; set; }

        [Required]
        public string Descricao { get; set; } = string.Empty;

        public string? Url_Pdf { get; set; }

        [Required]
        public SituacaoDivida Situacao { get; set; }

        [Required]
        public Cliente cliente { get; set; } = new Cliente();   
    }
}
