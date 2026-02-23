-- ============================================================
-- V1 - Create application-owned tables
-- Database: rx (MySQL 8)
-- ============================================================

CREATE TABLE IF NOT EXISTS `users` (
    `id`       INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(150)  NOT NULL,
    `password` VARCHAR(255)  NOT NULL,
    `token`    VARCHAR(512)  NULL,
    UNIQUE KEY `uq_users_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `conditionDemotes` (
    `id`                     BIGINT         NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `conditionId`            INT            NOT NULL,
    `supplierId`             INT            NOT NULL,
    `branchId`               INT            NOT NULL,
    `description`            VARCHAR(150)   NOT NULL,
    `beginDate`              DATETIME       NOT NULL,
    `endDate`                DATETIME       NOT NULL,
    `creditedAmount`         DECIMAL(18,2)  NOT NULL DEFAULT 0,
    `debitedAmount`          DECIMAL(18,2)  NOT NULL DEFAULT 0,
    `allowNegativeBalance`   TINYINT(1)     NOT NULL DEFAULT 0,
    `returnThresholdPercent` DECIMAL(5,2)   NOT NULL DEFAULT 0,
    `isActive`               TINYINT(1)     NOT NULL DEFAULT 1,
    `registrationDate`       DATETIME       NOT NULL DEFAULT (NOW()),
    `lastUpdate`             DATETIME       NOT NULL DEFAULT (NOW()) ON UPDATE NOW(),
    UNIQUE KEY `uq_conditionDemotes_description` (`description`),
    INDEX `idx_conditionDemotes_active` (`conditionId`, `supplierId`, `branchId`, `isActive`, `endDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `conditionItemDemotes` (
    `id`                 BIGINT        NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `conditionDemotesId` BIGINT        NOT NULL,
    `conditionId`        INT           NOT NULL,
    `supplierId`         INT           NOT NULL,
    `productId`          INT           NOT NULL,
    `demotesValue`       DECIMAL(18,2) NOT NULL DEFAULT 0,
    `usedCreditAmount`   DECIMAL(18,2) NOT NULL DEFAULT 0,
    `registrationDate`   DATETIME      NOT NULL DEFAULT (NOW()),
    `lastUpdate`         DATETIME      NOT NULL DEFAULT (NOW()) ON UPDATE NOW(),
    CONSTRAINT `fk_conditionItemDemotes_conditionDemotesId`
        FOREIGN KEY (`conditionDemotesId`) REFERENCES `conditionDemotes`(`id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_conditionItemDemotes_condition` (`conditionId`, `supplierId`),
    INDEX `idx_conditionItemDemotes_product` (`productId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
