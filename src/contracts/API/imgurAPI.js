const config = require("../../../config.json");
const { ImgurClient } = require("imgur");

const imgurClient = new ImgurClient({
  clientId: config.minecraft.API.imgurAPIkey,
});

async function uploadImage(image) {
  const response = await imgurClient.upload({
    image: image,
    type: "stream",
  });

  if (response.success === false) {
    // eslint-disable-next-line no-throw-literal
    throw "Une erreur s'est produite lors du téléchargement de l'image. Veuillez réessayer plus tard.";
  }

  return response;
}

module.exports = { uploadImage };
