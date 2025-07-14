using System.ComponentModel.DataAnnotations;
using System.Runtime.InteropServices;
using Venda.DOMAIN.Interfaces;
using Venda.DOMAIN.ValuesObject;

namespace Venda.DOMAIN.Entities
{
    public class Dividas : IEntidade
    {
        public int Id { get; set; }

        [Required]
        public decimal Valor { get; set; }

        public DateTime DataCadastro { get; private set; } = ObterHorarioBrasilia();

        public DateTime? DataPagamento { get; set; }

        [Required]
        public string Descricao { get; set; } = string.Empty;

        public string? Url_Pdf { get; set; }

        [Required]
        public SituacaoDivida Situacao { get; set; }

        [Required]
        public Cliente cliente { get; set; } = new Cliente();
        // isso foi nescessario porque dei o deploy em um servidor de Londres
        // precisa sempre arrumar o horario 
        public void DefinirDataPagamento(DateTime? data)
        {
            if (data.HasValue) DataPagamento = ConvertarParaBrasil(data.Value);
        }
        private static DateTime ObterHorarioBrasilia()
        {
            var timeZone = RuntimeInformation.IsOSPlatform(OSPlatform.Windows) ? "E. South America Standard Time" : "America/Sao_Paulo";

            var horario = TimeZoneInfo.FindSystemTimeZoneById(timeZone);
            return TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, horario);
        }
        private static DateTime ConvertarParaBrasil(DateTime data)
        {
            var utc = data.Kind == DateTimeKind.Unspecified ? DateTime.SpecifyKind(data, DateTimeKind.Utc) : data.ToUniversalTime();

            var timeZone = RuntimeInformation.IsOSPlatform(OSPlatform.Windows) ? "E. South America Standard Time" : "America/Sao_Paulo";

            var horario = TimeZoneInfo.FindSystemTimeZoneById(timeZone);
            return TimeZoneInfo.ConvertTimeFromUtc(utc, horario);
        }
    }


}
