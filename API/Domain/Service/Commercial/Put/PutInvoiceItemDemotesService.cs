using Domain.Models.ERP.Commercial;
using Domain.Models.Validation;
using Domain.Service.Commercial.Post;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using MySqlConnector;
using System.Linq;
using System.Threading.Tasks;
using static Domain.Enums.Enums;

namespace Domain.Service.Commercial.Put
{
    public class PutInvoiceItemDemotesService
    {
        private readonly string _connectionString;
        private readonly IConfiguration _configuration;

        public PutInvoiceItemDemotesService(string connectionString, IConfiguration configuration)
        {
            _connectionString = connectionString;
            _configuration = configuration;
        }

        public async Task<List<ValidationResult>> PutInvoiceItemDemotes(List<InvoiceItemDemotes> invoiceItemDemotes)
        {
            var resultsDemotes = new List<ValidationResult>();
            var results = new List<ValidationResult>();
            var enableLog = bool.Parse(_configuration.GetSection("EnableLog").Value);
            var appName = _configuration.GetSection("AppName").Value;

            var supplierMovement = SupplierMovement.Agrupar(invoiceItemDemotes);

            if (enableLog)
            {
                Util.Util.GravaLogEnvio(supplierMovement, EnumTipoLog.putInvoiceItemDemotesApi, appName);
            }

            var putInvoiceItemDemotes = new PostSupplierMovementService(_configuration.GetConnectionString("Commerce"), _configuration);

            resultsDemotes = await putInvoiceItemDemotes.PostSupplierMovement(supplierMovement);

            if (resultsDemotes.FirstOrDefault().IsValid)
            {
                foreach (var item in invoiceItemDemotes)
                {
                    var result = new ValidationResult();

                    result.AdicionarErro(await PutItemDemotes(item, resultsDemotes.FirstOrDefault().Value));

                    results.Add(result);
                }
            }
            if (enableLog)
            {
                Util.Util.GravaLogRetorno(results, EnumTipoLog.putInvoiceItemDemotesApi, appName);
            }

            return results;
        }

        #region Post SupplierMovement

        private async Task<ValidationResult> PutItemDemotes(InvoiceItemDemotes invoiceItemDemotes, long? supplierCreditAndDebitId)
        {
            var result = new ValidationResult();
            var connection = new MySqlConnection(_connectionString);

            try
            {
                connection.Open();
                var sql = QueryBaseStpWriteItemDemotes();
                var command = new MySqlCommand(sql, connection);
                ParametersStpWriteItemDemotes(ref command, invoiceItemDemotes, supplierCreditAndDebitId);
                var dbresult = command.ExecuteReader();
                //FillInResultGetComplete(dbresult, ref result);
                DbResultValidation($"Retorno validação Lançamento de rebaixa do Titulo de Nº: {invoiceItemDemotes.invoiceNumber}, com o produto de Nº: {invoiceItemDemotes.productId.ToString()}  -  ", dbresult, result, invoiceItemDemotes, invoiceItemDemotes.invoiceNumber);
                connection.Close();
            }
            catch (Exception e)
            {
                result.AdicionarErro(new ValidationError($"Erro ao gravar Lançamento de rebaixa do Titulo de Nº: {invoiceItemDemotes.invoiceNumber}, com o produto de Nº: {invoiceItemDemotes.productId.ToString()}  -  " + e.Message, invoiceItemDemotes.invoiceNumber));
            }
            finally
            {
                connection.Close();
            }

            return result;
        }

        private static void ParametersStpWriteItemDemotes(ref MySqlCommand command, InvoiceItemDemotes invoiceItemDemotes, long? supplierCreditAndDebitId)
        {
            command.Parameters.AddWithValue("@invoiceId ", invoiceItemDemotes.invoiceId);
            command.Parameters.AddWithValue("@productId", invoiceItemDemotes.productId / 10);
            command.Parameters.AddWithValue("@demotesValue", invoiceItemDemotes.demotesValueUnit);
            command.Parameters.AddWithValue("@supplierCreditAndDebitId", supplierCreditAndDebitId.HasValue && supplierCreditAndDebitId.Value > 0 ? supplierCreditAndDebitId : (object)DBNull.Value);

        }

        private static string QueryBaseStpWriteItemDemotes()
        {
            return "CALL stpPutInvoiceItemDemotes(@invoiceId, @productId, @demotesValue, @supplierCreditAndDebitId)";
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
                    obj.id = dbresult.GetInt32(0);
                    result.Value = obj.id;
                }

                #endregion
            }
        }

        #endregion

    }
}