using Newtonsoft.Json;

namespace Domain.Models.Generic.ComboBox.Branch
{
    public class BranchInCombo
    {
        /// <summary>ID da Filial no RX</summary>
        [JsonIgnore]
        public int id { get; set; }

        /// <summary>Código relacional da Filial - OBS: Obrigatoria a gravação dessa entidade, pelo seu respectivo método, antes do envio(pode-se utilizar: Código relacional do Sistema Integrador / Código da entidade, no Sistema Delage / EAN / CNPJ) </summary>        
        public string relationalBranchId { get; set; }

        /// <summary>Código da Filial - OBS: Obrigatoria a gravação dessa entidade, pelo seu respectivo método, antes do envio (pode-se utilizar: Código relacional do Sistema Integrador / Código da entidade, no Sistema Delage / EAN / CNPJ) </summary>        
        public int? branchId { get; set; }

        /// <summary>Razão Social da Filial</summary>        
        public string branch { get; set; }

        /// <summary>Nome Fantasia da Filial</summary>        
        public string branchNickName { get; set; }
    }
}
