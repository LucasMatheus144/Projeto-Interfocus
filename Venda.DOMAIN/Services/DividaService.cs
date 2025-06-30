using NHibernate.Driver;
using System.Reflection.Metadata.Ecma335;
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
        public bool CadastraDivida(Dividas obj, out List<ExceptionMsg> erro)
        {
            erro = new List<ExceptionMsg>();
            if (!validar.ValidarEntites(obj, out erro)) return false;

            var id = obj.ClienteId;

            var cliente = ListarClientePorId(obj.ClienteId);

            if (cliente == null)
            {
                erro.Add(new ExceptionMsg("Cliente", "Identificador", "Cliente não localizado!"));
                return false;
            }

            obj.cliente = cliente;
            try
            {
                using var inicia = db.IniciarTransacao();
                db.Incluir(obj);
                db.Commit();

                AlterarStatusCliente(cliente, obj); // Forçar troca de staus do cliente

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
        public bool EditarDivida(Dividas obj, out List<ExceptionMsg> erro)
        {
            erro = new List<ExceptionMsg>();

            var procura = RetornaDividaPorId(obj.Id);

            if (procura == null)
            {
                erro.Add(new ExceptionMsg("Divida", "Identificador", "Divida Não encontrada!"));
                return false;
            }

            var cliente = ListarClientePorId(obj.ClienteId);

            if(cliente == null)
            {
                erro.Add(new ExceptionMsg("Cliente", "Identificador", "Cliente Não encontrada!"));
                return false;
            }

            obj.cliente = cliente;
            obj.DataCadastro = procura.DataCadastro; // forçar sempre manter a Data Cadastro
            
            if (obj.DataPagamento != null)
            {
                obj.Situacao = SituacaoDivida.Pago; // fiz isso para nao pegar o new.valor na trigger 
            }            


            if (!validar.ValidarEntites(obj, out erro)) return false;
            try
            {
                using var inicia = db.IniciarTransacao();
                db.Salvar(obj);
                db.Commit();

                AlterarStatusCliente(cliente, obj); // Forçar troca de staus do cliente
               
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
        /// TODO: Repensar nessa logica de alteração de status.
        /// 
        /// REGRA: 1- > Quando pagar a divida, alterar o status da divida para Pago
        ///        2- > Após alterar o status da divida, precisa verificar se o cliente ainda possui divida, se possuir manter o status de INADIMPLENTE
        /// </summary>
        private void AlterarStatusCliente(Cliente cl, Dividas obj)
        {
            //verifica se o cliente está inadimplente, caso contratio nao precisa dar update
            if (cl.Situacao != SituacaoCliente.Inadimplente)
            {
                // Se a divida não tiver data de pagamento, o cliente deve ser marcado como inadimplente
                if (obj.DataPagamento == null)
                {
                    using var inicia = db.IniciarTransacao();
                    cl.Situacao = SituacaoCliente.Inadimplente;
                    db.Incluir(cl);
                    db.Commit();
                }
            }
            else
            {
                // Valida se o cliente ainda possui alguma divida em aberto
                var query = RetornaTodasDividas().Where(x => x.cliente.Id == cl.Id && x.DataPagamento != null).Count();

                // se nao tiver
                if (query == 0)
                {
                    using var inicia = db.IniciarTransacao();
                    cl.Situacao = SituacaoCliente.Adimplente; //Volta a ser Adimplente
                    db.Incluir(cl);
                    db.Commit();
                }
            }
        }
    }
}
