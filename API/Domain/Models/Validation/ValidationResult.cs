using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;

namespace Domain.Models.Validation
{
    public class ValidationResult
    {
        private readonly List<ValidationError> _errors = new List<ValidationError>();
        private readonly List<ValidationWarning> _warnings = new List<ValidationWarning>();

        public IEnumerable<ValidationError> Erros => _errors;
        public IEnumerable<ValidationWarning> Warnings => _warnings;

        [JsonIgnore]
        public dynamic Value { get; set; }

        #region Métodos de erro
        public void AdicionarErro(ValidationError error)
        {
            _errors.Add(error);
        }

        public void RemoverErro(ValidationError error)
        {
            if (_errors.Contains(error))
                _errors.Remove(error);
        }

        public void AdicionarErro(params ValidationResult[] resultadoValidacao)
        {
            if (resultadoValidacao == null) return;

            if (resultadoValidacao[0].Value != null) Value = resultadoValidacao[0].Value;

            foreach (var validationResult in resultadoValidacao.Where(result => result != null && !result.IsValid))
                _errors.AddRange(validationResult.Erros);
        }
        #endregion

        #region Métodos de aviso
        public void AdicionarAviso(ValidationWarning aviso)
        {
            _warnings.Add(aviso);
        }

        public void RemoverAviso(ValidationWarning aviso)
        {
            if (_warnings.Contains(aviso))
                _warnings.Remove(aviso);
        }
        #endregion

        #region Métodos de erro e aviso
        public void AdicionarErroAviso(params ValidationResult[] resultadoValidacao)
        {
            if (resultadoValidacao == null) return;

            if (resultadoValidacao[0].Value != null) Value = resultadoValidacao[0].Value;

            foreach (var validationResult in resultadoValidacao.Where(result => result != null))
            {
                _errors.AddRange(validationResult.Erros);
                _warnings.AddRange(validationResult.Warnings);
            }
        }

        #endregion

        #region Gets
        public bool IsValid => _errors.Count == 0;
        public bool HasNoWarnings => _warnings.Count == 0;
        #endregion
    }
}