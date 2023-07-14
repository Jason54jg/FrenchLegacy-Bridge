async function chalk() {
  return (await import("chalk")).default;
}

async function discordMessage(message) {
  return console.log(
    (await chalk()).bgMagenta.black(`[${await getCurrentTime()}] Discord >`) +
      " " +
      (await chalk()).magenta(message)
  );
}

async function minecraftMessage(message) {
  return console.log(
    (await chalk()).bgGreenBright.black(
      `[${await getCurrentTime()}] Minecraft >`
    ) +
      " " +
      (await chalk()).greenBright(message)
  );
}

async function warnMessage(message) {
  return console.log(
    (await chalk()).bgYellow.black(`[${await getCurrentTime()}] Warning >`) +
      " " +
      (await chalk()).yellow(message)
  );
}

async function errorMessage(message) {
  return console.log(
    (await chalk()).bgRedBright.black(`[${await getCurrentTime()}] Error >`) +
      " " +
      (await chalk()).redBright(message)
  );
}

async function broadcastMessage(message, location) {
  return console.log(
    (await chalk()).inverse(
      `[${await getCurrentTime()}] ${location} Broadcast >`
    ) +
      " " +
      message
  );
}

async function getCurrentTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

module.exports = {
  discordMessage,
  minecraftMessage,
  warnMessage,
  errorMessage,
  broadcastMessage,
  getCurrentTime,
};
