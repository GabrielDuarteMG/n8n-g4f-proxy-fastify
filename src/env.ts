try {
  process.loadEnvFile();
} catch (err: unknown) {
  const code =
    err && typeof err === "object" && "code" in err
      ? (err as NodeJS.ErrnoException).code
      : undefined;
  if (code !== "ENOENT") throw err;
}
