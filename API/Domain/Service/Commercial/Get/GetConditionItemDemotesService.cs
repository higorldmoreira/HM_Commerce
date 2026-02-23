using Domain.Models.ERP.Commercial;
using Domain.Models.Parameters;
using Domain.Service.Generic.BaseServices;
using Domain.Util;
using System;
using MySqlConnector;

namespace Domain.Service.Commercial.Get
{
    public class GetConditionItemDemotesService : BaseQueryService<ConditionItemDemote, ConditionItemDemoteParameters>
    {
        public GetConditionItemDemotesService(string connectionString) : base(connectionString) { }

        protected override string GetQuery() => "CALL stpGetConditionItensDemotes(@conditionId, @supplierId, @conditionDemotesId)";

        protected override void AddParameters(MySqlCommand command, ConditionItemDemoteParameters parameters)
        {
            command.Parameters.AddWithValue("@conditionId", parameters.conditionId.HasValue ? (object)parameters.conditionId : DBNull.Value);
            command.Parameters.AddWithValue("@supplierId", parameters.supplierId.HasValue ? (object)(parameters.supplierId.Value / 10) : DBNull.Value);
            command.Parameters.AddWithValue("@conditionDemotesId", parameters.conditionDemotesId.HasValue ? (object)(parameters.conditionDemotesId.Value) : DBNull.Value);
        }

        protected override ConditionItemDemote MapReader(MySqlDataReader reader)
        {
            return new ConditionItemDemote
            {
                id = reader.GetFieldValueOrDefault<long>("id") ?? 0,
                conditionDemoteId = reader.GetFieldValueOrDefault<long>("conditionDemotesId") ?? 0,
                conditionId = reader.GetFieldValueOrDefault<int>("conditionId") ?? 0,
                condition = reader["condition"] as string,
                supplierId = reader.GetFieldValueOrDefault<int>("supplierId") ?? 0,
                supplier = reader["supplier"] as string,
                productId = reader.GetFieldValueOrDefault<int>("productId") ?? 0,
                product = reader["product"] as string,
                demotesValue = reader.GetFieldValueOrDefault<decimal>("demotesValue") ?? 0,
                usedCreditAmount = reader.GetFieldValueOrDefault<decimal>("usedCreditAmount") ?? 0,
                registrationDate = reader.GetFieldValueOrDefault<DateTime>("registrationDate") ?? DateTime.MinValue,
                lastUpdate = reader.GetFieldValueOrDefault<DateTime>("lastUpdate") ?? DateTime.MinValue
            };
        }
    }
}
