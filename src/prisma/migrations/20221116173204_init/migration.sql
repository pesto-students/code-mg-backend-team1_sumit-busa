-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Admin', 'Teacher', 'Student');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "fullName" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "mobile" VARCHAR(15),
    "password" VARCHAR(200),
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assignment" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "problemStatement" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "allowedLanguages" TEXT[],

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestCases" (
    "id" SERIAL NOT NULL,
    "input" TEXT NOT NULL,
    "expectedOutput" TEXT NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestCases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" SERIAL NOT NULL,
    "submission" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    "studentId" INTEGER,
    "result" JSONB,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_assignmentId_studentId_key" ON "Submission"("assignmentId", "studentId");

-- AddForeignKey
ALTER TABLE "TestCases" ADD CONSTRAINT "TestCases_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
