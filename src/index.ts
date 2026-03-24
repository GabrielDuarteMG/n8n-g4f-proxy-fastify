import dotenv from "dotenv";

dotenv.config();

const { createApp } = await import("./app.js");

const app = createApp();
app.listen({ port: 12343, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
