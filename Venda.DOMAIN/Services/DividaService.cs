using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System.Globalization;
using Venda.DOMAIN.DTO.Divida;
using Venda.DOMAIN.DTO.Relatorio;
using Venda.DOMAIN.Entities;
using Venda.DOMAIN.Repository;
using Venda.DOMAIN.ValuesObject;

namespace Venda.DOMAIN.Services
{
    public class DividaService
    {
        private readonly IRepository db;
        private readonly ValidacaoService validar;
        private string url_aws = "https://arquivopdfsbucks.s3.us-east-1.amazonaws.com";

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

            if (!validar.ValidaIsNullObjetos(obj, out erro)) return false;

            var procuraCliente = ListarClientePorId(obj.ClienteId);

            if (procuraCliente == null)
            {
                erro.Add(new ExceptionMsg("Cliente", "Identificador", "Cliente não localizado!"));
                return false;
            }

            obj.Situacao = obj.DataPagamento != null ? SituacaoDivida.Pago : SituacaoDivida.Devendo;

            var divida = new Dividas
            {
                cliente = procuraCliente,
                Valor = obj.Valor,
                Descricao = obj.Descricao,
                Situacao = obj.Situacao,
                Url_Pdf = null
            };

            if (obj.DataPagamento.HasValue)
            {
                divida.DefinirDataPagamento(obj.DataPagamento.Value); // SEMPRE PREGAR O data de agora
            }

            if (!validar.ValidarEntites(divida, out erro)) return false;

            try
            {
                if (divida.DataPagamento != null)
                {
                    divida.Url_Pdf = RetornaUrlPdf(divida);
                }

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

            if (!validar.ValidaIsNullObjetos(obj, out erro)) return false;

            var divida = RetornaDividaPorId(obj.IdDivida);

            if (divida == null)
            {
                erro.Add(new ExceptionMsg("Divida", "Identificador", "Divida Não encontrada!"));
                return false;
            }

            // Não pode alterar uma divida que ja foi paga
            if (divida.Situacao == SituacaoDivida.Pago)
            {
                erro.Add(new ExceptionMsg("Divida", "data Pagamento", "Não pode alterar uma divida já paga!"));
                return false;
            }

            var cliente = ListarClientePorId(obj.ClienteId);

            if (cliente == null)
            {
                erro.Add(new ExceptionMsg("Cliente", "Identificador", "Cliente Não encontrada!"));
                return false;
            }

            obj.Situacao = obj.DataPagamento != null ? SituacaoDivida.Pago : SituacaoDivida.Devendo;

            divida.cliente = cliente;
            divida.Valor = obj.Valor;
            divida.Descricao = obj.Descricao;
            divida.Situacao = obj.Situacao;
            if (obj.DataPagamento.HasValue)
            {
                divida.DefinirDataPagamento(obj.DataPagamento.Value);
            }


            if (!validar.ValidarEntites(divida, out erro)) return false;
            try
            {
                if (divida.DataPagamento != null)
                {
                    divida.Url_Pdf = RetornaUrlPdf(divida);
                }

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
        public bool ExcluirDivida(int id, out List<ExceptionMsg> erro)
        {

            erro = new List<ExceptionMsg>();
            var valida = RetornaDividaPorId(id);


            if (valida == null)
            {
                return false;
            }
            if(valida.Situacao == SituacaoDivida.Pago)
            {
                erro.Add(new ExceptionMsg("Divida", "Situação", "Não pode excluir uma divida que possui nota fiscal!"));
                return false;
            }

            try
            {
                using var inicia = db.IniciarTransacao();
                db.Excluir(valida);
                db.Commit();

                AlterarStatusCliente(valida.cliente);
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

        public List<DividaClienteViewDto> RetornaDividaPorCliente(int idcliente, string sopradiferenciar)
        {
            var consulta = db.Consulta<Dividas>().Where(x => x.cliente.Id == idcliente)
                .Select(x => new DividaClienteViewDto
                {
                    IdCliente = x.cliente.Id,        
                    Valor = x.Valor,
                    Situacao = x.Situacao,                  
                    Pagamento = x.DataPagamento,
                })
                .ToList();

            return consulta;
        }

        public RelatorioDto RetornarRelatorio(int take = 10, int skip = 0)
        {
            /*
               select sum(case when d.situacao = 1 then d.valor else 0 end) as AReceber,
                      sum(case when d.situacao = 2 and d.d_datapagamento is not null then d.valor else 0 end) as Recebido
                      from dividas d;
             */
            var relatorioDados = db.Consulta<Dividas>()
                .GroupBy(d => 1)
                .Select(g => new
                {
                    AReceber = g.Where(x => x.Situacao == SituacaoDivida.Devendo && x.DataPagamento == null).Sum(x => (decimal?)x.Valor) ?? 0m,
                    Recebido = g.Where(x => x.Situacao == SituacaoDivida.Pago && x.DataPagamento != null).Sum(x => (decimal?)x.Valor) ?? 0m
                })
                .FirstOrDefault();

            decimal aReceber = relatorioDados?.AReceber ?? 0;
            decimal recebido = relatorioDados?.Recebido ?? 0;

            var queryComClientes = (from cl in db.Consulta<Cliente>()
                                    join d in db.Consulta<Dividas>() on cl.Id equals d.cliente.Id
                                    group new { cl, d } by new { cl.Nome, cl.Cpf, cl.Email } into g
                                    select new DtoRelatorio
                                    {
                                        Nome = g.Key.Nome,
                                        Cpf = g.Key.Cpf,
                                        Email = g.Key.Email,
                                        VaiReceber = g.Sum(x => (decimal?)(x.d.Situacao == SituacaoDivida.Devendo && x.d.DataPagamento == null ? x.d.Valor : 0)) ?? 0,
                                        JaPagou = g.Sum(x => (decimal?)(x.d.Situacao == SituacaoDivida.Pago && x.d.DataPagamento != null ? x.d.Valor : 0)) ?? 0,
                                        Total = g.Sum(x => (decimal?)x.d.Valor) ?? 0
                                    })
                                    .Skip(skip * take)
                                    .Take(take)
                                    .ToList();

            return new RelatorioDto
            {
                CountClientes = db.Consulta<Cliente>().Select(x => x.Id).Count(),
                AReceber = aReceber,
                Recebido = recebido,
                Detalhes = queryComClientes
            };
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
                            Status = d.Situacao,
                            Url_pdf = d.Url_Pdf
                        };

            int __count = query.Count();

            var result = query
                .OrderBy(x => x.Status != SituacaoDivida.Devendo)
                .ThenByDescending(x => x.IdDivida)
                .Skip(skip * take)
                .Take(take)
                .ToList();

            return new DividaDtoExibicao
            {
                TotalRegistro = __count,
                Result = result
            };
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

        private void AlterarStatusCliente(Cliente cliente)
        {
            /// <summary>
            /// 
            /// REGRA: 1- > Quando pagar a divida, alterar o status da divida para Pago
            ///        2- > Após alterar o status da divida, precisa verificar se o cliente ainda possui divida, se possuir manter o status de INADIMPLENTE
            /// </summary>
            var possuiDividaAberta = RetornaDividaPorCliente(cliente.Id).Any(x => x.Situacao == SituacaoDivida.Devendo && x.DataPagamento == null);

            cliente.Situacao = possuiDividaAberta ? SituacaoCliente.Inadimplente : SituacaoCliente.Adimplente;

            using var inicia = db.IniciarTransacao();
            db.Salvar(cliente);
            db.Commit();
        }

        // documentaçao https://apitemplate.io/blog/how-to-convert-html-to-pdf-using-c-sharp/
        public async Task<string> GerarNotaFiscalAsync(Dividas d)
        {
            if (d == null || d.cliente == null)
                throw new ArgumentException("Dados da dívida incompletos.");

            var c = ListarClientePorId(d.cliente.Id);

            var nf = new NotaFiscal
            {
                Nome = c.Nome,
                Descricao = d.Descricao,
                Valor = d.Valor,
                Pagamento = d.DataPagamento ?? DateTime.Now,
                Emissao = DateTime.Now
            };

            // Geração do PDF com QuestPDF
            var nomeArquivo = Guid.NewGuid().ToString("N") + ".pdf";
            string urlS3 = url_aws.TrimEnd('/') + "/" + nomeArquivo;

            // Gera o PDF em memória (byte[])
            var pdfBytes = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(30);
                    page.PageColor("#f9f9f9");
                    page.DefaultTextStyle(x => x.FontFamily("Arial").FontSize(12));

                    page.Content().Padding(20).Column(column =>
                    {
                        column.Spacing(15);

                        column.Item().Container().Background(Colors.White).Padding(30).Border(1).BorderColor("#ccc").Column(inner =>
                        {
                            // Título
                            inner.Item().AlignCenter().Text("Nota Fiscal")
                                .FontSize(28)
                                .Bold()
                                .FontColor("#000");

                            inner.Item().LineHorizontal(1).LineColor("#ccc");

                            // Informações principais
                            inner.Item().Column(info =>
                            {
                                info.Spacing(5);
                                info.Item().Text(text =>
                                {
                                    text.Span("Razão Social: ").SemiBold();
                                    text.Span(nf.RazaoSocial ?? "-");
                                });

                                info.Item().Text(text =>
                                {
                                    text.Span("Nome: ").SemiBold();
                                    text.Span(nf.Nome);
                                });

                                info.Item().Text(text =>
                                {
                                    text.Span("Valor: ").SemiBold();
                                    text.Span(nf.Valor.ToString("C", CultureInfo.GetCultureInfo("pt-BR")));
                                });

                                info.Item().Text(text =>
                                {
                                    text.Span("Data de Pagamento: ").SemiBold();
                                    text.Span(nf.Pagamento.ToString("dd/MM/yyyy"));
                                });
                            });

                            // Descrição
                            inner.Item().PaddingTop(20).Text("Descrição:")
                                .FontSize(16)
                                .Bold();

                            inner.Item().Text(nf.Descricao ?? "-")
                                 .FontSize(14)
                                 .LineHeight(1.5f);
                        });

                        // Rodapé
                        column.Item().AlignCenter().Text($"Documento gerado automaticamente - {nf.Emissao:dd/MM/yyyy}")
                            .FontSize(10)
                            .FontColor("#777");
                    });

                    // Numeração da página
                    page.Footer().AlignCenter().Text(x =>
                    {
                        x.Span("Página ");
                        x.CurrentPageNumber();
                        x.Span(" de ");
                        x.TotalPages();
                    });
                });
            }).GeneratePdf();



            // Upload para S3
            using var httpClient = new HttpClient();
            using var content = new ByteArrayContent(pdfBytes);
            content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/pdf");

            var response = await httpClient.PutAsync(urlS3, content);

            if (!response.IsSuccessStatusCode)
            {
                var erro = await response.Content.ReadAsStringAsync();
                throw new Exception($"Erro ao fazer upload para o S3: {erro}");
            }

            return urlS3;
        }

        public string RetornaUrlPdf(Dividas d)
        {
            var url = GerarNotaFiscalAsync(d).GetAwaiter().GetResult();
            return url;
        }
    }
}
