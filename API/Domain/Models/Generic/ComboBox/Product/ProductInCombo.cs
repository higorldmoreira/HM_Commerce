using Newtonsoft.Json;

namespace Domain.Models.Generic.ComboBox.Product
{
    public class ProductInCombo
    {
        /// <summary>ID da Filial no RX</summary>
        [JsonIgnore]
        public int id { get; set; }

        /// <summary>Código relacional do Produto - OBS: Obrigatoria a gravação desse Produto, pelo seu respectivo método, antes do envio(pode-se utilizar: Código relacional do Sistema Integrador / Código do Produto, no Sistema Delage / EAN) </summary>        
        public string relationalProductId { get; set; }

        /// <summary>Código do Produto - OBS: Obrigatoria a gravação desse Produto, pelo seu respectivo método, antes do envio(pode-se utilizar: Código relacional do Sistema Integrador / Código do Produto, no Sistema Delage / EAN) </summary>        
        public int? productId { get; set; }

        /// <summary>NOme do Produto</summary>        
        public string product { get; set; }
    }
}
