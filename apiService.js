const fs = require("fs").promises;
const utils = require("./utils");

exports.BASE_URL = "https://api.fastforex.io";

exports.apiRoutes = {
  historical: "/historical?",
  currencies: "/currencies?",
};

exports.useConvertionsCache = async (
  date,
  baseCurrency,
  amount,
  targetCurrency
) => {
  const data = await utils.getFileData("./cache.json", {});

  if (!(date in data)) return;

  if (!(baseCurrency in data[date])) return;

  if (!(targetCurrency in data[date][baseCurrency])) return;

  const convertedAmount = Number(
    (amount * data[date][baseCurrency][targetCurrency]).toFixed(2)
  );
  return convertedAmount;
};

exports.getResponse = async (date, baseCurrency, amount, targetCurrency) => {
  try {
    const apiKey = await utils.getApiKey();

    const response = await fetch(
      this.BASE_URL +
        this.apiRoutes.historical +
        `date=${date}&from=${baseCurrency}&api_key=${apiKey}`
    );
    const data = await response.json();

    const convertedAmount = Number(
      (amount * data["results"][targetCurrency]).toFixed(2)
    );

    await cacheResponse(
      date,
      baseCurrency,
      targetCurrency,
      data["results"][targetCurrency]
    );

    return convertedAmount;
  } catch (err) {
    console.error(err);
  }
};

const cacheResponse = async (
  date,
  baseCurrency,
  targetCurrency,
  exchangeRate
) => {
  const data = await utils.getFileData("./cache.json", {});

  if (!data[date]) data[date] = {};

  if (!(baseCurrency in data[date])) data[date][baseCurrency] = {};

  if (!(targetCurrency in data[date][baseCurrency]))
    data[date][baseCurrency][targetCurrency] = exchangeRate;

  await fs.writeFile("./cache.json", JSON.stringify(data));
};

exports.cacheCurrency = async (currencies) => {
  await fs.writeFile("./currencies.json", JSON.stringify(currencies));
};

exports.saveResponse = async (
  date,
  amount,
  baseCurrency,
  targetCurrency,
  convertedAmount
) => {
  const data = await utils.getFileData("./conversions.json", []);

  data.push({
    date: date,
    amount: amount,
    base_currency: baseCurrency,
    target_currency: targetCurrency,
    converted_amount: convertedAmount,
  });

  await fs.writeFile("./conversions.json", JSON.stringify(data));
};

exports.updateCurrenciesFile = async () => {
  try {
    const response = await fetch(
      apiService.BASE_URL +
        apiService.apiRoutes.currencies +
        `api_key=${await utils.getApiKey()}`
    );
    const data = await response.json();

    await apiService.cacheCurrency(Object.keys(data.currencies));
  } catch (err) {
    console.error(err);
  }
};
