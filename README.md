# XMTP Quickstart Node

![xmtp](https://github.com/xmtp/xmtp-quickstart-reactjs/assets/1447073/3f2979ec-4d13-4c3d-bf20-deab3b2ffaa1)

## Installation

```bash
npm install
node demo.js
```

## Concepts

Head to our docs to understand XMTP's concepts

- [Get started](https://xmtp.org/docs/build/get-started/overview?sdk=js)
- [Authentication](https://xmtp.org/docs/build/authentication?sdk=js)
- [Conversations](https://xmtp.org/docs/build/conversations?sdk=js)
- [Messages](https://xmtp.org/docs/build/messages/?sdk=js)
- [Streams](https://xmtp.org/docs/build/streams/?sdk=js)

## Script

```jsx
const ethers = require("ethers");
const { Client } = require("@xmtp/xmtp-js");

async function main() {
  const xmtp = await Client.create(ethers.Wallet.createRandom(), {
    env: "dev",
  });
  const conv = await xmtp.conversations.newConversation("address");
  const message = await conv.send("gm");
  console.log(message);
}
main();
```
