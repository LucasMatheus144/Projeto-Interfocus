using CpfLibrary;
using NHibernate.Mapping.ByCode.Impl;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using Venda.DOMAIN.Entities;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Venda.DOMAIN.Services
{
    /// <summary>
    /// 
    /// Classe validatora de todos os services e atributos da aplicação.
    /// 
    /// </summary>
    public class ValidacaoService
    {
        // Validação das propriedades das classes Existentes
        public bool ValidarEntites<AllObj>(AllObj obj, out List<ExceptionMsg> msgErro)
        {
            msgErro = new List<ExceptionMsg>();

            if ( obj == null )
            {
                msgErro.Add(new ExceptionMsg("Classe", "Objeto", "Algum campo do form veio quebrado"));
                return false;
            }

            var valida = new List<ValidationResult>();

            // Se os atributos das classes forem satisfeitos, é valido

            var isValid = Validator.TryValidateObject(obj, new ValidationContext(obj), valida, true);

            if (!isValid)
            {
                msgErro = valida
                    .Select(x => new ExceptionMsg(
                        "Atributo classe",
                        x.MemberNames.Any() ? x.MemberNames.First() : "desconhecido",
                        TratarMensagemErro(x.ErrorMessage ?? "zikou")
                        ))
                    .ToList();
            }
            else
            {
                switch (obj)
                {
                    case Cliente cl:
                        isValid = ValidaCliente(cl, out msgErro);
                        break;

                    case Dividas dv:
                        isValid = ValidaDivida(dv, out msgErro);
                        break;
                }
            }

            return isValid;
        }

        // Isso valida o Objeto DTO , e não a Classe em si.
        // Foi nescessario porque eu realizo cadastro com obj DTO, e salvo a Classe.
        public bool ValidaIsNullObjetos<DtoObjs>(DtoObjs obj, out List<ExceptionMsg> erro)
        {
            erro = new List<ExceptionMsg>();

            if(obj == null)
            {
                erro.Add(new ExceptionMsg("Classe", "Objeto", "Algum campo do form veio quebrado"));
                return false;
            }
            return true;
        }

        //validar todas as regras de ngc do CLIENTE

        private bool ValidaCliente(Cliente cliente, out List<ExceptionMsg> msgErro)
        {
            msgErro = new List<ExceptionMsg>();
            var idade = DateTime.Now.Year - cliente.DataNascimento.Year;
            if (cliente.DataNascimento > DateTime.Now.AddYears(-idade)) idade--;

            if (idade < 18 || idade > 90)
            {
                msgErro.Add(new ExceptionMsg("Cliente", "Data Nascimento", "O cliente não possui a idade aquedada."));
                return false;
            }
            else if (cliente.Nome.ToLower().Contains("mateus dias"))
            {
                msgErro.Add(new ExceptionMsg("Cliente", "Nome", "PROIBIDO ter alguem chamado mateus dias."));
                return false;
            }

                return true;
        }

        private bool ValidaDivida(Dividas divida, out List<ExceptionMsg> msgErro)
        {
            msgErro = new List<ExceptionMsg>();

            if(divida.Valor < 0)
            {
                msgErro.Add(new ExceptionMsg("Divida", "Valor", "Valor da divida é menor que R$:00,00"));
                return false;
            }
            else if (divida.DataPagamento.HasValue)
            {
                var data = divida.DataPagamento.Value;

                var hoje = DateTime.Today;
                var inicioMesAtual = new DateTime(hoje.Year, hoje.Month, 1);
                var limiteMinimo = hoje.AddYears(-100);
                var limitMax = hoje.AddDays(60);

                if (data < limiteMinimo || data > limitMax)
                {
                    msgErro.Add(new ExceptionMsg("DataPagamento", "Valor", "A data não pode ser salva no periodo gravado."));
                    return false;
                }
                else if (data < inicioMesAtual)
                {
                    msgErro.Add(new ExceptionMsg("DataPagamento", "Valor", "A data deve ser igual ou posterior ao mês atual."));
                    return false;
                }
            }
            return true;
        }

        // Tratar os erros gerados de fora das Estidades, tratar erros do gerados pelo banco de dados
        public bool TratarExceptionDB(Exception ex, out List<ExceptionMsg> msgErro)
        {
            msgErro = new List<ExceptionMsg>();


            msgErro.Add(new
                ExceptionMsg(
                    ex.GetType().Name,
                    ex.Source ?? "nao sei",
                    TratarMensagemErro(ex.InnerException?.Message ?? ex.Message)
                )
            );


            return false;
        }

        // Traduzir as mensagems de erro
        private string TratarMensagemErro(string msg)
        {
            if (string.IsNullOrEmpty(msg)) return "Deu zika ai";

            else if (msg.Contains("clientes_nome_key")) return "O nome do cliente já existe no sistema!";
            else if (msg.Contains("clientes_cpf_key")) return "O CPF do cliente já existe no sistema!";
            else if (msg.Contains("Valor Superior a 200.")) return "Esse novo valor vai ultrapassar o limite de 200 reais!";
            else if (msg.Contains("O campo Nome é obrigatório.")) return "O nome é obrigatorio.";
            else if (msg.Contains("could not insert")) return "Erro ao incluir o registro.";
            else if (msg.Contains("Cpf field is required")) return "O cpf é obrigatorio!";
            else if (msg.Contains("valor negativo")) return "O valor da divida está invalido!";
            else if (msg.Contains("Cpf Invalido")) return "O cpf está invalido";
            else if (msg.Contains("email min 4")) return "O email deve possuir no minimo 4 caracteres";
            else if (msg.Contains("max 50")) return "O email deve ter no maximo 50 caracteres";
            else if (msg.Contains("Email InvalidoEmail Invalido")) return "O email não atende os requisitos minimos";

            else return msg;
        }
    }

    // PROPRIEDADE da claasse CLIENTE para o atributo EMAIL
    public class ValidatorEmailAdrresAttribute : ValidationAttribute 
    { 
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var email = value as string;

            // Se for nulo , pode passar porque o email não é obrigatório
            if (email == null) return ValidationResult.Success;

            // Não pode passar se for vazio
            if (string.IsNullOrWhiteSpace(email)) return new ValidationResult("Email está vazio", new[] { validationContext.MemberName! });

            //Precisa ter no minimo 4 caracteres
            if (email.Length < 4) return new ValidationResult("email min 4", new[] { validationContext.MemberName! });

            if (email.Length > 50) return new ValidationResult("max 50", new[] { validationContext.MemberName! });

            //Para o email ser valido, precisa ter os campos do regex -> @  , .com  ou .br
            var valido = new Regex(@"^[^@\s]+@[^@\s]+\.(com|br)$");

            if (!valido.IsMatch(email)) return new ValidationResult("Email Invalido", new[] { validationContext.MemberName! });

            return ValidationResult.Success;

        }
    }

    // PROPRIEDADE da claasse CLIENTE para o atributo CPF
    // Documentação da biblioteca -https://github.com/tallesl/net-Cpf
    public class ValidatorCpfAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var cpf = value as string;

            //Aqui valida o CPF é valido ou não
            var isValid = Cpf.Check(cpf);

            return isValid ? ValidationResult.Success : new ValidationResult("Cpf Invalido", new[] { validationContext.MemberName! });

        }

    }
}

