using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Venda.DOMAIN.Interfaces
{
    /// <summary>
    /// Contrato para as entidades do domínio.
    /// </summary>
    public interface IEntidade
    {
        int Id { get; set; }
    }
}
