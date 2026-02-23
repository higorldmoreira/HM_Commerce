using System;
using MySqlConnector;
using Domain.Models.ERP.Commercial;
using Domain.Models.Parameters;
using Domain.Service.Generic.BaseServices;
using Domain.Util;

namespace Domain.Service.Commercial.Get
{
    public class GetConditionDemotesService : BaseQueryService<ConditionDemote, ConditionDemoteParameters>
    {
        public GetConditionDemotesService(string connectionString) : base(connectionString) { }

        protected override string GetQuery() => "CALL stpGetConditionDemotes(@branchId, @supplierId, @conditionId)";

        protected override void AddParameters(MySqlCommand command, ConditionDemoteParameters parameters)
        {
            command.Parameters.AddWithValue("@branchId", parameters.branchId.HasValue ? (object)(parameters.branchId.Value / 10) : DBNull.Value);
            command.Parameters.AddWithValue("@supplierId", parameters.supplierId.HasValue ? (object)(parameters.supplierId.Value / 10) : DBNull.Value);
            command.Parameters.AddWithValue("@conditionId", parameters.conditionId.HasValue ? (object)parameters.conditionId : DBNull.Value);
        }

        protected override ConditionDemote MapReader(MySqlDataReader reader)
        {
            return new ConditionDemote
            {
                id = reader.GetFieldValueOrDefault<long>("id") ?? 0,
                conditionId = reader.GetFieldValueOrDefault<int>("conditionId") ?? 0,
                supplierId = reader.GetFieldValueOrDefault<int>("supplierId") ?? 0,
                branchId = reader.GetFieldValueOrDefault<int>("branchId") ?? 0,
                description = reader["description"] as string,
                beginDate = reader.GetFieldValueOrDefault<DateTime>("beginDate") ?? DateTime.MinValue,
                endDate = reader.GetFieldValueOrDefault<DateTime>("endDate") ?? DateTime.MinValue,
                creditedAmount = reader.GetFieldValueOrDefault<decimal>("creditedAmount") ?? 0,
                debitedAmount = reader.GetFieldValueOrDefault<decimal>("debitedAmount") ?? 0,
                allowNegativeBalance = reader.GetFieldValueOrDefault<bool>("allowNegativeBalance") ?? false,
                returnThresholdPercent = reader.GetFieldValueOrDefault<decimal>("returnThresholdPercent") ?? 100,
                isActive = reader.GetFieldValueOrDefault<bool>("isActive") ?? true,
                registrationDate = reader.GetFieldValueOrDefault<DateTime>("registrationDate") ?? DateTime.MinValue,
                lastUpdate = reader.GetFieldValueOrDefault<DateTime>("lastUpdate") ?? DateTime.MinValue
            };
        }
    }
}
