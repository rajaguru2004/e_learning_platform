-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "is_locked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "review_note" TEXT,
ADD COLUMN     "reviewed_at" TIMESTAMP(3),
ADD COLUMN     "reviewed_by" TEXT;

-- CreateIndex
CREATE INDEX "courses_reviewed_by_idx" ON "courses"("reviewed_by");

-- CreateIndex
CREATE INDEX "courses_is_locked_idx" ON "courses"("is_locked");

-- CreateIndex
CREATE INDEX "courses_status_code_instructor_id_idx" ON "courses"("status_code", "instructor_id");

-- CreateIndex
CREATE INDEX "courses_status_code_is_active_idx" ON "courses"("status_code", "is_active");

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
