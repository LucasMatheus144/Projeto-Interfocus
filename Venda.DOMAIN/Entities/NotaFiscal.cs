using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Venda.DOMAIN.Entities
{
    public class NotaFiscal
    {
        public required string Nome { get; set; }

        public decimal Valor { get; set; }

        public DateTime Pagamento { get; set; }

        public string Descricao { get; set; } = string.Empty;  

        public string RazaoSocial { get; set; } = "VENDA INTERFOCUS LTDA";
    }
}
