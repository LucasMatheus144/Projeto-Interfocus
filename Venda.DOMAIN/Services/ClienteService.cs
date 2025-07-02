using CpfLibrary;
using NHibernate.Transform;
using System.Text.RegularExpressions;
using Venda.DOMAIN.DTO.Cliente;
using Venda.DOMAIN.Entities;
using Venda.DOMAIN.Repository;
using Venda.DOMAIN.ValuesObject;

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

            if(CalcularIdade(obj.DataNascimento) < 18)
            {
                erro.Add(new ExceptionMsg("Cliente", "Data Nascimento", "O cliente não possui a idade minima."));
                return false;
            }

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

            if (CalcularIdade(obj.DataNascimento) < 18)
            {
                erro.Add(new ExceptionMsg("Cliente", "Data Nascimento", "O cliente não possui a idade minima."));
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
            var query = from cl in db.Consulta<Cliente>()
                        join d in db.Consulta<Dividas>() on cl.Id equals d.cliente.Id into grupoDividas
                        from divida in grupoDividas.DefaultIfEmpty()
                        where string.IsNullOrEmpty(pesquisa) || cl.Nome.Contains(pesquisa)
                        group divida by new
                        {
                            cl.Id,
                            cl.Nome,
                            cl.Situacao,
                            cl.Cpf,
                            cl.Email,
                            cl.DataNascimento
                        } into grp
                        select new DadosClienteDto
                        {
                            Id = grp.Key.Id,
                            Nome = grp.Key.Nome,
                            Situacao = grp.Key.Situacao,
                            Cpf = FormatarCpf(grp.Key.Cpf),
                            Email = grp.Key.Email,
                            Idade = CalcularIdade(grp.Key.DataNascimento),
                            TotalDivida = grp.Sum(d => d != null && d.Situacao == SituacaoDivida.Devendo && d.DataPagamento == null
                                                       ? (decimal?)d.Valor : 0) ?? 0
                        };

            var totalClientes = query.Count();

            var result = query
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
            //var query = from c in db.Consulta<Cliente>()
            //            group c by new { c.Id, c.Nome } into grp
            //            select new ClienteDtoLabel
            //            {
            //                Id = grp.Key.Id,
            //                Nome = grp.Key.Nome,
            //            };

            //var resultado = query.ToList();

            var query = db.ExecutaQuery<ClienteDtoLabel>("select id,nome from vis_clientes");

            return query.ToList();

        }

        public Cliente RetornaClienteId(int id)
        {
            return db.ConsultaId<Cliente>(id);
        }

        //Formatação de valores
        private string FormatarCpf(string value)
        {
            if (string.IsNullOrEmpty(value)) return value;

            return Regex.Replace(value, @"^(\d{3})\.\d{3}\.\d{3}-(\d{2})$", "$1.XXX.XXX-$2");
        }

        private int CalcularIdade(DateTime dataNascimento)
        {
            var idade = DateTime.Now.Year - dataNascimento.Year;
            if (dataNascimento > DateTime.Now.AddYears(-idade)) idade--;
            return idade;
        }
    }
}
