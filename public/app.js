// deno-lint-ignore-file no-case-declarations
console.log("test")

const myUsername = prompt("Please enter your name?") || "Anonomous";

const socket = new WebSocket(`ws://localhost:8080/start_web_socket?username=${myUsername}`)

socket.onmessage = (m) => {
    const data = JSON.parse(m.data);

    switch (data.event) {
        case "update-users":
            let userListHtml = ""
            for (const username of data.usernames) {
                userListHtml += `<div>${username} </div>`
            }
            document.getElementById("users").innerHTML = userListHtml;
            break;
        case "send-message":
            // display new chat message
            addMessage(data.username, data.message);
            break;
        default:
            console.log("shrug")
    }
}

function addMessage(username, message) {
    document.getElementById("conversation").innerHTML += `<b> ${username} </b>: ${message}<br />`
}

// on page load
window.onload = () => {
    document.getElementById("data").addEventListener("keypress", (e) => {
        if (e.key == "Enter") {
            const inputElement = document.getElementById("data");
            const message = inputElement.value;
            inputElement.value = ""
            console.log("sending message: " + message)
            socket.send(JSON.stringify({
                event: "send-message",
                message: message
            }))
        }
    })
}