using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Venda.DOMAIN.Repository
{
    /// <summary>
    /// Retornos utilizadas para ações do banco de dados
    /// </summary>
    public interface IRepository
    {
        void Incluir(object entity);

        void Excluir(object entity);

        void Salvar(object entity);

        T ConsultaId<T>(int id);

        IQueryable<T> Consulta<T>();

        IList<T> ExecutaQuery<T>(string query);

        IDisposable IniciarTransacao();
        void Commit();
        void Rollback();
    }
}
