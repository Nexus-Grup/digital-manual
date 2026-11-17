-- CreateEnum
CREATE TYPE "SystemRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "BrandRole" AS ENUM ('EDITOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "CompanyRole" AS ENUM ('MEMBER', 'OWNER');

-- CreateEnum
CREATE TYPE "InformationType" AS ENUM ('FEATURE', 'BENEFIT', 'IMPORTANT', 'SAFETY', 'CARE', 'FUNCTIONALITY');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'MODEL_3D');

-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('ELECTRONICS', 'FURNITURE', 'CLOTHING', 'TOYS', 'FOOD', 'BEAUTY', 'SPORTS', 'AUTOMOTIVE', 'BOOKS', 'MUSIC', 'SOFTWARE', 'OTHER');

-- CreateEnum
CREATE TYPE "AudioType" AS ENUM ('POWER_ON', 'IN_USE');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('USER_MANUAL', 'ASSEMBLY_MANUAL', 'TECHNICAL_DATASHEET', 'INSTALLATION_GUIDE', 'MAINTENANCE_GUIDE', 'WARRANTY_DOCUMENT', 'SAFETY_GUIDE', 'CERTIFICATION');

-- CreateEnum
CREATE TYPE "AssemblyType" AS ENUM ('ASSEMBLY_GUIDE', 'USAGE_GUIDE', 'INSTALLATION_GUIDE', 'MAINTENANCE_GUIDE', 'DISASSEMBLY_GUIDE');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('QR_SCAN', 'MANUAL_VIEW', 'MANUAL_DOWNLOAD', 'PRODUCT_VIEW', 'LANDING_PAGE_VIEW', 'GALLERY_VIEW', 'MODEL_3D_VIEW');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "systemRole" "SystemRole" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,
    "website" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imgUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_companies" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,
    "companyRole" "CompanyRole" NOT NULL DEFAULT 'MEMBER',

    CONSTRAINT "user_companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_brands" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userCompanyId" INTEGER NOT NULL,
    "brandId" INTEGER NOT NULL,
    "brandRole" "BrandRole" NOT NULL DEFAULT 'VIEWER',

    CONSTRAINT "user_brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "model" TEXT,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "imgUrl" TEXT,
    "category" "ProductCategory" NOT NULL DEFAULT 'OTHER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "brandId" INTEGER NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "informations" (
    "id" SERIAL NOT NULL,
    "type" "InformationType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "informations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "information_steps" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "informationId" INTEGER NOT NULL,

    CONSTRAINT "information_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assemblies" (
    "id" SERIAL NOT NULL,
    "type" "AssemblyType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "assemblies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assembly_steps" (
    "id" SERIAL NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assemblyId" INTEGER NOT NULL,

    CONSTRAINT "assembly_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_videos" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "code" TEXT,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "product_videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_audios" (
    "id" SERIAL NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "audioType" "AudioType" NOT NULL DEFAULT 'POWER_ON',
    "productId" INTEGER NOT NULL,

    CONSTRAINT "product_audios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_technical_sheets" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "material" TEXT,
    "dimensions" TEXT,
    "weight" DECIMAL(10,2),
    "specifications" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "product_technical_sheets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manuals" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "language" TEXT,
    "version" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "manuals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_galleries" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "mediaType" "MediaType" NOT NULL,
    "mediaUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "product_galleries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_gallery_images" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageTitle" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "galleryId" INTEGER NOT NULL,

    CONSTRAINT "product_gallery_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_articles" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "product_articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_article_sections" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "product_article_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_article_media" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "product_article_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_analytics_events" (
    "id" SERIAL NOT NULL,
    "eventType" "EventType" NOT NULL,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "product_analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_qr_codes" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "url" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "product_qr_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_userName_key" ON "users"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "brands_companyId_idx" ON "brands"("companyId");

-- CreateIndex
CREATE INDEX "user_companies_companyId_idx" ON "user_companies"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "user_companies_userId_companyId_key" ON "user_companies"("userId", "companyId");

-- CreateIndex
CREATE INDEX "user_brands_brandId_idx" ON "user_brands"("brandId");

-- CreateIndex
CREATE UNIQUE INDEX "user_brands_userCompanyId_brandId_key" ON "user_brands"("userCompanyId", "brandId");

-- CreateIndex
CREATE UNIQUE INDEX "products_code_key" ON "products"("code");

-- CreateIndex
CREATE INDEX "products_brandId_idx" ON "products"("brandId");

-- CreateIndex
CREATE INDEX "products_category_idx" ON "products"("category");

-- CreateIndex
CREATE INDEX "informations_productId_idx" ON "informations"("productId");

-- CreateIndex
CREATE INDEX "information_steps_informationId_idx" ON "information_steps"("informationId");

-- CreateIndex
CREATE INDEX "assemblies_productId_idx" ON "assemblies"("productId");

-- CreateIndex
CREATE INDEX "assembly_steps_assemblyId_idx" ON "assembly_steps"("assemblyId");

-- CreateIndex
CREATE INDEX "product_videos_productId_idx" ON "product_videos"("productId");

-- CreateIndex
CREATE INDEX "product_audios_productId_idx" ON "product_audios"("productId");

-- CreateIndex
CREATE INDEX "product_technical_sheets_productId_idx" ON "product_technical_sheets"("productId");

-- CreateIndex
CREATE INDEX "manuals_productId_idx" ON "manuals"("productId");

-- CreateIndex
CREATE INDEX "product_galleries_productId_idx" ON "product_galleries"("productId");

-- CreateIndex
CREATE INDEX "product_gallery_images_galleryId_idx" ON "product_gallery_images"("galleryId");

-- CreateIndex
CREATE INDEX "product_analytics_events_productId_idx" ON "product_analytics_events"("productId");

-- CreateIndex
CREATE INDEX "product_analytics_events_eventType_idx" ON "product_analytics_events"("eventType");

-- CreateIndex
CREATE INDEX "product_qr_codes_productId_idx" ON "product_qr_codes"("productId");

-- AddForeignKey
ALTER TABLE "brands" ADD CONSTRAINT "brands_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_companies" ADD CONSTRAINT "user_companies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_companies" ADD CONSTRAINT "user_companies_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_brands" ADD CONSTRAINT "user_brands_userCompanyId_fkey" FOREIGN KEY ("userCompanyId") REFERENCES "user_companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_brands" ADD CONSTRAINT "user_brands_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "informations" ADD CONSTRAINT "informations_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "information_steps" ADD CONSTRAINT "information_steps_informationId_fkey" FOREIGN KEY ("informationId") REFERENCES "informations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assemblies" ADD CONSTRAINT "assemblies_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assembly_steps" ADD CONSTRAINT "assembly_steps_assemblyId_fkey" FOREIGN KEY ("assemblyId") REFERENCES "assemblies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_videos" ADD CONSTRAINT "product_videos_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_audios" ADD CONSTRAINT "product_audios_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_technical_sheets" ADD CONSTRAINT "product_technical_sheets_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manuals" ADD CONSTRAINT "manuals_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_galleries" ADD CONSTRAINT "product_galleries_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_gallery_images" ADD CONSTRAINT "product_gallery_images_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "product_galleries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_analytics_events" ADD CONSTRAINT "product_analytics_events_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_qr_codes" ADD CONSTRAINT "product_qr_codes_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
