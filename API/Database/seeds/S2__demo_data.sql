-- Demo conditionDemotes row (remove before production)
INSERT IGNORE INTO `conditionDemotes`
    (conditionId, supplierId, branchId, description,
     beginDate, endDate, creditedAmount, debitedAmount,
     allowNegativeBalance, returnThresholdPercent, isActive)
VALUES
    (1, 1, 1, 'Demo rebaixa fornecedor XYZ',
     '2024-01-01 00:00:00', '2024-12-31 23:59:59', 10000.00, 0.00,
     0, 5.00, 1);

-- Demo conditionItemDemotes row
INSERT IGNORE INTO `conditionItemDemotes`
    (conditionDemotesId, conditionId, supplierId, productId, demotesValue, usedCreditAmount)
VALUES
    (1, 1, 1, 100, 250.00, 0.00);
