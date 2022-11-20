/*
  Warnings:

  - Added the required column `createdById` to the `Assignment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN   "createdById" INTEGER ;


update "Assignment" set "createdById" = (select id from "User");
-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
Alter TABLE "Assignment" ALTER COLUMN "createdById" SET NOT NULL;
