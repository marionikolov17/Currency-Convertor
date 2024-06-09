const utils = require("./utils");
const apiService = require("./apiService");

const checkCurrenciesFile = async () => {
  const data = await utils.getFileData("./currencies.json", []);

  if (data.length === 0) return false;
  return true
}

const checkCacheCurrency = async (currency) => {
  const currencies = await utils.getFileData("./currencies.json", []);

  if (currencies.length === 0) return false;

  if (currencies.includes(currency)) return true;

  return false;
};

exports.checkCurrency = async (currency) => {
  if (await checkCurrenciesFile()) {
    if (await checkCacheCurrency(currency.toUpperCase())) return true;
    return false;
  }
  
  await apiService.updateCurrenciesFile();
  if (await checkCacheCurrency(currency.toUpperCase())) return true;
  return false;
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

  // Check if date exsists
  if (new Date(date) == "Invalid Date") {
    throw new Error("You must specify valid date format - e.g '2024-05-12'!");
  }

  return true;
};
