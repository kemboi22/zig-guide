import { defineEventHandler, readBody, createError } from "h3";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { writeFile, unlink } from "node:fs/promises";
import path from "node:path";

const execFileAsync = promisify(execFile);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const code = typeof body?.code === "string" ? body.code : "";

  if (!code.trim()) {
    throw createError({ statusCode: 400, statusMessage: "Code is required" });
  }

  const id = crypto.randomUUID();
  const filePath = path.join("/tmp", `zig-run-${id}.zig`);
  await writeFile(filePath, code);

  try {
    const { stdout, stderr } = await execFileAsync(
      "zig",
      ["run", filePath],
      { timeout: 10000, maxBuffer: 1024 * 1024 },
    );
    return { stdout, stderr, exitCode: 0 };
  } catch (error: any) {
    return {
      stdout: error.stdout || "",
      stderr: error.stderr || error.message || "Unknown error",
      exitCode: error.code || 1,
    };
  } finally {
    await unlink(filePath).catch(() => {});
  }
});
