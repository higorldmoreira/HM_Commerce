namespace Domain.Models.Validation
{
    public class ValidationWarning
    {
        public ValidationWarning(string message, string key = null)
        {
            Message = message;
            Key = key;
        }

        public string Key { get; set; }

        public string Message { get; set; }
    }
}