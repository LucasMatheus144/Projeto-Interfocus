using System.ComponentModel.DataAnnotations;
using Venda.DOMAIN.Interfaces;
using Venda.DOMAIN.ValuesObject;

namespace Venda.DOMAIN.Entities
{
    /*
       * -> Campos Obrigatorios 
     
        Nome Completo *
        CPF *
        Data de Nascimento *
        E-mail 
     
     */
    public class Cliente : IEntidade
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(25)]
        [MinLength(3)]
        public string Nome { get; set; } = string.Empty;

        [Required]
        public string Cpf { get; set; } = string.Empty;

        public DateTime DataNascimento { get; private set; } = DateTime.Now;

        [EmailAddress]
        [MaxLength(50, ErrorMessage = "O limite de caracteres para o e-mail é 50")]
        public string? Email { get; set; }

        public SituacaoCliente Situacao { get; set; } = SituacaoCliente.Adimplente;

        public int Idade
        {
            get
            {
                var idade = DateTime.Now.Year - DataNascimento.Year;
                if (DataNascimento > DateTime.Now.AddYears(-idade)) idade--;

                return idade;
            }
        }

        public IList<Dividas>? Dividas { get; set; }
    }
}
