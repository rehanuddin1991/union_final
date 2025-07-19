-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `holding_information` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `headName` VARCHAR(191) NOT NULL,
    `ward` INTEGER NOT NULL,
    `holdingNo` VARCHAR(191) NOT NULL,
    `father` VARCHAR(191) NOT NULL,
    `mother` VARCHAR(191) NOT NULL,
    `nid` VARCHAR(191) NOT NULL,
    `mobile` VARCHAR(191) NOT NULL,
    `dob` DATETIME(3) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL DEFAULT 'MALE',
    `occupation` VARCHAR(191) NOT NULL,
    `maleMembers` INTEGER NOT NULL,
    `femaleMembers` INTEGER NOT NULL,
    `othersMembers` INTEGER NOT NULL,
    `maleBaby` INTEGER NOT NULL,
    `femaleBaby` INTEGER NOT NULL,
    `othersBaby` INTEGER NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `area` VARCHAR(191) NOT NULL,
    `multiStoriedRoom` INTEGER NOT NULL,
    `buildingRoom` INTEGER NOT NULL,
    `semiBuildingRoom` INTEGER NOT NULL,
    `ownHouseRent` INTEGER NOT NULL,
    `othersRent` INTEGER NOT NULL,
    `imposedTax` INTEGER NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `holding_information_nid_key`(`nid`),
    UNIQUE INDEX `holding_information_ward_holdingNo_key`(`ward`, `holdingNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `holdingcollection` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `holdingInformationId` INTEGER NOT NULL,
    `holdingNumber` VARCHAR(191) NOT NULL,
    `fiscalYear` ENUM('Y2022_2023', 'Y2023_2024', 'Y2024_2025', 'Y2025_2026', 'Y2026_2027', 'Y2027_2028', 'Y2028_2029', 'Y2029_2030', 'Y2031_2032', 'Y2032_2033', 'Y2033_2034', 'Y2034_2035') NOT NULL DEFAULT 'Y2025_2026',
    `amount` INTEGER NOT NULL,
    `paymentDate` DATETIME(3) NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `holdingcollection_holdingInformationId_idx`(`holdingInformationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employees` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `mobile` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `order` INTEGER NOT NULL DEFAULT 1,
    `designation` ENUM('OFFICER_IN_CHARGE', 'CHAIRMAN', 'ADMINISTRATIVE_OFFICER', 'ACCOUNTANT_COMPUTER_OPERATOR') NOT NULL DEFAULT 'CHAIRMAN',
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `officesettings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `union_name` VARCHAR(191) NULL,
    `upazila` VARCHAR(191) NULL,
    `district` VARCHAR(191) NULL,
    `letter_count` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `sarok_no` VARCHAR(191) NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `certificate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `applicantName` VARCHAR(191) NOT NULL,
    `fatherName` VARCHAR(191) NULL,
    `motherName` VARCHAR(191) NULL,
    `spouse` VARCHAR(191) NULL,
    `birth_no` VARCHAR(191) NULL,
    `trade_name` VARCHAR(191) NULL,
    `trade_address` VARCHAR(191) NULL,
    `trade_fee` VARCHAR(191) NULL,
    `trade_capital_tax` VARCHAR(191) NULL,
    `trade_due` VARCHAR(191) NULL,
    `trade_vat` VARCHAR(191) NULL,
    `trade_total_tax` VARCHAR(191) NULL,
    `trade_type` VARCHAR(191) NULL,
    `fiscalYear` ENUM('Y2022_2023', 'Y2023_2024', 'Y2024_2025', 'Y2025_2026', 'Y2026_2027', 'Y2027_2028', 'Y2028_2029', 'Y2029_2030', 'Y2031_2032', 'Y2032_2033', 'Y2033_2034', 'Y2034_2035') NOT NULL DEFAULT 'Y2025_2026',
    `fiscalYearEnd` ENUM('Y2022_2023', 'Y2023_2024', 'Y2024_2025', 'Y2025_2026', 'Y2026_2027', 'Y2027_2028', 'Y2028_2029', 'Y2029_2030', 'Y2031_2032', 'Y2032_2033', 'Y2033_2034', 'Y2034_2035') NOT NULL DEFAULT 'Y2025_2026',
    `birthDate` DATETIME(3) NULL,
    `address` VARCHAR(191) NULL,
    `nid` VARCHAR(191) NULL,
    `ward` VARCHAR(191) NULL,
    `mouza` VARCHAR(191) NULL,
    `post_office` VARCHAR(191) NULL,
    `holding_no` VARCHAR(191) NULL,
    `letter_count` INTEGER NOT NULL DEFAULT 0,
    `issuedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `notes` TEXT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `holdingcollection` ADD CONSTRAINT `holdingcollection_holdingInformationId_fkey` FOREIGN KEY (`holdingInformationId`) REFERENCES `holding_information`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
