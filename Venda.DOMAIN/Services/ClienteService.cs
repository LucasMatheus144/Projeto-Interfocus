using CpfLibrary;
using NHibernate.Transform;
using Microsoft.AspNetCore.Http;
using System.Text.RegularExpressions;
using Venda.DOMAIN.DTO.Cliente;
using Venda.DOMAIN.Entities;
using Venda.DOMAIN.Repository;
using Venda.DOMAIN.ValuesObject;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Venda.DOMAIN.Services
{
    public class ClienteService
    {
        private readonly IRepository db;
        private readonly ValidacaoService validar;
        private string url_aws = "https://bagimgs.s3.us-east-1.amazonaws.com/";

        public ClienteService(IRepository db, ValidacaoService validar)
        {
            this.db = db;
            this.validar = validar;
        }

        //Cadastrar Cliente
        public Cliente? CadastraCliente(ClienteDtoCreateUpdate obj, out List<ExceptionMsg> erro)
        {
            erro = new List<ExceptionMsg>();

            if (!validar.ValidarEntites(obj, out erro)) return null;

            try
            {
                var cliente = new Cliente
                {
                    Nome = obj.Nome,
                    Cpf = obj.Cpf,
                    DataNascimento = obj.DataNascimento,
                    Email = obj.Email,
                    Situacao = obj.Situacao,
                    UrlFoto = null
                };


                using var inicia = db.IniciarTransacao();

                db.Incluir(cliente);
                db.Commit();
                return cliente;
            }
            catch (Exception ex)
            {

                db.Rollback();
                validar.TratarExceptionDB(ex, out erro);
                return null;
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

            obj.Situacao = procura.Situacao;// sempre manter o status PORQUE quem controla essa ação é o pagamento da divida

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

        //Filtro | Ordenação e Paginação de Clientes
        public ClienteDtoExibicao ConsultaClienteFiltroePaginacao(string? pesquisa, int take= 10, int skip= 0)
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
                            cl.DataNascimento,
                            cl.UrlFoto
                        } into grp
                        select new DadosClienteDto
                        {
                            Id = grp.Key.Id,
                            Nome = grp.Key.Nome,
                            Situacao = grp.Key.Situacao,
                            Cpf = FormatarCpf(grp.Key.Cpf),
                            Email = grp.Key.Email,
                            stringFoto = grp.Key.UrlFoto,
                            Idade = CalcularIdade(grp.Key.DataNascimento),
                            TotalDivida = grp.Sum(d => d != null && d.Situacao == SituacaoDivida.Devendo && d.DataPagamento == null
                                                       ? (decimal?)d.Valor : 0) ?? 0
                        };

            int totalClientes = db.Consulta<Cliente>().Count();

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

        // upload images
        public async Task<string> UploadImagemAsync(IFormFile imagem)
        {
            if (imagem == null || imagem.Length == 0)
                return "";

            var nomeArquivo = Guid.NewGuid().ToString("N") + Path.GetExtension(imagem.FileName); 
            var urlS3 = url_aws + nomeArquivo;

            using var httpClient = new HttpClient();
            using var stream = imagem.OpenReadStream();
            using var content = new StreamContent(stream);

            content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(imagem.ContentType);

            var response = await httpClient.PutAsync(urlS3, content);

            if (!response.IsSuccessStatusCode)
            {
                var erro = await response.Content.ReadAsStringAsync();
                throw new Exception($"Erro ao fazer upload para o S3: {erro}");
            }

            return urlS3;
        }

        public bool AlterarESalvarFoto(int id, IFormFile imagem)
        {
            var obj = RetornaClienteId(id);

            string string_url = "";
            if (imagem != null && imagem.Length > 0)
            {
                string_url = UploadImagemAsync(imagem).GetAwaiter().GetResult();
            }

            obj.UrlFoto = string_url;

            try
            {
                using var inicia = db.IniciarTransacao();
                db.Incluir(obj);
                db.Commit();
                return true;
            }
            catch (Exception)
            {
                db.Rollback();
                return false;
            }
        }
    }
}
