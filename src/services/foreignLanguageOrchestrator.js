import { translateContentToForeignLanguage } from "./foreignLanguageTranslationEngine";
import { findForeignLanguageConfig } from "@/data/foreignLanguageSubjects";

/**
 * foreignLanguageOrchestrator.js
 * Lớp điều phối đứng giữa route.js và foreignLanguageTranslationEngine.js - đúng vai trò
 * examOrchestrator.js/outlineOrchestrator.js: tra cứu cấu hình ngôn ngữ theo môn học (danh bạ
 * foreignLanguageSubjects.js) rồi mới gọi engine, để route.js không cần biết chi tiết danh bạ.
 */
export async function orchestrateForeignLanguageTranslation({ subject, contentKindLabel, data }) {
  const languageConfig = findForeignLanguageConfig(subject);
  if (!languageConfig) {
    throw new Error(`Môn học "${subject}" chưa hỗ trợ xuất bản ngoại ngữ.`);
  }
  if (!data || typeof data !== "object") {
    throw new Error("Thiếu nội dung cần dịch (data).");
  }

  const { translated, quotaExhausted, serverOverloaded, error } = await translateContentToForeignLanguage({
    data,
    languageNameEn: languageConfig.languageNameEn,
    contentKindLabel,
  });

  return { translated, languageConfig, quotaExhausted, serverOverloaded, error };
}
