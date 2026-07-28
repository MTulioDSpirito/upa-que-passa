-- CreateIndex
CREATE INDEX "Comment_gameId_idx" ON "Comment"("gameId");

-- CreateIndex
CREATE INDEX "CommentReaction_commentId_idx" ON "CommentReaction"("commentId");
