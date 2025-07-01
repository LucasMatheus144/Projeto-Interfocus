using System.ComponentModel.DataAnnotations;
using Venda.DOMAIN.Interfaces;
using Venda.DOMAIN.Services;
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
        public string Nome { get; set; }

        [Required]
        [ValidatorCpf]
        public string Cpf { get; set; }

        [Required]
        public DateTime DataNascimento { get; set; }

        [ValidatorEmailAdrres]
        public string? Email { get; set; }

        public SituacaoCliente Situacao { get; set; }

    }
}
