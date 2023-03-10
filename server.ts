import { Application, Router, helpers } from "https://deno.land/x/oak/mod.ts";
import { v4 } from "https://deno.land/std@0.91.0/uuid/mod.ts";
import { Database, SQLite3Connector } from 'https://deno.land/x/denodb/mod.ts';
import { users, messages } from "./data.ts"

const connector = new SQLite3Connector({
  filepath: './db.sqlite',
});

const db = new Database(connector);



const connectedClients = new Map();

const app = new Application();
const port = 8080;
const router = new Router()

// send broadcast to all connected clients
function broadcast(message:any):void{
    for (const client of connectedClients.values()){
        client.send(message)
    }
}
//   const usernames = [...connectedClients.keys()];

function broadcast_usernames(){
    const usernames = [...connectedClients.keys()];
    console.log(`sending updated list of usernames to all connected clients ${JSON.stringify(usernames)}`)
    broadcast(JSON.stringify({
        event: "update-users",
        usernames: usernames
    }))
}

router.get('/', (ctx) => {ctx.response.body = 'Received a GET HTTP method';});
router.post('/', (ctx) => {ctx.response.body = 'Received a POST HTTP method';});
router.put('/', (ctx) => {ctx.response.body = 'Received a PUT HTTP method';});
router.delete('/', (ctx) => {ctx.response.body = 'Received a DELETE HTTP method';});

router.get('/post/:postId', (ctx) =>{
    ctx.response.body = `returning page for ${ctx.params.postId}`
});

router.get('/users/', (ctx) => {
    console.log(users)
    ctx.response.body = `getting all users`
});

router.post('/users/', async (ctx) => {
    console.log("posting user")
    const id = v4.generate();
    console.log(id)
    // todo, figure out how to curl json
    // current best guess is curl -X POST -H "Content-Type:application/json" http://localhost:8080/users/ -d "{data:'123test'}"
    const { value } = ctx.request.body({ type: 'json' });
    console.log(value)
    const { text } = await value;
    console.log(text)
    users.set(id, {
        id,
        username: text,
    });
    console.log(users)
    ctx.response.body = users.get(id);
});

router.get('/users/:userId', (ctx) => {
    const id = v4.generate();
    const { userId } = helpers.getQuery(ctx, { mergeParams: true });
    ctx.response.body = `GET HTTP method on user/${userId} resource. Users id is ${id}`;
  });
  
router.delete('/users/:userId', (ctx) => {ctx.response.body = `PUT DELETE method on user/${ctx.params.userId} resource`;});


router.get("/start_web_socket", async (ctx) =>{
    const socket = await ctx.upgrade();
    const username = ctx.request.url.searchParams.get("username");
    if (connectedClients.has(username)){
        socket.close(1008, `Username ${username} is already taken`)
        return;
    }
    socket.username = username
    connectedClients.set(username, socket)
    console.log(`new user is ${username}`)
    
    socket.onopen = () =>{
        broadcast_usernames()
    }   

    socket.onclose = () => {
        console.log(`${socket.username} has just disconnected`);
        connectedClients.delete(socket.username);
        broadcast_usernames();
    }

    socket.onmessage = (m) => {
        const data = JSON.parse(m.data);
        switch (data.event) {
          case "send-message":
            broadcast(
              JSON.stringify({
                event: "send-message",
                username: socket.username,
                message: data.message,
              }),
            );
            break;
        }
      };
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
