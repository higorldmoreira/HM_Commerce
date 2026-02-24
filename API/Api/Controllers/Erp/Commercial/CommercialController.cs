using Commerce.Application.Interfaces;
using Domain.Models.ERP.Commercial;
using Domain.Models.Parameters;
using Domain.Models.Validation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Controllers.Erp.Commercial
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CommercialController : ControllerBase
    {
        private readonly ICommercialService _commercialService;

        public CommercialController(ICommercialService commercialService)
        {
            _commercialService = commercialService;
        }

        #region POST

        /// <summary>
        /// Insere dados de movimentação (Débito e Crédito) do Fornecedor para a Filial.
        /// </summary>
        [HttpPost("SupplierMovement")]
        public async Task<ActionResult<List<ValidationResult>>> SupplierMovement([FromBody] List<SupplierMovement> supplierMovement)
        {
            var result = await _commercialService.PostSupplierMovementAsync(supplierMovement);
            return Ok(result);
        }

        /// <summary>
        /// Insere ou atualiza uma condição de rebaixa.
        /// </summary>
        [HttpPost("ConditionDemotes")]
        public async Task<ActionResult<List<ValidationResult>>> PostConditionDemotes([FromBody] List<ConditionDemote> conditionDemotes)
        {
            var results = new List<ValidationResult>();
            foreach (var item in conditionDemotes)
            {
                var result = await _commercialService.PostConditionDemoteAsync(item);
                results.Add(result);
            }
            return Ok(results);
        }

        /// <summary>
        /// Insere ou atualiza itens de condição de rebaixa.
        /// </summary>
        [HttpPost("ConditionItemDemotes")]
        public async Task<ActionResult<List<ValidationResult>>> PostConditionItemDemotes([FromBody] List<ConditionItemDemote> conditionItemDemotes)
        {
            var results = new List<ValidationResult>();
            foreach (var item in conditionItemDemotes)
            {
                var result = await _commercialService.PostConditionItemDemoteAsync(item);
                results.Add(result);
            }
            return Ok(results);
        }

        #endregion

        #region PUT

        /// <summary>
        /// Realiza a rebaixa no título e cria movimentação correspondente na conta do fornecedor.
        /// </summary>
        [HttpPut("Demotes")]
        public async Task<ActionResult<List<ValidationResult>>> Demotes([FromBody] List<InvoiceItemDemotes> invoiceItemDemotes)
        {
            var result = await _commercialService.PutInvoiceItemDemotesAsync(invoiceItemDemotes);
            return Ok(result);
        }

        #endregion

        #region GET

        /// <summary>
        /// Retorna lista de movimentações (Débito e Crédito) do fornecedor para a filial.
        /// </summary>
        [HttpGet("SupplierMovement")]
        public async Task<ActionResult<List<SupplierMovement>>> GetSupplierMovementsAsync([FromQuery] SupplierMovementParameters parameters)
        {
            var result = await _commercialService.GetSupplierMovementsAsync(parameters);
            return Ok(result);
        }

        /// <summary>
        /// Retorna lista agrupada de itens de nota de saída com dados de rebaixa.
        /// </summary>
        [HttpGet("Demotes")]
        public async Task<ActionResult<List<Demotes>>> GetDemotesAsync([FromQuery] DemotesParameters parameters)
        {
            var result = await _commercialService.GetDemotesAsync(parameters);
            return Ok(result);
        }

        /// <summary>
        /// Retorna lista de condições de rebaixa cadastradas.
        /// </summary>
        [HttpGet("ConditionDemotes")]
        public async Task<ActionResult<List<ConditionDemote>>> GetConditionDemotesAsync([FromQuery] ConditionDemoteParameters parameters)
        {
            var result = await _commercialService.GetConditionDemotesAsync(parameters);
            return Ok(result);
        }

        /// <summary>
        /// Retorna lista de itens das condições de rebaixa.
        /// </summary>
        [HttpGet("ConditionItemDemotes")]
        public async Task<ActionResult<List<ConditionItemDemote>>> GetConditionItemDemotesAsync([FromQuery] ConditionItemDemoteParameters parameters)
        {
            var result = await _commercialService.GetConditionItemDemotesAsync(parameters);
            return Ok(result);
        }

        #endregion
    }
}
