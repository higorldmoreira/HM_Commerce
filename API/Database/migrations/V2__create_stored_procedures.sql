-- ============================================================
-- V2 - Stored Procedures (MySQL 8)
-- Note: ERP-side procedures (stpGet*InCombo, stpGetInvoiceItemDemotes,
--       stpGetSupplierCreditAndDebit, stpPost/PutInvoiceItemDemotes)
--       must be adapted to match the ERP table structure in this MySQL instance.
--       The procedure signatures are preserved exactly; only syntax is converted.
-- ============================================================

DELIMITER //

-- ----------------------------------------------------------------
-- Application-owned: conditionDemotes
-- ----------------------------------------------------------------

DROP PROCEDURE IF EXISTS `stpGetConditionDemotes` //
CREATE PROCEDURE `stpGetConditionDemotes`(
    IN p_branchId    INT,
    IN p_supplierId  INT,
    IN p_conditionId INT
)
BEGIN
    SELECT
        id,
        conditionId,
        supplierId,
        branchId,
        description,
        beginDate,
        endDate,
        creditedAmount,
        debitedAmount,
        allowNegativeBalance,
        returnThresholdPercent,
        isActive,
        registrationDate,
        lastUpdate
    FROM conditionDemotes
    WHERE (p_branchId   IS NULL OR branchId    = p_branchId)
      AND (p_supplierId IS NULL OR supplierId  = p_supplierId)
      AND (p_conditionId IS NULL OR conditionId = p_conditionId)
    ORDER BY registrationDate DESC;
END //

-- ----------------------------------------------------------------

DROP PROCEDURE IF EXISTS `stpPostConditionDemote` //
CREATE PROCEDURE `stpPostConditionDemote`(
    IN p_conditionId            INT,
    IN p_supplierId             INT,
    IN p_branchId               INT,
    IN p_description            VARCHAR(150),
    IN p_beginDate              DATETIME,
    IN p_endDate                DATETIME,
    IN p_creditedAmount         DECIMAL(18,2),
    IN p_debitedAmount          DECIMAL(18,2),
    IN p_allowNegativeBalance   TINYINT(1),
    IN p_returnThresholdPercent DECIMAL(5,2),
    IN p_isActive               TINYINT(1),
    IN p_registrationDate       DATETIME,
    IN p_lastUpdate             DATETIME
)
BEGIN
    -- Return success pendency placeholder
    SELECT 0 AS pendencyId, '' AS pendency;

    INSERT INTO conditionDemotes
        (conditionId, supplierId, branchId, description,
         beginDate, endDate, creditedAmount, debitedAmount,
         allowNegativeBalance, returnThresholdPercent, isActive,
         registrationDate, lastUpdate)
    VALUES
        (p_conditionId, p_supplierId, p_branchId, p_description,
         p_beginDate, p_endDate, p_creditedAmount, IFNULL(p_debitedAmount, 0),
         p_allowNegativeBalance, p_returnThresholdPercent, p_isActive,
         IFNULL(p_registrationDate, NOW()), IFNULL(p_lastUpdate, NOW()));

    SELECT LAST_INSERT_ID() AS id;
END //

-- ----------------------------------------------------------------
-- Application-owned: conditionItemDemotes
-- ----------------------------------------------------------------

DROP PROCEDURE IF EXISTS `stpGetConditionItensDemotes` //
CREATE PROCEDURE `stpGetConditionItensDemotes`(
    IN p_conditionId        INT,
    IN p_supplierId         INT,
    IN p_conditionDemotesId BIGINT
)
BEGIN
    SELECT
        cid.id,
        cid.conditionDemotesId AS conditionDemotesId,
        cid.conditionId,
        NULL                   AS `condition`,   -- join from ERP if available
        cid.supplierId,
        NULL                   AS supplier,       -- join from ERP if available
        cid.productId,
        NULL                   AS product,        -- join from ERP if available
        cid.demotesValue,
        cid.usedCreditAmount,
        cid.registrationDate,
        cid.lastUpdate
    FROM conditionItemDemotes cid
    WHERE (p_conditionId         IS NULL OR cid.conditionId         = p_conditionId)
      AND (p_supplierId          IS NULL OR cid.supplierId          = p_supplierId)
      AND (p_conditionDemotesId  IS NULL OR cid.conditionDemotesId  = p_conditionDemotesId)
    ORDER BY cid.registrationDate DESC;
END //

-- ----------------------------------------------------------------
-- ERP-side stubs: supplier credit/debit movement
-- ADAPT body to match the actual ERP supplier movement table in this MySQL instance.
-- ----------------------------------------------------------------

DROP PROCEDURE IF EXISTS `stpGetSupplierCreditAndDebit` //
CREATE PROCEDURE `stpGetSupplierCreditAndDebit`(
    IN p_branchId       INT,
    IN p_supplierId     INT,
    IN p_movementTypeId SMALLINT
)
BEGIN
    -- TODO: Replace this stub with the actual ERP query
    -- Columns must match the application's MapReader:
    --   id, branchId, branchName, branchNickName, supplierId, supplierName,
    --   supplierNickName, movementTypeId, movementTypeName, movementValue,
    --   depositDate, registrationDate, typistName, observation, lastUpdated
    SELECT
        0            AS id,
        p_branchId   AS branchId,
        ''           AS branchName,
        ''           AS branchNickName,
        p_supplierId AS supplierId,
        ''           AS supplierName,
        ''           AS supplierNickName,
        0            AS movementTypeId,
        ''           AS movementTypeName,
        0.00         AS movementValue,
        NOW()        AS depositDate,
        NOW()        AS registrationDate,
        ''           AS typistName,
        ''           AS observation,
        NOW()        AS lastUpdated
    WHERE 1 = 0; -- stub returns empty result
END //

-- ----------------------------------------------------------------

DROP PROCEDURE IF EXISTS `stpPostSupplierCreditAndDebit` //
CREATE PROCEDURE `stpPostSupplierCreditAndDebit`(
    IN p_branchId       INT,
    IN p_supplierId     INT,
    IN p_movementValue  DECIMAL(18,2),
    IN p_registrationDate DATETIME,
    IN p_depositDate    DATETIME,
    IN p_movementTypeId SMALLINT,
    IN p_typistName     VARCHAR(150),
    IN p_observation    VARCHAR(500)
)
BEGIN
    -- TODO: Replace with actual ERP INSERT logic
    -- Must return: pendencyId (INT), pendency (VARCHAR), then id (BIGINT)
    SELECT 0 AS pendencyId, '' AS pendency;
    SELECT 0 AS id;
END //

-- ----------------------------------------------------------------
-- ERP-side stubs: invoice item demotes
-- ----------------------------------------------------------------

DROP PROCEDURE IF EXISTS `stpGetInvoiceItemDemotes` //
CREATE PROCEDURE `stpGetInvoiceItemDemotes`(
    IN p_branchId     INT,
    IN p_beginDate    DATETIME,
    IN p_endDate      DATETIME,
    IN p_conditionId  VARCHAR(200),
    IN p_stateAcronym VARCHAR(10),
    IN p_supplierId   INT,
    IN p_productId    INT
)
BEGIN
    -- TODO: Replace with actual ERP query
    -- Columns must match InvoiceItemDemotes MapReader
    SELECT
        0 AS branchId, '' AS branchName, '' AS branchNickName,
        0 AS clientId, '' AS clientName, '' AS clientNickName, '' AS clientStateAcronym,
        0 AS supplierId, '' AS supplierName, '' AS supplierNickName,
        NOW() AS invoiceIssueDate, 0 AS invoiceId, '' AS invoiceNumber, '' AS invoiceSeries,
        0 AS productId, '' AS productName,
        0 AS conditionId, '' AS conditionName,
        0.00 AS quantitySold, 0.00 AS SalePrice, 0.00 AS salePriceUnit,
        0.00 AS productCostPrice, 0.00 AS productCostPriceUnit,
        0.00 AS averageCostPriceProduct, 0.00 AS averageCostPriceProductUnit,
        0.00 AS demotesValue, 0.00 AS demotesValueUnit,
        0.00 AS demotesCostValue, 0.00 AS demotesCostValueUnit,
        0.00 AS currentMargin, 0.00 AS currentMarginUnit,
        0.00 AS newMargin, 0.00 AS newMarginUnit,
        0.00 AS supplierBalance
    WHERE 1 = 0; -- stub returns empty result
END //

-- ----------------------------------------------------------------

DROP PROCEDURE IF EXISTS `stpPutInvoiceItemDemotes` //
CREATE PROCEDURE `stpPutInvoiceItemDemotes`(
    IN p_invoiceId               INT,
    IN p_productId               INT,
    IN p_demotesValue            DECIMAL(18,2),
    IN p_supplierCreditAndDebitId BIGINT
)
BEGIN
    -- TODO: Replace with actual ERP UPDATE logic
    SELECT 0 AS pendencyId, '' AS pendency;
    SELECT 0 AS id;
END //

-- ----------------------------------------------------------------
-- ERP-side stubs: combo box lookups
-- ----------------------------------------------------------------

DROP PROCEDURE IF EXISTS `stpGetBranchInCombo` //
CREATE PROCEDURE `stpGetBranchInCombo`()
BEGIN
    -- TODO: Replace with actual ERP query
    -- Columns: id, branchId, branch, branchNickName
    SELECT 0 AS id, 0 AS branchId, '' AS branch, '' AS branchNickName WHERE 1 = 0;
END //

-- ----------------------------------------------------------------

DROP PROCEDURE IF EXISTS `stpGetProductInCombo` //
CREATE PROCEDURE `stpGetProductInCombo`(IN p_supplierId INT)
BEGIN
    -- TODO: Replace with actual ERP query
    -- Columns: id, productId, product
    SELECT 0 AS id, 0 AS productId, '' AS product WHERE 1 = 0;
END //

-- ----------------------------------------------------------------

DROP PROCEDURE IF EXISTS `stpGetSalesConditionInCombo` //
CREATE PROCEDURE `stpGetSalesConditionInCombo`(IN p_branchId INT)
BEGIN
    -- TODO: Replace with actual ERP query
    -- Columns: id, condition
    SELECT 0 AS id, '' AS `condition` WHERE 1 = 0;
END //

-- ----------------------------------------------------------------

DROP PROCEDURE IF EXISTS `stpGetProductSupplierInCombo` //
CREATE PROCEDURE `stpGetProductSupplierInCombo`()
BEGIN
    -- TODO: Replace with actual ERP query
    -- Columns: id, supplierId, supplier, supplierNickName
    SELECT 0 AS id, 0 AS supplierId, '' AS supplier, '' AS supplierNickName WHERE 1 = 0;
END //

DELIMITER ;
