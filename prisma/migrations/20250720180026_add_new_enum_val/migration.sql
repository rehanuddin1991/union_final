-- AlterTable
ALTER TABLE `employees` MODIFY `designation` ENUM('OFFICER_IN_CHARGE', 'CHAIRMAN', 'ADMINISTRATIVE_OFFICER', 'ACCOUNTANT_COMPUTER_OPERATOR', 'UP_MEMBER', 'GRAM_POLICE', 'OTHERS') NOT NULL DEFAULT 'CHAIRMAN';
