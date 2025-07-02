using NHibernate.Driver;
using System.Reflection.Metadata.Ecma335;
using Venda.DOMAIN.DTO.Divida;
using Venda.DOMAIN.Entities;
using Venda.DOMAIN.Repository;
using Venda.DOMAIN.ValuesObject;

namespace Venda.DOMAIN.Services
{
    public class DividaService
    {
        private readonly IRepository db;
        private readonly ValidacaoService validar;

        public DividaService(IRepository db, ValidacaoService validar)
        {
            this.db = db;
            this.validar = validar;
        }

        /// <summary>
        ///     
        /// Regra: 1 -> Toda divida nova, passa na trigger public.valida_new_divida() -> valida se a divida é maior que 200
        ///        2 -> Ao liberar o cadastro, precisa alterar o status do cliente para Inadimplente
        ///        3 -> Se o cadastro da divida for feita com o campo d_datapagamento preenchido, o status do cliente não deve ser alterado
        ///     
        /// </summary>
        //Cadastrar Dívida
        public bool CadastraDivida(DividaCreateDto obj, out List<ExceptionMsg> erro)
        {
            erro = new List<ExceptionMsg>();

            var procuraCliente = ListarClientePorId(obj.ClienteId);

            if (procuraCliente == null)
            {
                erro.Add(new ExceptionMsg("Cliente", "Identificador", "Cliente não localizado!"));
                return false;
            }

            if (obj.DataPagamento != null)
            {
                obj.Situacao = SituacaoDivida.Pago;
            }

            var divida = new Dividas
            {
                cliente = procuraCliente,
                Valor = obj.Valor,
                DataPagamento = obj.DataPagamento,
                Descricao = obj.Descricao,
                Situacao = obj.Situacao,
            };

            if (!validar.ValidarEntites(divida, out erro)) return false;


            try
            {
                using var inicia = db.IniciarTransacao();
                db.Incluir(divida);
                db.Commit();

                AlterarStatusCliente(procuraCliente); // Forçar troca de staus do cliente

                return true;
            }
            catch (Exception ex)
            {
                db.Rollback();
                validar.TratarExceptionDB(ex, out erro);
                return false;
            }
        }

        //Editar Dívida
        public bool EditarDivida(DividaCreateDto obj, out List<ExceptionMsg> erro)
        {
            erro = new List<ExceptionMsg>();

            var procura = RetornaDividaPorId(obj.IdDivida);

            if (procura == null)
            {
                erro.Add(new ExceptionMsg("Divida", "Identificador", "Divida Não encontrada!"));
                return false;
            }

            var cliente = ListarClientePorId(obj.ClienteId);

            if (cliente == null)
            {
                erro.Add(new ExceptionMsg("Cliente", "Identificador", "Cliente Não encontrada!"));
                return false;
            }

            if (obj.DataPagamento != null)
            {
                obj.Situacao = SituacaoDivida.Pago; 
            }

            var divida = new Dividas
            {
                cliente = cliente,
                Valor = obj.Valor,
                DataPagamento = obj.DataPagamento,
                Descricao = obj.Descricao,
            };


            if (!validar.ValidarEntites(divida, out erro)) return false;
            try
            {
                using var inicia = db.IniciarTransacao();
                db.Salvar(divida);
                db.Commit();

                AlterarStatusCliente(cliente); // Forçar troca de staus do cliente

                return true;
            }
            catch (Exception ex)
            {
                db.Rollback();
                validar.TratarExceptionDB(ex, out erro);
                return false;
            }
        }

        //Excluir Dívida
        public bool ExcluirDivida(int id)
        {
            var valida = RetornaDividaPorId(id);

            if (valida != null)
            {
                return false;
            }


            try
            {
                using var inicia = db.IniciarTransacao();
                db.Excluir(valida);
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
        public Dividas RetornaDividaPorId(int id)
        {
            return db.ConsultaId<Dividas>(id);
        }

        public List<Dividas> RetornaDividaPorCliente(int idcliente)
        {
            return db.Consulta<Dividas>().Where(x => x.cliente.Id == idcliente).ToList();
        }


        public DividaDtoExibicao ObterDividasFiltradas(string? pesquisa, int take = 10, int skip = 0)
        {
            var query = from d in RetornaTodasDividas()
                        join c in db.Consulta<Cliente>() on d.cliente.Id equals c.Id
                        where string.IsNullOrEmpty(pesquisa) || c.Nome.Contains(pesquisa)
                        select new DadosDividaDTO
                        {
                            IdDivida = d.Id,
                            Nome = c.Nome,
                            Cadastro = d.DataCadastro,
                            Pagamento = d.DataPagamento,
                            Valor = d.Valor,
                            Status = d.Situacao
                        };

            int __count = query.Count();

            var result = query
                .OrderBy(x => x.Status != SituacaoDivida.Devendo)
                .ThenByDescending(x => x.Valor)
                .Skip(skip * take)
                .Take(take)
                .ToList();

            return new DividaDtoExibicao
            {
                TotalRegistro = __count,
                Result = result
            };
        }

        /*essa vai de vasco*/
        public List<Dividas> RetornaTodasDividas()
        {
            return db.Consulta<Dividas>().ToList();
        }

        public Cliente ListarClientePorId(int id)
        {
            return db.ConsultaId<Cliente>(id);
        }

        //Regra Geral para Divida
        /// <summary>
        /// 
        /// REGRA: 1- > Quando pagar a divida, alterar o status da divida para Pago
        ///        2- > Após alterar o status da divida, precisa verificar se o cliente ainda possui divida, se possuir manter o status de INADIMPLENTE
        /// </summary>
        private void AlterarStatusCliente(Cliente cliente)
        {
            var possuiDividaAberta = RetornaDividaPorCliente(cliente.Id).Any(x => x.Situacao == SituacaoDivida.Devendo &&x.DataPagamento == null);

            cliente.Situacao = possuiDividaAberta ? SituacaoCliente.Inadimplente: SituacaoCliente.Adimplente;

            using var inicia = db.IniciarTransacao();
            db.Salvar(cliente);
            db.Commit();
        }
    }
}
