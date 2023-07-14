//import fetch from "node-fetch";
const { rejects } = require("assert");
const https = require("https");

function get_page(page) {
  return new Promise((resolve, rejects) => {
    setTimeout(() => {
      https
        .get(page, (resp) => {
          let data = "";

          // A chunk of data has been received.
          resp.on("data", (chunk) => {
            data += chunk;
          });

          // The whole response has been received. Print out the result.
          resp.on("end", () => {
            resolve(JSON.parse(data));
          });
        })
        .on("error", (err) => {
          rejects("Error: " + err.message);
        });
    }, 0);
  });
}
module.exports = { get_page };
