const jsf = require('json-schema-faker');
const faker = require('faker');
const moment = require('moment');
const fs = require('fs');
const mockDataSchema = require('./mockDataSchema');

jsf.extend('faker', () => {
  faker.custom = {
    dateFromPastYear: () => moment(faker.date.past()).format('YYYY-MM-DD HH:mm:ss')
  };
  return faker;
});

// Convert mock data to string
const mockData = jsf.generate(mockDataSchema);
const json = JSON.stringify({
  ...mockData,
  ...{
    data: Object.values(mockData.data).map(data => Object.keys(data).reduce((object, key) => ({
        ...object,
        ...{[key]: data[key].toString()}
      }), {})
    )
  }
});

fs.writeFile("./.storybook/mocks/api/search.json", json, err => {
  if (err) return console.log(err);
  console.log("Mock data generated.");
});
