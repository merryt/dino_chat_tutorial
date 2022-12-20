import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { v4 } from "https://deno.land/std@0.91.0/uuid/mod.ts";
import { Database, SQLite3Connector } from 'https://deno.land/x/denodb/mod.ts';
import { User } from "./usersModels.ts"

const connector = new SQLite3Connector({
  filepath: './db.sqlite',
});

const db = new Database(connector);




const app = new Application();
const port = 8001;
const router = new Router()

router.get("/",(ctx) => {
    ctx.response.body = 'Homepage';
});

app.use(router.routes());
app.use(router.allowedMethods());
app.use(async (context) =>{
    await context.send({
        root: `${Deno.cwd()}/`,
        index: "public/index.html"
    });
});


console.log(`listening on port ${port}`)
await app.listen({port})
