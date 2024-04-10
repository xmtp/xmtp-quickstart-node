// Import necessary libraries
import { Wallet } from "ethers";
import { Client } from "@xmtp/xmtp-js";
import fs from "fs/promises";
const BOT_ADDRESS = "0x63c6b4cCfAe480e278B64639B69e63AD4a0d0735";

async function walletExists() {
  try {
    await fs.access("wallets.csv");
    return true;
  } catch {
    return false;
  }
}

async function writeWalletsToCSV(wallets) {
  const lines = wallets.map((w) => `${w.address},${w.privateKey}`).join("\n");
  await fs.writeFile("wallets.csv", lines + "\n");
}

async function readWalletsFromCSV() {
  const data = await fs.readFile("wallets.csv", "utf8");
  return data
    .split("\n")
    .filter((line) => line)
    .map((line) => {
      const [address, privateKey] = line.split(",");
      return new Wallet(privateKey);
    });
}

async function createWallets(count) {
  let wallets = [];
  for (let i = 0; i < count; i++) {
    wallets.push(Wallet.createRandom());
  }
  await writeWalletsToCSV(wallets);
  return wallets;
}

async function createAndSendMessage(wallet) {
  const xmtp = await Client.create(wallet, { env: "production" });
  const canMessage = await xmtp.canMessage(BOT_ADDRESS);
  if (!canMessage) {
    console.log(`Cannot message ${BOT_ADDRESS} from ${wallet.address}`);
    return;
  }
  const conversation = await xmtp.conversations.newConversation(BOT_ADDRESS);
  await conversation.send("Hello from the bot!");
  for await (const message of await xmtp.conversations.streamAllMessages()) {
    console.log(`Message from ${message.senderAddress}: ${message.content}`);
    break; // Exit after the first message to avoid infinite loop
  }
}

async function main() {
  let wallets;
  if (await walletExists()) {
    wallets = await readWalletsFromCSV();
  } else {
    wallets = await createWallets(100); // Specify the number of wallets you want to create
  }

  await Promise.all(wallets.map((wallet) => createAndSendMessage(wallet)));
  console.log("Operation completed.");
}

main().catch(console.error);
