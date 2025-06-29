using System.ComponentModel.DataAnnotations;
using Venda.DOMAIN.Interfaces;
using Venda.DOMAIN.ValuesObject;

namespace Venda.DOMAIN.Entities
{
    public class Dividas : IEntidade
    {
        public int Id { get; set; }

        [Required]
        public int ClienteId { get; set; }

        [Required]
        public decimal Valor { get; set; }

        public DateTime DataCadastro { get; set; } = DateTime.Now;

        public DateTime? DataPagamento { get; set; }

        public string Descricao { get; set; } = string.Empty;

        public SituacaoDivida Situacao { get; set; } = SituacaoDivida.Devendo;

        public Cliente cliente { get; set; }
    }
}
