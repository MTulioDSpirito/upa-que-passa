-- AlterTable
ALTER TABLE "PasswordResetToken" ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false;
