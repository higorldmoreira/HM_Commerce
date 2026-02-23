using Domain.Models.ERP.Commercial;
using Domain.Models.Validation;
using Microsoft.Extensions.Configuration;
using MySqlConnector;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using static Domain.Enums.Enums;

namespace Domain.Service.Commercial.Post
{
    public class PostSupplierMovementService
    {
        private readonly string _connectionString;
        private readonly IConfiguration _configuration;

        public PostSupplierMovementService(string connectionString, IConfiguration configuration)
        {
            _connectionString = connectionString;
            _configuration = configuration;
        }

        public async Task<List<ValidationResult>> PostSupplierMovement(List<SupplierMovement> supplierMovement)
        {
            var results = new List<ValidationResult>();
            var enableLog = bool.Parse(_configuration.GetSection("EnableLog").Value);
            var appName = _configuration.GetSection("AppName").Value;

            if (enableLog)
            {
                Util.Util.GravaLogEnvio(supplierMovement, EnumTipoLog.postSupplierMovementApi, appName);
            }

            foreach (var supplier in supplierMovement)
            {
                var result = new ValidationResult();

                result.AdicionarErro(await Post(supplier));

                results.Add(result);
            }

            if (enableLog)
            {
                Util.Util.GravaLogRetorno(results, EnumTipoLog.postSupplierMovementApi, appName);
            }

            return results;
        }

        #region Post Supplier Movement

        private async Task<ValidationResult> Post(SupplierMovement supplierMovement)
        {
            var result = new ValidationResult();
                var connection = new MySqlConnection(_connectionString);

            try
            {
                connection.Open();
                var sql = QueryBaseStpWritePayment();
                var command = new MySqlCommand(sql, connection);
                ParametersStpWrite(ref command, supplierMovement);
                var dbresult = command.ExecuteReader();
                DbResultValidation($"Retorno validação Lançamento Débito/Crédito de Nº: {supplierMovement.id.ToString()} - ", dbresult, result, supplierMovement, supplierMovement.id.ToString());
                connection.Close();
            }
            catch (Exception e)
            {
                result.AdicionarErro(new ValidationError($"Erro ao gravar Lançamento Débito e Crédito de Nº {supplierMovement.id.ToString()} - " + e.Message, supplierMovement.id.ToString()));
            }
            finally
            {
                connection.Close();
            }

            return result;
        }

        private static void ParametersStpWrite(ref MySqlCommand command, SupplierMovement supplierMovement)
        {
            command.Parameters.AddWithValue("@branchId ", supplierMovement.branchId / 10);
            command.Parameters.AddWithValue("@supplierId", supplierMovement.supplierId / 10);
            command.Parameters.AddWithValue("@movementValue", supplierMovement.movementValue);
            command.Parameters.AddWithValue("@registrationDate", ValidateSqlDateTime(supplierMovement.registrationDate));
            command.Parameters.AddWithValue("@depositDate", ValidateSqlDateTime(supplierMovement.depositDate));
            command.Parameters.AddWithValue("@movementTypeId", supplierMovement.movementTypeId);
            command.Parameters.AddWithValue("@typistName", supplierMovement.typistName);
            command.Parameters.AddWithValue("@observation", supplierMovement.observation);
        }

        /// <summary>
        /// Valida e corrige valores DateTime para serem compatíveis com SQL Server
        /// </summary>
        private static object ValidateSqlDateTime(DateTime? dateTime)
        {
            var SqlServerMinDate = new DateTime(1753, 1, 1);
            var SqlServerMaxDate = new DateTime(9999, 12, 31, 23, 59, 59);

            if (!dateTime.HasValue)
                return DBNull.Value;

            var value = dateTime.Value;
            
            // Se a data for DateTime.MinValue ou for menor que o mínimo do SQL Server
            if (value == DateTime.MinValue || value < SqlServerMinDate)
                return DBNull.Value;
                
            // Se a data for maior que o máximo do SQL Server
            if (value > SqlServerMaxDate)
                return SqlServerMaxDate;
                
            return value;
        }

        /// <summary>
        /// Valida e corrige valores DateTime para serem compatíveis com SQL Server
        /// </summary>
        private static object ValidateSqlDateTime(DateTime dateTime)
        {
            var SqlServerMinDate = new DateTime(1753, 1, 1);
            var SqlServerMaxDate = new DateTime(9999, 12, 31, 23, 59, 59);

            // Se a data for DateTime.MinValue ou for menor que o mínimo do SQL Server
            if (dateTime == DateTime.MinValue || dateTime < SqlServerMinDate)
                return DBNull.Value;
                
            // Se a data for maior que o máximo do SQL Server
            if (dateTime > SqlServerMaxDate)
                return SqlServerMaxDate;
                
            return dateTime;
        }

        private static string QueryBaseStpWritePayment()
        {
            return "CALL stpPostSupplierCreditAndDebit(@branchId, @supplierId, @movementValue, @registrationDate, @depositDate, @movementTypeId, @typistName, @observation)";
        }

        #endregion        

        #region Genéricos

        private static void DbResultValidation(string mensagem, MySqlDataReader dbresult, ValidationResult result, dynamic obj, string key = null)
        {
            while (dbresult.Read())
            {
                #region Valida Pendencia

                var pendencyId = dbresult["pendencyId"] == DBNull.Value ? null : dbresult["pendencyId"];
                if (pendencyId != null && (int)pendencyId < 200000)
                    result.AdicionarAviso(new ValidationWarning($"{mensagem} {pendencyId} - {dbresult["pendency"]}", key));
                if (pendencyId != null && (int)pendencyId >= 200000)
                    result.AdicionarErro(new ValidationError($"{mensagem} {pendencyId} - {dbresult["pendency"]}", key));

                #endregion

                #region ObtemId

                if (obj != null && result.IsValid)
                {
                    obj.id = dbresult.GetInt64(0);
                    result.Value = obj.id;
                }

                #endregion
            }
        }

        #endregion
    }
}