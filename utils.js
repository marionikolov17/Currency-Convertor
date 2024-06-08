const { checkInputDate } = require("./validators");

const fs = require("fs").promises;

exports.getApiKey = async () => {
  try {
    const config = JSON.parse(await fs.readFile("./config.json", "utf-8"));

    return config["API_KEY"];
  } catch (err) {
    console.log(err);
  }
};

exports.getFileData = async (fileName, initData) => {
    let data;
    
    try {
        await fs.stat(fileName);

        data = JSON.parse(await fs.readFile(fileName));
    } catch (err) {
        data = initData;
    }

    return data;
}

exports.getDate = () => {
    let date = process.argv[2];

    if (checkInputDate(date)) {
        return date;
    }

    process.exit(1);
}