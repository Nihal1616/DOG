const express = require("express");
const axios = require("axios");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

const DOG_API = "https://dog.ceo/api";

async function getRandomDogs(count = 25) {
  const res = await axios.get(`${DOG_API}/breeds/image/random/${count}`);
  return res.data.message;
}

async function getBreeds() {
  const res = await axios.get(`${DOG_API}/breeds/list/all`);
  return Object.keys(res.data.message);
}

async function getDogsByBreed(breed, count = 25) {
  const res = await axios.get(`${DOG_API}/breed/${breed}/images/random/${count}`);
  return res.data.message;
}

app.get("/", async (req, res) => {
  const { breed } = req.query;
  const breeds = await getBreeds();
  let images = [];  

  try {
    if (breed && breeds.includes(breed)) {
      images = await getDogsByBreed(breed);
    } else {
      images = await getRandomDogs();
    }
  } catch (error) {
    console.error("Failed to fetch images:", error);
    images = [];  
  }

  res.render("index", { images, breeds, selectedBreed: breed || "" });
});

app.listen(4000, () => {
  console.log("Server running ");
});
