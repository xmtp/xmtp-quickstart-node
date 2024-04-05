//Import libraries
import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "ethers";
import fs from "fs";
import path from "path";
let wallet = null;
let xmtp = null;

//Initialize the wallet
async function initialize_the_wallet_from_key() {
  // You'll want to replace this with a wallet from your application
  wallet = new Wallet("");
  console.log(`Wallet address: ${wallet.address}`);
}

// Create a client
async function create_a_client() {
  if (!wallet) {
    console.log("Wallet is not initialized");
    return;
  }

  xmtp = await Client.create(wallet, { env: "production" });
  console.log("Client created", xmtp.address);
}

// Stream all messages from all conversations and extract conversations with messages from both parties
async function extract_conversations_with_both_parties() {
  if (!xmtp) {
    console.log("XMTP client is not initialized");
    return;
  }

  const conversations = await xmtp.conversations.list();
  console.log(conversations.length, "conversations found");
  const conversationsWithBothParties = [];
  let csvContent = "Peer Address\n"; // CSV header

  let i = 0;
  for (const conversation of conversations) {
    if (i % 10 == 0)
      console.log(
        i,
        "of",
        conversations.length,
        conversationsWithBothParties.length,
      );
    i++;
    const messages = await conversation.messages();
    const hasSenderMessage = messages.some(
      (message) => message.senderAddress === wallet.address,
    );
    const hasReceiverMessage = messages.some(
      (message) => message.senderAddress === conversation.peerAddress,
    );

    if (hasSenderMessage && hasReceiverMessage) {
      conversationsWithBothParties.push(conversation.peerAddress);
      //console.log(conversation.peerAddress);
      csvContent += `${conversation.peerAddress}\n`;
    }
  }

  // Ensure the data structure is correct for CSV writing
  console.log("Data to be written:", conversationsWithBothParties);
  // Write the CSV content to a file named 'conversations.csv' in the current folder
  fs.writeFile("conversations.csv", csvContent, (err) => {
    if (err) {
      console.error("Error writing CSV file:", err);
    } else {
      console.log("The CSV file was written successfully");
    }
  });
  return conversationsWithBothParties;
}

// Run the function to extract conversations

// Run the functions
await initialize_the_wallet_from_key();
await create_a_client();
await extract_conversations_with_both_parties();

//await initialize_the_wallet_from_key_viem();
//await initialize_the_wallet();
//await start_a_new_conversation();
//await send_a_message();
//await stream_all_messages()
