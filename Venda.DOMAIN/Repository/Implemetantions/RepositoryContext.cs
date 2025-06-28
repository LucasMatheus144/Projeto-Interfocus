using NHibernate;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace Venda.DOMAIN.Repository.Implemetantions
{
    /// <summary>
    /// Implementar as operações de acesso a dados
    /// </summary>
    public class RepositoryContext : IRepository
    {
        private readonly ISessionFactory sessionFactory;
        private readonly ISession db;

        public RepositoryContext(ISessionFactory sessionFactory)
        {
            this.sessionFactory = sessionFactory;
            this.db = sessionFactory.OpenSession();
        }

        public IQueryable<T> Consulta<T>()
        {
            return db.Query<T>();
        }

        public T ConsultaId<T>(int id)
        {
            return db.Get<T>(id);
        }

        public void Incluir(object entity)
        {
            db.Save(entity);
        }

        public void Salvar(object entity)
        {
            db.Merge(entity);
        }

        public void Excluir(object entity)
        {
            db.Delete(entity);
        }

        public IDisposable IniciarTransacao()
        {
            var transaction = db.BeginTransaction();
            return transaction;
        }

        public void Rollback()
        {
            db.GetCurrentTransaction()?.Rollback();
        }

        public void Commit()
        {
            db.GetCurrentTransaction().Commit();
        }

        public IList<T> ExecutaQuery<T>(string query)
        {
            return db.CreateSQLQuery(query)
              .AddEntity(typeof(T))
              .List<T>();
        }
    }
}
