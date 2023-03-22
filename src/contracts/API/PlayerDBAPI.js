const axios = require("axios");
const config = require("../../../config.json");

async function getUUID(username) {
  try {
    const { data } = await axios.get(
      `${config.minecraft.API.playerDBAPI}/${username}`
    );

    if (data.success === false || data.error === true) {
      throw data.message == "Mojang API lookup failed."
        ? "Invalid username."
        : data.message;
    }

    if (data.data?.player?.raw_id === undefined) {
      // eslint-disable-next-line no-throw-literal
      throw "No UUID found for that username.";
    }

    return data.data.player.raw_id;
  } catch (error) {
    throw error?.response?.data?.message == "Mojang API lookup failed."
      ? "Invalid username."
      : error?.response?.data?.message;
  }
}

async function getUsername(uuid) {
  try {
    const response = await axios.get(
      `${config.minecraft.API.playerDBAPI}/${uuid}`
    );
    return response.data.data.player.username;
  } catch (error) {
    console.log(error);
  }
}

async function resolveUsernameOrUUID(username) {
  try {
    const { data } = await axios.get(
      `${config.minecraft.API.playerDBAPI}/${username}`
    );

    if (data.success === false || data.error === true) {
      throw data.message == "La recherche de l'API Mojang a échoué."
        ? "Nom d'utilisateur invalide."
        : data.message;
    }

    if (data.data?.player?.raw_id === undefined) {
      // eslint-disable-next-line no-throw-literal
      throw "Aucun UUID trouvé pour ce nom d'utilisateur.";
    }

    return { username: data.data.player.username, uuid: data.data.player.raw_id };
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getUUID, getUsername, resolveUsernameOrUUID };