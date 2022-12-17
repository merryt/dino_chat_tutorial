import { config } from "https://deno.land/std/dotenv/mod.ts";

const configData = await config();
const name = configData["NAME"];

console.log(name)