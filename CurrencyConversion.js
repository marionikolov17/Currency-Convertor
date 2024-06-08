const prompt = require("prompt-sync")();

const apiService = require("./apiService");
const validators = require("./validators");
const utils = require("./utils");

async function main() {
  const date = utils.getDate();

  while(true) {
    let amount = prompt();

    // Check for termination
    if (amount.toLowerCase() === "end") break;

    // Validate amount
    while(amount.toString().split(".")[1].length !== 2) {
        console.log("Please enter a valid amount");
        amount = prompt();
    } 

    let baseCurrency = prompt();

    // Check for termination
    if (baseCurrency.toLowerCase() === "end") break;

    // Validate base currency
    while((await validators.checkCurrency(baseCurrency)) !== true) {
        console.log("Please enter a valid currency code");
        baseCurrency = prompt();
    }

    let targetCurrency = prompt();

    // Check for termination
    if (targetCurrency.toLowerCase() === "end") break;

    // Validate target currency
    while((await validators.checkCurrency(targetCurrency)) !== true) {
        console.log("Please enter a valid currency code");
        targetCurrency = prompt();
    }

    let convertedAmount;

    // Try to convert the amount using the cached values
    convertedAmount = await apiService.useConvertionsCache(date, baseCurrency.toUpperCase(), Number(amount), targetCurrency.toUpperCase());

    // Otherwise call the API
    if (!convertedAmount) convertedAmount = await apiService.getResponse(date, baseCurrency.toUpperCase(), Number(amount), targetCurrency.toUpperCase());
    
    await apiService.saveResponse(date, Number(amount), baseCurrency, targetCurrency, convertedAmount);

    break;
  }
}

main();
