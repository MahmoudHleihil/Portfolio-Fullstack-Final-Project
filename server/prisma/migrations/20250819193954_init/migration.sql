/*
  Warnings:

  - You are about to drop the column `content` on the `Blog` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Education` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Education` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Experience` table. All the data in the column will be lost.
  - You are about to drop the `ProjectSkill` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Blog` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contentHtml` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProjectSkill" DROP CONSTRAINT "ProjectSkill_projectId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectSkill" DROP CONSTRAINT "ProjectSkill_skillId_fkey";

-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "content",
ADD COLUMN     "contentHtml" TEXT NOT NULL,
ADD COLUMN     "coverUrl" TEXT,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Certification" ADD COLUMN     "credentialUrl" TEXT,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "organization" DROP NOT NULL,
ALTER COLUMN "dateIssued" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ContactMessage" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'new',
ADD COLUMN     "subject" TEXT;

-- AlterTable
ALTER TABLE "Education" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "degree" TEXT,
ADD COLUMN     "field" TEXT,
ADD COLUMN     "institution" TEXT,
ALTER COLUMN "startDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Experience" DROP COLUMN "title",
ADD COLUMN     "company" TEXT,
ADD COLUMN     "isCurrent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "roleTitle" TEXT,
ALTER COLUMN "startDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "kind" TEXT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "summary" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "youtubeEmbed" TEXT;

-- AlterTable
ALTER TABLE "ProjectImage" ADD COLUMN     "orderIndex" INTEGER;

-- AlterTable
ALTER TABLE "Skill" ADD COLUMN     "level" INTEGER;

-- DropTable
DROP TABLE "ProjectSkill";

-- CreateTable
CREATE TABLE "ProjectSkills" (
    "projectId" INTEGER NOT NULL,
    "skillId" INTEGER NOT NULL,

    CONSTRAINT "ProjectSkills_pkey" PRIMARY KEY ("projectId","skillId")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "authorName" TEXT,
    "authorEmail" TEXT,
    "content" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Blog_slug_key" ON "Blog"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- AddForeignKey
ALTER TABLE "ProjectSkills" ADD CONSTRAINT "ProjectSkills_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectSkills" ADD CONSTRAINT "ProjectSkills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Blog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
