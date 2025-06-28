using System.ComponentModel.DataAnnotations;
using Venda.DOMAIN.Entities;

namespace Venda.DOMAIN.Services
{
    /// <summary>
    /// 
    /// Classe validatora de todos os servições e atributos da aplicação.
    /// 
    /// </summary>
    public class ValidacaoService
    {
        // Validação das propriedades das classes Existentes
        public bool ValidarEntites<AllObj>(AllObj obj, out List<ExceptionMsg> msgErro)
        {
            var valida = new List<ValidationResult>();

            // Se os atributos das classes forem satisfeitos, é valido

            var isValid = Validator.TryValidateObject(obj, new ValidationContext(obj), valida, true);

            msgErro = new List<ExceptionMsg>();

            if (!isValid)
            {
                msgErro = valida
                    .Select(x => new ExceptionMsg(
                        "Atributo classe",
                        x.MemberNames.FirstOrDefault(),
                        TratarMensagemErro(x.ErrorMessage)
                        ))
                    .ToList();
            }

            return isValid;
        }

        // Tratar os erros gerados de fora das Estidades, tratar erros do gerados pelo banco de dados
        public bool TratarExceptionDB(Exception ex, out List<ExceptionMsg> msgErro)
        {
            msgErro = new List<ExceptionMsg>();


            msgErro.Add(new
                ExceptionMsg(
                    ex.GetType().Name,
                    ex.Source,
                    TratarMensagemErro(ex.InnerException.ToString()
                    )
                )
            );


            return false;
        }

        // Traduzir as mensagems de erro
        private string TratarMensagemErro(string msg)
        {
            if (string.IsNullOrEmpty(msg)) return "Deu zika ai";

            else if (msg.Contains("Não valido o cadastro.")) return "O valor da divida é superior a 200 reais";
            else if (msg.Contains("O campo Nome é obrigatório.")) return "O nome é obrigatorio.";
            else if (msg.Contains("uq_cpf")) return "Cpf ja existe no sistema!";
            else if (msg.Contains("could not insert")) return "Erro ao incluir o registro.";
            else if (msg.Contains("Cpf field is required")) return "O cpf é obrigatorio!";


            else return msg;
        }
    }

    // PROPRIEDADE da claasse CLIENTE para o atributo EMAIL
    public class ValidatorEmailAdrresAttribute : ValidationAttribute 
    { 

    }

    // PROPRIEDADE da claasse CLIENTE para o atributo CPF
    public class ValidatorCpfAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var cpf = value as string;

            //var isValid = Cpf.Check(cpf);

            //return isValid ? ValidationResult.Success : new ValidationResult("O CPF informado não é válido", new[] { validationContext.MemberName });

        }

    }
}

