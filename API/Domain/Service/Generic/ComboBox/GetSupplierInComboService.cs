using MySqlConnector;
using Domain.Models.Generic.ComboBox.Supplier;
using Domain.Service.Generic.BaseServices;
using Domain.Util;

namespace Domain.Service.Generic.ComboBox
{
    public class GetSupplierInComboService : BaseComboBoxService<SupplierInCombo>
    {
        public GetSupplierInComboService(string connectionString) : base(connectionString) { }

        protected override string GetQuery() => "CALL stpGetProductSupplierInCombo()";

        protected override SupplierInCombo MapReader(MySqlDataReader reader)
        {
            return new SupplierInCombo
            {
                id = reader.GetFieldValueOrDefault<int>("id") ?? 0,
                supplierId = reader.GetFieldValueOrDefault<int>("supplierId") ?? 0,
                supplier = reader["supplier"] as string,
                supplierNickName = reader["supplierNickName"] as string
            };
        }
    }
}
