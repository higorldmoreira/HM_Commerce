using Newtonsoft.Json;

namespace Domain.Models.Generic.ComboBox.Supplier
{
    public class SupplierInCombo
    {
        /// <summary>ID do Fornecedor no ERP</summary>
        [JsonIgnore]
        public int id { get; set; }

        /// <summary>Código relacional do Fornecedor - OBS: Obrigatoria a gravação dessa entidade, pelo seu respectivo método, antes do envio(pode-se utilizar: Código relacional do Sistema Integrador / Código da entidade, no Sistema ERP / EAN / CNPJ) </summary>        
        public string relationalSupplierId { get; set; }

        /// <summary>Código do Foencedor - OBS: Obrigatoria a gravação dessa entidade, pelo seu respectivo método, antes do envio (pode-se utilizar: Código relacional do Sistema Integrador / Código da entidade, no Sistema ERP / EAN / CNPJ) </summary>        
        public int? supplierId { get; set; }

        /// <summary>Razão Social do Fornecedor</summary>        
        public string supplier { get; set; }

        /// <summary>Nome Fantasia do Fornecedor</summary>        
        public string supplierNickName { get; set; }
    }
}
