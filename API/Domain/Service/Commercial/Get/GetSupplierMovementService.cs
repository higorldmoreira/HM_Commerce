using System;
using MySqlConnector;
using Domain.Models.ERP.Commercial;
using Domain.Models.Parameters;
using Domain.Service.Generic.BaseServices;
using Domain.Util;

namespace Domain.Service.Commercial.Get
{
    public class GetSupplierMovementService : BaseQueryService<SupplierMovement, SupplierMovementParameters>
    {
        public GetSupplierMovementService(string connectionString, Microsoft.Extensions.Configuration.IConfiguration configuration) : base(connectionString){}

        protected override string GetQuery() =>
            "CALL stpGetSupplierCreditAndDebit(@branchId, @supplierId, @movementTypeId)";

        protected override void AddParameters(MySqlCommand command, SupplierMovementParameters parameters)
        {
            command.Parameters.AddWithValue("@branchId", parameters.branchId.HasValue ? (object)(parameters.branchId.Value / 10) : DBNull.Value);

            command.Parameters.AddWithValue("@supplierId", parameters.supplierId.HasValue ? (object)(parameters.supplierId.Value / 10) : DBNull.Value);

            command.Parameters.AddWithValue("@movementTypeId", (object)parameters.movementTypeId ?? DBNull.Value);
        }

        protected override SupplierMovement MapReader(MySqlDataReader reader)
        {
            return new SupplierMovement
            {
                id = reader.GetFieldValueOrDefault<long>("id") ?? 0,
                branchId = reader.GetFieldValueOrDefault<int>("branchId") ?? 0,
                branchName = reader["branchName"] as string,
                branchNickName = reader["branchNickName"] as string,
                supplierId = reader.GetFieldValueOrDefault<int>("supplierId") ?? 0,
                supplierName = reader["supplierName"] as string,
                supplierNickName = reader["supplierNickName"] as string,
                movementTypeId = reader.GetFieldValueOrDefault<short>("movementTypeId") ?? 0,
                movementTypeName = reader["movementTypeName"] as string,
                movementValue = reader.GetFieldValueOrDefault<decimal>("movementValue") ?? 0,
                depositDate = reader.GetFieldValueOrDefault<DateTime>("depositDate") ?? DateTime.MinValue,
                registrationDate = reader.GetFieldValueOrDefault<DateTime>("registrationDate") ?? DateTime.MinValue,
                typistName = reader["typistName"] as string,
                observation = reader["observation"] as string,
                lastUpdated = reader.GetFieldValueOrDefault<DateTime>("lastUpdated") ?? DateTime.MinValue
            };
        }
    }
}
