using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Domain.Models.ERP.Commercial
{
    public class ConditionDemote
    {
    /// <summary>Identificador único da condição de desmonte</summary>
    //[JsonIgnore]
    public long id { get; set; }

    /// <summary>Identificador da condição associada à negociação</summary>
    [Required(ErrorMessage = "O campo conditionId é obrigatório.")]
    public int conditionId { get; set; }

    /// <summary>Código da entidade fornecedora</summary>
    [Required(ErrorMessage = "O campo supplierId é obrigatório.")]
    public int supplierId { get; set; }

    /// <summary>Código da filial</summary>
    [Required(ErrorMessage = "O campo branchId é obrigatório.")]
    public int branchId { get; set; }

    /// <summary>
    /// Nome descritivo da regra. Deve ser único na tabela, independentemente da combinação dos outros campos.
    /// Só é permitido repetir a mesma combinação de conditionId, supplierId e branchId
    /// se não houver outro registro ativo com essa combinação.
    /// Se não houver a endDate vencida
    /// </summary>
    [Required(ErrorMessage = "O campo description é obrigatório.")]
    [StringLength(150, ErrorMessage = "description deve ter no máximo 150 caracteres.")]
    public string description { get; set; }

    /// <summary>Data de início da validade da condição</summary>
    [Required(ErrorMessage = "O campo beginDate é obrigatório.")]
    public DateTime beginDate { get; set; }

    /// <summary>Data de fim da validade da condição</summary>
    [Required(ErrorMessage = "O campo endDate é obrigatório.")]
    public DateTime endDate { get; set; }

    /// <summary>Valor total de crédito concedido</summary>
    [Required(ErrorMessage = "O campo creditedAmount é obrigatório.")]
    [Range(0.01, double.MaxValue, ErrorMessage = "creditedAmount deve ser maior que zero.")]
    public decimal creditedAmount { get; set; }

    /// <summary>Valor total já debitado</summary>
    //[Required(ErrorMessage = "O campo debitedAmount é obrigatório.")]
    [Range(0, double.MaxValue, ErrorMessage = "debitedAmount não pode ser negativo.")]
    public decimal debitedAmount { get; set; }

    /// <summary>Saldo disponível (creditedAmount - debitedAmount)</summary>
    public decimal balanceAmount => creditedAmount - debitedAmount;

    /// <summary>Permite uso da condição mesmo com saldo negativo</summary>
    [Required(ErrorMessage = "O campo allowNegativeBalance é obrigatório.")]
    public bool allowNegativeBalance { get; set; }

    /// <summary>Percentual de crédito utilizado que aciona retorno (0 a 100%)</summary>
    [Required(ErrorMessage = "O campo returnThresholdPercent é obrigatório.")]
    [Range(0, 100, ErrorMessage = "returnThresholdPercent deve estar entre 0 e 100.")]
    public decimal returnThresholdPercent { get; set; }

    /// <summary>Indica se a condição está ativa (1 = ativa, 0 = inativa)</summary>
    [Required(ErrorMessage = "O campo isActive é obrigatório.")]
    public bool isActive { get; set; }

    /// <summary>Data de criação do registro</summary>
    //[Required(ErrorMessage = "O campo registrationDate é obrigatório.")]
    public DateTime registrationDate { get; set; } = DateTime.Now;

    /// <summary>Data da última alteração</summary>
    //[Required(ErrorMessage = "O campo lastUpdate é obrigatório.")]
    public DateTime lastUpdate { get; set; } = DateTime.Now;
    }
}
