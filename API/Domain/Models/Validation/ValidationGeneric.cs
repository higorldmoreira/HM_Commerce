namespace Domain.Models.Validation
{
    public class ValidationGeneric
    {
        public ValidationGeneric()
        {
        }

        public ValidationGeneric(int? cod, string relatedCod, int? pendencyCode = 0, string obs = null)
        {
            Id = cod;
            relatedId = relatedCod;
            pendencyId = pendencyCode;
            pendency = obs;
        }

        public int? Id { get; set; }

        public string relatedId { get; set; }

        public int? pendencyId { get; set; }
        
        public string? pendency { get; set; }

    }
}
