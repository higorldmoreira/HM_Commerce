using System;
using System.Collections.Generic;
using MySqlConnector;
using System.Threading.Tasks;
using Domain.Models.Validation;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace Domain.Service.Generic.BaseServices
{
    public abstract class BaseCommandService
    {
        protected readonly string _connectionString;
        protected readonly bool _enableLog;
        protected readonly string _appName;
        protected readonly int _jobId;
        private static readonly DateTime MySqlMinDate = new DateTime(1000, 1, 1);
        private static readonly DateTime MySqlMaxDate = new DateTime(9999, 12, 31, 23, 59, 59);

        protected BaseCommandService(string connectionString, IConfiguration configuration, int jobId)
        {
            _connectionString = connectionString;
            _enableLog = configuration["EnableLog"]?.ToLower() == "true";
            _appName = configuration["AppName"] ?? "Default";
            _jobId = jobId;
        }

        protected abstract string GetCommandText();
        protected abstract void AddParameters(MySqlCommand command);
        protected virtual object GetPayloadForLogging() => null;

        /// <summary>
        /// Valida e corrige valores DateTime para serem compatíveis com MySQL
        /// </summary>
        protected static object ValidateSqlDateTime(DateTime? dateTime)
        {
            if (!dateTime.HasValue)
                return DBNull.Value;

            var value = dateTime.Value;
            
            if (value == DateTime.MinValue || value < MySqlMinDate)
                return DBNull.Value;
                
            if (value > MySqlMaxDate)
                return MySqlMaxDate;
                
            return value;
        }

        protected static object ValidateSqlDateTime(DateTime dateTime)
        {
            if (dateTime == DateTime.MinValue || dateTime < MySqlMinDate)
                return DBNull.Value;
                
            if (dateTime > MySqlMaxDate)
                return MySqlMaxDate;
                
            return dateTime;
        }

        public async Task<ValidationResult> ExecuteAsync()
        {
            var result = new ValidationResult();
            var payload = GetPayloadForLogging();

            try
            {
                using var connection = new MySqlConnection(_connectionString);
                await connection.OpenAsync();

                using var command = new MySqlCommand(GetCommandText(), connection)
                {
                    CommandTimeout = 300 // ajuste conforme necessidade
                };

                AddParameters(command);

                int affected = await command.ExecuteNonQueryAsync();
                result.Value = affected;

                if (_enableLog && payload != null)
                    Util.Util.GravaLogEnvio(payload, _jobId, _appName);

                if (affected == 0)
                    result.AdicionarAviso(new ValidationWarning("Nenhum registro foi afetado."));
            }
            catch (Exception ex)
            {
                if (payload != null)
                {
                    try { Util.Util.GravaLogEnvio(payload, _jobId, _appName); } catch { }
                }

                try { Util.Util.GravaLogRetorno($"Erro: {ex.Message}", _jobId, _appName); } catch { }

                result.AdicionarErro(new ValidationError($"Erro ao executar comando: {ex.Message}"));
            }

            return result;
        }
    }

    public abstract class BaseComboBoxService<T>
    {
        private readonly string _connectionString;

        protected BaseComboBoxService(string connectionString)
        {
            _connectionString = connectionString;
        }

        protected abstract string GetQuery();
        protected abstract T MapReader(MySqlDataReader reader);
        protected virtual void AddParameters(MySqlCommand command) { }

        public async Task<List<T>> ExecuteAsync()
        {
            var list = new List<T>();

            try
            {
                using var connection = new MySqlConnection(_connectionString);
                using var command = new MySqlCommand(GetQuery(), connection);

                AddParameters(command);

                await connection.OpenAsync();
                using var reader = await command.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    list.Add(MapReader(reader));
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao executar consulta de combo: {ex.Message}");
                throw;
            }

            return list;
        }
    }

    public abstract class BaseQueryService<T, TParameters>
    {
        private readonly string _connectionString;
        private static readonly DateTime MySqlMinDate = new DateTime(1000, 1, 1);
        private static readonly DateTime MySqlMaxDate = new DateTime(9999, 12, 31, 23, 59, 59);

        protected BaseQueryService(string connectionString)
        {
            _connectionString = connectionString;
        }

        protected abstract string GetQuery();
        protected abstract void AddParameters(MySqlCommand command, TParameters parameters);
        protected abstract T MapReader(MySqlDataReader reader);

        /// <summary>
        /// Valida e corrige valores DateTime para serem compatíveis com MySQL
        /// </summary>
        protected static object ValidateSqlDateTime(DateTime? dateTime)
        {
            if (!dateTime.HasValue)
                return DBNull.Value;

            var value = dateTime.Value;
            
            if (value == DateTime.MinValue || value < MySqlMinDate)
                return DBNull.Value;
                
            if (value > MySqlMaxDate)
                return MySqlMaxDate;
                
            return value;
        }

        /// <summary>
        /// Valida e corrige valores DateTime para serem compatíveis com MySQL
        /// </summary>
        protected static object ValidateSqlDateTime(DateTime dateTime)
        {
            if (dateTime == DateTime.MinValue || dateTime < MySqlMinDate)
                return DBNull.Value;
                
            if (dateTime > MySqlMaxDate)
                return MySqlMaxDate;
                
            return dateTime;
        }

        public async Task<List<T>> ExecuteAsync(TParameters parameters)
        {
            var list = new List<T>();

            try
            {
                using var connection = new MySqlConnection(_connectionString);
                using var command = new MySqlCommand(GetQuery(), connection)
                {
                    CommandTimeout = 300
                };

                AddParameters(command, parameters);

                await connection.OpenAsync();
                using var reader = await command.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    list.Add(MapReader(reader));
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao executar consulta: {ex.Message}");
                throw;
            }

            return list;
        }
    }
}
