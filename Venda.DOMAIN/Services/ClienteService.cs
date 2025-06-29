using Venda.DOMAIN.DTO;
using Venda.DOMAIN.Entities;
using Venda.DOMAIN.Repository;

namespace Venda.DOMAIN.Services
{
    public class ClienteService
    {
        private readonly IRepository db;
        private readonly ValidacaoService validar;

        public ClienteService(IRepository db, ValidacaoService validar)
        {
            this.db = db;
            this.validar = validar;
        }

        //Cadastrar Cliente
        public bool CadastraCliente(Cliente obj, out List<ExceptionMsg> erro)
        {
            erro = new List<ExceptionMsg>();

            if (!validar.ValidarEntites(obj, out erro)) return false;

            try
            {
                using var inicia = db.IniciarTransacao();

                db.Incluir(obj);
                db.Commit();
                return true;
            }
            catch (Exception ex)
            {

                db.Rollback();
                validar.TratarExceptionDB(ex, out erro);
                return false;
            }
        }

        //Editar Cliente
        public bool EditarCliente(Cliente obj, out List<ExceptionMsg> erro)
        {
            erro = new List<ExceptionMsg>();

            var procura = db.ConsultaId<Cliente>(obj.Id);

            if (procura == null)
            {
                erro.Add(new ExceptionMsg("Cliente", "Identificador", "Cliente não encontrado."));
                return false;
            }

            if (!validar.ValidarEntites(obj, out erro)) return false;

            try
            {
                using var inicia = db.IniciarTransacao();

                db.Salvar(obj);
                db.Commit();
                return true;
            }
            catch (Exception ex)
            {
                db.Rollback();
                validar.TratarExceptionDB(ex, out erro);
                return false;
            }
        }

        /// <summary>
        /// 
        /// CUIDADO: QUANDO EXCLUIR UMA CLIENTE, TODAS AS DÍVIDAS RELACIONADAS A ELA SERÃO EXCLUÍDAS.
        /// 
        /// </summary>
        //Excluir Cliente
        public bool DeleteCliente(int id)
        {
            var procura = db.ConsultaId<Cliente>(id);

            if (procura == null) return false;

            try
            {
                using var inicia = db.IniciarTransacao();
                db.Excluir(procura);
                db.Commit();
                return true;
            }
            catch (Exception)
            {
                db.Rollback();
                return false;
            }
        }

        //Consultas

        // todos os clientes
        public List<Cliente> ReportaTodosClientes()
        {
            return db.Consulta<Cliente>().ToList();
        }

        //Filtro | Ordenação e Paginação de Clientes
        public ClienteDtoExibicao ConsultaClienteFiltroePaginacao(string? pesquisa, int take, int skip)
        {
            var queryBase = from c in ReportaTodosClientes()
                            join d in db.Consulta<Dividas>() on c.Id equals d.cliente.Id into grupoDividas
                            from divida in grupoDividas.DefaultIfEmpty()
                            where string.IsNullOrEmpty(pesquisa) || c.Nome.Contains(pesquisa)
                            group divida by new { c.Id, c.Nome, c.Cpf, c.Situacao } into grp
                            select new DadosClienteDto
                            {
                                Id = grp.Key.Id,
                                Nome = grp.Key.Nome,
                                Cpf = grp.Key.Cpf,
                                Situacao = grp.Key.Situacao,
                                TotalDivida = grp.Sum(d => d != null && (int)d.Situacao == 2 ? (decimal?)d.Valor : 0) ?? 0
                            };

            var totalClientes = queryBase.Count();

            var result = queryBase
                .OrderByDescending(x => x.TotalDivida)
                .Skip(skip * take)
                .Take(take)
                .ToList();

            return new ClienteDtoExibicao
            {
                TotalClientes = totalClientes,
                Result = result
            };
        }

        //Função para preenchimento de um select label no front-end
        public List<ClienteDtoLabel> SelecionarCliente()
        {
            var query = from c in db.Consulta<Cliente>()
                        join d in db.Consulta<Dividas>() on c.Id equals d.ClienteId
                        group d by new { c.Id, c.Nome } into grp
                        let total = grp.Sum(x => x.Valor)
                        where total < 200
                        select new ClienteDtoLabel
                        {
                            Id = grp.Key.Id,
                            Nome = grp.Key.Nome,
                        };

            var resultado = query.ToList();

            return resultado;

        }

    }
}
