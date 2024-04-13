import { Client } from "@xmtp/xmtp-js";
import { ethers } from "ethers";
export const broadcastToWallets = async (wallets, message, xmtpClient) => {
  try {
    const uniqueWallets = [...new Set(wallets)];

    const broadcasts_canMessage = await xmtpClient.canMessage(uniqueWallets);

    console.log("broadcasts_canMessage", broadcasts_canMessage);

    const canMessageWallets = uniqueWallets.filter(
      (wallet, index) => broadcasts_canMessage[index],
    );

    console.log("canMessageWallets", canMessageWallets);

    // Collect promises for send operations
    const sendPromises = [];

    for (let i = 0; i < canMessageWallets.length; i++) {
      // Add the promise to the array
      sendPromises.push(
        xmtpClient.conversations
          .newConversation(canMessageWallets[i], {
            conversationId: `${"xmtp"}/${"lens.dev/dm"}-${canMessageWallets[
              i
            ]?.toLowerCase()}`,
            metadata: {},
          })
          .then((conversation) => conversation.send(message))
          .catch((error) => {
            console.error("Error sending message", canMessageWallets[i], error);
          }),
      );
    }

    // Wait for all send operations to finish
    await Promise.all(sendPromises);
  } catch (e) {
    console.error("Error broadcasting to wallets", e);
  }
};

const randomWallet = ethers.Wallet.createRandom();
const randomClient = await Client.create(randomWallet, {
  env: "production",
});

broadcastToWallets(
  ["0x3E4EFc2B2Ee3fCE01433F2E75021eeACd62CA94f"],
  "hi",
  randomClient,
);
