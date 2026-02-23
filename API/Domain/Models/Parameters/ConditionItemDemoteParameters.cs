namespace Domain.Models.Parameters
{
    public class ConditionItemDemoteParameters
    {
        public int? productId { get; set; }
        public int? conditionId { get; set; }
        public int? supplierId { get; set; }
        public long? conditionDemotesId { get; set; }
    }
}
