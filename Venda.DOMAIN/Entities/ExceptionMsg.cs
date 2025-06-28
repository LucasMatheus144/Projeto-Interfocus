namespace Venda.DOMAIN.Entities
{
    /// <summary>
    /// Todo retorno de erro PENSADO deve ser passado essa classe,
    /// </summary>
    public class ExceptionMsg
    {
        public string Atributo { get; set; }
        public string Propriedeade { get; set; }
        public string Mensagem { get; set; }

        public ExceptionMsg(string atributo, string propriedade, string mensagem)
        {
            Atributo = atributo;  // Nome do serviÇo validator -> por exemplo: NHIBERNATE, ADO , CLASSE
            Propriedeade = propriedade; // Nome da propriedade -> por exemplo: Nome, Cpf, DataNascimento
            Mensagem = mensagem; // mensagem de erro
        }
    }
}
