/*
  Warnings:

  - A unique constraint covering the columns `[CustomerId]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "CustomerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_CustomerId_key" ON "public"."user"("CustomerId");
