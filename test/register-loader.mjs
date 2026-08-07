// Preload này được nạp qua `node --import ./test/register-loader.mjs` trong script "test"
// của package.json, chỉ để bộ test tự chạy (`node --test`) hiểu được alias "@/..." mà
// jsconfig.json khai báo cho Next.js. Không ảnh hưởng gì tới `next dev`/`next build`.
import { register } from "node:module";

register("./resolve-alias-hooks.mjs", import.meta.url);
