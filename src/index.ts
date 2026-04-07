import "./env.js";
import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? "12343");
const app = createApp();
app.listen({ port, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
