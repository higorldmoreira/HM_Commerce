using System;
using MySqlConnector;
using Domain.Models.Generic.ComboBox.Product;
using Domain.Service.Generic.BaseServices;
using Domain.Util;

namespace Domain.Service.Generic.ComboBox
{
    public class GetProductInComboService : BaseComboBoxService<ProductInCombo>
    {
        private readonly int? _supplierId;

        public GetProductInComboService(string connectionString, int? supplierId = null) : base(connectionString)
        {
            _supplierId = supplierId;
        }

        protected override string GetQuery() => "CALL stpGetProductInCombo(@supplierId)";

        protected override void AddParameters(MySqlCommand command)
        {
            int? supplierIdWithoutDv = _supplierId.HasValue ? _supplierId.Value / 10 : (int?)null;
            command.Parameters.AddWithValue("@supplierId", (object)supplierIdWithoutDv ?? DBNull.Value);
        }

        protected override ProductInCombo MapReader(MySqlDataReader reader)
        {
            return new ProductInCombo
            {
                id = reader.GetFieldValueOrDefault<int>("id") ?? 0,
                productId = reader.GetFieldValueOrDefault<int>("productId") ?? 0,
                product = reader["product"] as string
            };
        }
    }
}
