using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Domain.Models.ERP.Commercial
{
    public class ConditionItemDemote
    {
    /// <summary>Identificador único da condição de items desmonte</summary>
    //[JsonIgnore]
    public long? id { get; set; }

    /// <summary>Identificador da condição de desmonte</summary>
    //[JsonIgnore]
    public long? conditionDemoteId { get; set; }

    /// <summary>Identificador da condição associada à negociação</summary>
    [Required(ErrorMessage = "O campo conditionId é obrigatório.")]
    public int conditionId { get; set; }

    /// <summary>condição associada à negociação</summary>
    [Required(ErrorMessage = "O campo condition é obrigatório.")]
    [StringLength(100, ErrorMessage = "condition deve ter no máximo 100 caracteres.")]
    public string condition { get; set; }

    /// <summary>Código da entidade fornecedora</summary>
    [Required(ErrorMessage = "O campo supplierId é obrigatório.")]
    public int supplierId { get; set; }

    /// <summary>entidade fornecedora</summary>
    [Required(ErrorMessage = "O campo supplier é obrigatório.")]
    [StringLength(30, ErrorMessage = "supplier deve ter no máximo 30 caracteres.")]
    public string supplier { get; set; }

    /// <summary>Código do produto</summary>
    [Required(ErrorMessage = "O campo productId é obrigatório.")]
    public int productId { get; set; }

    /// <summary>Produto</summary>
    [Required(ErrorMessage = "O campo product é obrigatório.")]
    [StringLength(120, ErrorMessage = "product deve ter no máximo 120 caracteres.")]
    public string product { get; set; }

    /// <summary>Valor da rebaixa a aplicar no produto</summary>
    //[Required(ErrorMessage = "O campo demotesValue é obrigatório.")]
    [Range(0, double.MaxValue, ErrorMessage = "demotesValue não pode ser negativo.")]
    public decimal demotesValue { get; set; } = 0;

    /// <summary>Valor de crédito utilizado para abatimento</summary>
    //[Required(ErrorMessage = "O campo usedCreditAmount é obrigatório.")]
    [Range(0, double.MaxValue, ErrorMessage = "usedCreditAmount não pode ser negativo.")]
    public decimal usedCreditAmount { get; set; } = 0;

    /// <summary>Data de criação do registro</summary>
    //[Required(ErrorMessage = "O campo registrationDate é obrigatório.")]
    public DateTime registrationDate { get; set; } = DateTime.Now;

    /// <summary>Data da última alteração</summary>
    //[Required(ErrorMessage = "O campo lastUpdate é obrigatório.")]
    public DateTime lastUpdate { get; set; } = DateTime.Now;
    }
}
