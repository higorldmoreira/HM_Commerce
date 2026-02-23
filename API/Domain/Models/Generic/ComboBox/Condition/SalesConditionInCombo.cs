using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models.Generic.ComboBox.Condition
{
    public class SalesConditionInCombo
    {
        /// <summary>ID da Condição no ERP</summary>
        [JsonIgnore]
        public int id { get; set; }

        /// <summary>Nome da Condição Comercial</summary>        
        public string condition { get; set; }
    }
}
