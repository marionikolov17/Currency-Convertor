const fs = require("fs").promises;

const dateRegex = /[0-9]{4}-[0-9]{2}-[0-9]{2}/g;

const getDate = () => {
  // Check if there is command line argument
  if (process.argv.length === 2) {
    throw new Error("You must specify date!");
  }
  let date = process.argv[2];

  // Check if command line argument is correct type
  if (!dateRegex.test(date)) {
    throw new Error("You must specify valid date format - e.g '2024-05-12'!");
  }

  return date;
};

const getApiKey = async () => {
  try {
    const config = JSON.parse(await fs.readFile("./config.json", "utf-8"));

    return config["API_KEY"];
  } catch (err) {
    console.log(err);
  }
};

async function main() {
  const date = getDate();

  const apiKey = await getApiKey();
  console.log(apiKey);
  console.log(date);
}

main();
