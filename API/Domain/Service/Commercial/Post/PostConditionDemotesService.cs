using System;
using MySqlConnector;
using System.Threading.Tasks;
using Domain.Models.ERP.Commercial;
using Domain.Models.Validation;
using Domain.Service.Generic.BaseServices;
using Microsoft.Extensions.Configuration;
using static Domain.Enums.Enums;

namespace Domain.Service.Commercial.Post
{
    public class PostConditionDemotesService : BaseCommandService
    {
        private readonly ConditionDemote _conditionDemote;

        public PostConditionDemotesService(string connectionString, IConfiguration configuration, ConditionDemote conditionDemote) 
            : base(connectionString, configuration, (int)EnumTipoLog.postConditionDemotesApi)
        {
            _conditionDemote = conditionDemote;
        }

        /// <summary>
        /// Identifica se é uma operação de INSERT (id = 0) ou UPDATE (id > 0)
        /// </summary>
        private bool IsUpdateOperation => _conditionDemote.id > 0;

        protected override string GetCommandText()
        {
            // Para UPDATE, usa uma SP específica que aceita ID, ou usar UPDATE direto
            if (IsUpdateOperation)
            {
                return @"
                    UPDATE conditionDemotes 
                    SET conditionId = @conditionId,
                        supplierId = @supplierId,
                        branchId = @branchId,
                        description = @description,
                        beginDate = @beginDate,
                        endDate = @endDate,
                        creditedAmount = @creditedAmount,
                        debitedAmount = @debitedAmount,
                        allowNegativeBalance = @allowNegativeBalance,
                        returnThresholdPercent = @returnThresholdPercent,
                        isActive = @isActive,
                        lastUpdate = @lastUpdate
                    WHERE id = @id";
            }
            else
            {
                // Para INSERT, usa a SP original (sem @id)
                return "CALL stpPostConditionDemote(@conditionId, @supplierId, @branchId, @description, " +
                       "@beginDate, @endDate, @creditedAmount, @debitedAmount, @allowNegativeBalance, " +
                       "@returnThresholdPercent, @isActive, @registrationDate, @lastUpdate)";
            }
        }

        protected override void AddParameters(MySqlCommand command)
        {
            // Parâmetros comuns para INSERT e UPDATE
            command.Parameters.AddWithValue("@conditionId", _conditionDemote.conditionId);
            command.Parameters.AddWithValue("@supplierId", _conditionDemote.supplierId / 10);
            command.Parameters.AddWithValue("@branchId", _conditionDemote.branchId / 10);
            command.Parameters.AddWithValue("@description", _conditionDemote.description ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@beginDate", ValidateSqlDateTime(_conditionDemote.beginDate));
            command.Parameters.AddWithValue("@endDate", ValidateSqlDateTime(_conditionDemote.endDate));
            command.Parameters.AddWithValue("@creditedAmount", _conditionDemote.creditedAmount);
            command.Parameters.AddWithValue("@allowNegativeBalance", _conditionDemote.allowNegativeBalance);
            command.Parameters.AddWithValue("@returnThresholdPercent", _conditionDemote.returnThresholdPercent);
            command.Parameters.AddWithValue("@isActive", _conditionDemote.isActive);

            if (IsUpdateOperation)
            {
                // Parâmetros específicos para UPDATE
                command.Parameters.AddWithValue("@id", _conditionDemote.id);
                command.Parameters.AddWithValue("@debitedAmount", _conditionDemote.debitedAmount);
                command.Parameters.AddWithValue("@lastUpdate", DateTime.Now);
            }
            else
            {
                // Parâmetros específicos para INSERT (SP original)
                command.Parameters.AddWithValue("@debitedAmount", DBNull.Value);
                command.Parameters.AddWithValue("@registrationDate", DateTime.Now);
                command.Parameters.AddWithValue("@lastUpdate", DateTime.Now);
            }
        }

        public async Task<ValidationResult> ExecuteValidatedAsync()
        {
            var result = new ValidationResult();

            // Validações de negócio comuns
            if (!await ValidateBusinessRules(result))
                return result;

            using (var connection = new MySqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                // Validações específicas de duplicidade
                if (!await ValidateDuplicates(connection, result))
                    return result;

                // Validação específica para UPDATE: verificar se o registro existe
                if (IsUpdateOperation && !await ValidateRecordExists(connection, result))
                    return result;
            }

            // Executa o comando principal
            return await base.ExecuteAsync();
        }

        /// <summary>
        /// Validações de regras de negócio comuns para INSERT e UPDATE
        /// </summary>
        private async Task<bool> ValidateBusinessRules(ValidationResult result)
        {
            if (_conditionDemote.creditedAmount <= 0)
            {
                result.AdicionarErro(new ValidationError("O valor de crédito (creditedAmount) deve ser maior que zero."));
                return false;
            }

            if (_conditionDemote.returnThresholdPercent < 0 || _conditionDemote.returnThresholdPercent > 100)
            {
                result.AdicionarErro(new ValidationError("O percentual de retorno (returnThresholdPercent) deve estar entre 0 e 100."));
                return false;
            }

            if (_conditionDemote.beginDate > _conditionDemote.endDate)
            {
                result.AdicionarErro(new ValidationError("A data de início (beginDate) não pode ser maior que a data de fim (endDate)."));
                return false;
            }

            // Validação específica para UPDATE: não permitir alterar debitedAmount para valor maior que creditedAmount
            if (IsUpdateOperation && _conditionDemote.debitedAmount > _conditionDemote.creditedAmount)
            {
                result.AdicionarErro(new ValidationError("O valor debitado não pode ser maior que o valor creditado."));
                return false;
            }

            return true;
        }

        /// <summary>
        /// Valida duplicidades específicas para INSERT e UPDATE
        /// </summary>
        private async Task<bool> ValidateDuplicates(MySqlConnection connection, ValidationResult result)
        {
            var checkDescription = new MySqlCommand(@"
                SELECT COUNT(1)
                FROM conditionDemotes
                WHERE description = @description
                  AND (@id = 0 OR id <> @id);", connection);

            checkDescription.Parameters.AddWithValue("@description", _conditionDemote.description);
            checkDescription.Parameters.AddWithValue("@id", _conditionDemote.id);

            if ((int)await checkDescription.ExecuteScalarAsync() > 0)
            {
                result.AdicionarErro(new ValidationError("Já existe uma regra com essa descrição (description)."));
                return false;
            }

            var checkActive = new MySqlCommand(@"
                SELECT COUNT(1)
                FROM conditionDemotes
                WHERE conditionId = @conditionId
                  AND supplierId = @supplierId
                  AND branchId = @branchId
                  AND isActive = 1
                  AND (@id = 0 OR id <> @id)
                  AND endDate >= NOW();", connection);

            checkActive.Parameters.AddWithValue("@conditionId", _conditionDemote.conditionId);
            checkActive.Parameters.AddWithValue("@supplierId", _conditionDemote.supplierId);
            checkActive.Parameters.AddWithValue("@branchId", _conditionDemote.branchId);
            checkActive.Parameters.AddWithValue("@id", _conditionDemote.id);

            if ((int)await checkActive.ExecuteScalarAsync() > 0)
            {
                var operacao = IsUpdateOperation ? "edição" : "criação";
                result.AdicionarErro(new ValidationError($"Já existe uma regra ativa e válida com essa combinação de condição, fornecedor e filial. Operação de {operacao} não permitida."));
                return false;
            }

            return true;
        }

        /// <summary>
        /// Valida se o registro existe para operações de UPDATE
        /// </summary>
        private async Task<bool> ValidateRecordExists(MySqlConnection connection, ValidationResult result)
        {
            var checkExists = new MySqlCommand(@"
                SELECT COUNT(1)
                FROM conditionDemotes
                WHERE id = @id;", connection);

            checkExists.Parameters.AddWithValue("@id", _conditionDemote.id);

            if ((int)await checkExists.ExecuteScalarAsync() == 0)
            {
                result.AdicionarErro(new ValidationError($"Registro com ID {_conditionDemote.id} não encontrado para edição."));
                return false;
            }

            return true;
        }

        protected override object GetPayloadForLogging() => new 
        { 
            Operation = IsUpdateOperation ? "UPDATE" : "INSERT",
            Data = _conditionDemote 
        };
    }
}
