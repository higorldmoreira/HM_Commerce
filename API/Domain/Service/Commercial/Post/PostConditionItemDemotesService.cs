using Domain.Models.ERP.Commercial;
using Domain.Models.Validation;
using Domain.Service.Generic.BaseServices;
using Microsoft.Extensions.Configuration;
using System;
using MySqlConnector;
using System.Threading.Tasks;
using static Domain.Enums.Enums;

namespace Domain.Service.Commercial.Post
{
    public class PostConditionItemDemotesService : BaseCommandService
    {
        private readonly ConditionItemDemote _conditionItemDemote;

        public PostConditionItemDemotesService(string connectionString, IConfiguration configuration, ConditionItemDemote conditionItemDemote) 
            : base(connectionString, configuration, (int)EnumTipoLog.postConditionDemotesApi)
        {
            _conditionItemDemote = conditionItemDemote;
        }

        /// <summary>
        /// Identifica se é uma operação de INSERT (id = 0) ou UPDATE (id > 0)
        /// </summary>
        private bool IsUpdateOperation => _conditionItemDemote.id > 0;

        protected override string GetCommandText()
        {
            // Para UPDATE, usa uma SP específica que aceita ID, ou usar UPDATE direto
            if (IsUpdateOperation)
            {
                return @"UPDATE conditionItemDemotes 
                    SET demotesValue = @demotesValue,
                        lastUpdate = @lastUpdate
                    WHERE id = @id";
            }
            else
            {
                // Para INSERT, usa a SP original (sem @id)
                return @"INSERT INTO conditionItemDemotes
                        (
                              conditionDemotesId
                            , conditionId                            
                            , supplierId
                            , productId
                            , demotesValue
                            , usedCreditAmount
                            , registrationDate
                            , lastUpdate
                        )
                        VALUES
                        (
                              @conditionDemotesId
                            , @conditionId
                            , @supplierId
                            , @productId
                            , @demotesValue
                            , @usedCreditAmount
                            , NOW()
                            , NOW()
                        )";
            }
        }

        protected override void AddParameters(MySqlCommand command)
        {
            // Parâmetros comuns para INSERT e UPDATE
            command.Parameters.AddWithValue("@conditionDemotesId", _conditionItemDemote.conditionDemoteId); 
            command.Parameters.AddWithValue("@conditionId", _conditionItemDemote.conditionId);
            command.Parameters.AddWithValue("@supplierId", _conditionItemDemote.supplierId / 10);
            command.Parameters.AddWithValue("@productId", _conditionItemDemote.productId / 10);
            command.Parameters.AddWithValue("@demotesValue", _conditionItemDemote.demotesValue);
            command.Parameters.AddWithValue("@usedCreditAmount", 0);

            if (IsUpdateOperation)
            {
                // Parâmetros específicos para UPDATE
                command.Parameters.AddWithValue("@id", _conditionItemDemote.id);
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
            if (_conditionItemDemote.demotesValue < 0)
            {
                result.AdicionarErro(new ValidationError("O valor de crédito (creditedAmount) deve ser maior que zero."));
                return false;
            }

            return true;
        }

        /// <summary>
        /// Valida duplicidades específicas para INSERT e UPDATE
        /// </summary>
        

        /// <summary>
        /// Valida se o registro existe para operações de UPDATE
        /// </summary>
        private async Task<bool> ValidateRecordExists(MySqlConnection connection, ValidationResult result)
        {
            var checkExists = new MySqlCommand(@"
                SELECT COUNT(1)
                FROM conditionItemDemotes
                WHERE id = @id;", connection);

            checkExists.Parameters.AddWithValue("@id", _conditionItemDemote.id);

            if ((int)await checkExists.ExecuteScalarAsync() == 0)
            {
                result.AdicionarErro(new ValidationError($"Registro com ID {_conditionItemDemote.id} não encontrado para edição."));
                return false;
            }

            return true;
        }

        protected override object GetPayloadForLogging() => new 
        { 
            Operation = IsUpdateOperation ? "UPDATE" : "INSERT",
            Data = _conditionItemDemote 
        };
    }
}
