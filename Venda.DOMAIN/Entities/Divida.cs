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

        public string Descricao { get; set; }

        public SituacaoDivida Situacao { get; set; }

        public Cliente cliente { get; set; }
    }
}
