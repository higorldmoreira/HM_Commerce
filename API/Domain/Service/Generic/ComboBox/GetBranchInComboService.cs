using MySqlConnector;
using Domain.Models.Generic.ComboBox.Branch;
using Domain.Service.Generic.BaseServices;
using Domain.Util;

namespace Domain.Service.Generic.ComboBox
{
    public class GetBranchInComboService : BaseComboBoxService<BranchInCombo>
    {
        public GetBranchInComboService(string connectionString) : base(connectionString) { }

        protected override string GetQuery() => "EXEC stpGetBranchInCombo";

        protected override BranchInCombo MapReader(MySqlDataReader reader)
        {
            return new BranchInCombo
            {
                id = reader.GetFieldValueOrDefault<int>("id") ?? 0,
                branchId = reader.GetFieldValueOrDefault<int>("branchId") ?? 0,
                branch = reader["branch"] as string,
                branchNickName = reader["branchNickName"] as string
            };
        }
    }
}
