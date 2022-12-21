interface User {
    id: string;
    username: string;
}

export const users = new Map<string, User>();

users.set("1", {
    id: "1",
    username: "merryt",
})

users.set("2", {
    id: "2",
    username: "tymerry",
})

interface Message {
    id: string;
    text: string;
    userId: string;
}

export const messages = new Map<string, Message>();

messages.set('1', {
    id: '1',
    text: 'Hello World',
    userId: '1',
});
messages.set('2', {
    id: '2',
    text: 'By World',
    userId: '2',
});

