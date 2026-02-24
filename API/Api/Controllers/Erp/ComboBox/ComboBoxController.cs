using System.Collections.Generic;
using System.Threading.Tasks;
using Commerce.Application.Interfaces;
using Domain.Models.Generic.ComboBox.Branch;
using Domain.Models.Generic.ComboBox.Condition;
using Domain.Models.Generic.ComboBox.Product;
using Domain.Models.Generic.ComboBox.Supplier;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers.Erp.ComboBox
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ComboBoxController : ControllerBase
    {
        private readonly IComboService _comboService;

        public ComboBoxController(IComboService comboService)
        {
            _comboService = comboService;
        }

        /// <summary>
        /// Retorna as filiais ativas cadastradas no sistema.
        /// </summary>
        [HttpGet("Branches")]
        public async Task<ActionResult<List<BranchInCombo>>> GetBranchesAsync()
            => Ok(await _comboService.GetBranchesAsync());

        /// <summary>
        /// Retorna fornecedores ativos vinculados a produtos ativos.
        /// </summary>
        [HttpGet("ProductSuppliers")]
        public async Task<ActionResult<List<SupplierInCombo>>> GetProductSuppliersAsync()
            => Ok(await _comboService.GetProductSuppliersAsync());

        /// <summary>
        /// Retorna produtos ativos cadastrados no sistema.
        /// </summary>
        [HttpGet("Products")]
        public async Task<ActionResult<List<ProductInCombo>>> GetProductsAsync([FromQuery] int? supplierId)
            => Ok(await _comboService.GetProductsAsync(supplierId));

        /// <summary>
        /// Retorna condições de venda ativas para uma filial.
        /// </summary>
        [HttpGet("SalesCondition")]
        public async Task<ActionResult<List<SalesConditionInCombo>>> GetSalesConditionsAsync([FromQuery] int? branchId)
            => Ok(await _comboService.GetSalesConditionsAsync(branchId));
    }
}
