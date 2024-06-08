const fs = require("fs").promises;
const utils = require("./utils");
const apiService = require("./apiService");

const checkCacheCurrency = async (currency) => {
  let currencies = [];
  // Check if there are any cached currencies
  try {
    await fs.stat("./currencies.json");

    currencies = JSON.parse(await fs.readFile("./currencies.json"));
  } catch (err) {
    return false;
  }

  if (currencies.includes(currency)) {
    return true;
  }

  return false;
};

exports.checkCurrency = async (currency) => {
  if (await checkCacheCurrency(currency.toUpperCase())) {
    return true;
  }

  try {
    const response = await fetch(
      apiService.BASE_URL + apiService.apiRoutes.currencies + `api_key=${await utils.getApiKey()}`
    );
    const data = await response.json();

    if (Object.keys(data.currencies).includes(currency.toUpperCase())) {
      await apiService.cacheCurrency(currency.toUpperCase());
      return true;
    }

    return false;
  } catch (err) {
    console.error(err);
  }
};

exports.checkInputDate = (date) => {
  const dateRegex = /[0-9]{4}-[0-9]{2}-[0-9]{2}/g;

  // Check if there is command line argument
  if (process.argv.length === 2) {
    throw new Error("You must specify date!");
  }

  // Check if command line argument is correct type
  if (!dateRegex.test(date)) {
    throw new Error("You must specify valid date format - e.g '2024-05-12'!");
  }

  if(new Date(date) == "Invalid Date") {
    throw new Error("You must specify valid date format - e.g '2024-05-12'!")
  }

  return true;
};
