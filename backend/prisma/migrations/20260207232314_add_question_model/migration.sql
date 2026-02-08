-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "subtopic_id" TEXT NOT NULL,
    "question_type_id" TEXT,
    "question_text" TEXT NOT NULL,
    "options" JSONB,
    "correct_answer" TEXT,
    "points" INTEGER NOT NULL DEFAULT 1,
    "order_index" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "questions_subtopic_id_idx" ON "questions"("subtopic_id");

-- CreateIndex
CREATE INDEX "questions_order_index_idx" ON "questions"("order_index");

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_subtopic_id_fkey" FOREIGN KEY ("subtopic_id") REFERENCES "subtopics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
