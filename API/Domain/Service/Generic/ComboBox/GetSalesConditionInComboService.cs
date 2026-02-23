using System;
using MySqlConnector;
using Domain.Models.Generic.ComboBox.Condition;
using Domain.Util;
using Domain.Service.Generic.BaseServices;


namespace Domain.Service.Generic.ComboBox
{
    public class GetSalesConditionInComboService : BaseComboBoxService<SalesConditionInCombo>
    {
        private readonly int? _branchId;

        public GetSalesConditionInComboService(string connectionString, int? branchId = null) : base(connectionString)
        {
            _branchId = branchId;
        }

        protected override string GetQuery() => "CALL stpGetSalesConditionInCombo(@branchId)";

        protected override void AddParameters(MySqlCommand command)
        {
            int? branchIdWithoutDv = _branchId.HasValue ? _branchId.Value / 10 : (int?)null;
            command.Parameters.AddWithValue("@branchId", (object)branchIdWithoutDv ?? DBNull.Value);
        }

        protected override SalesConditionInCombo MapReader(MySqlDataReader reader)
        {
            return new SalesConditionInCombo
            {
                id = reader.GetFieldValueOrDefault<int>("id") ?? 0,
                condition = reader["condition"] as string
            };
        }
    }
}
