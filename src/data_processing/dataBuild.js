const fs = require('fs');
const path = require('path');
// const rawDataSmall = require('./rawDataSmall.js');
// import { default as data } from './rawDataSmall';

// let data = import issues, just copy/paste json object here


// FILENAMES
const newJsonFilename = 'stationData';
// console.log(data);
// INPUT
const outputJsonDirectory = path.resolve('../assets/data');
const outputJsonFilepath = path.join(outputJsonDirectory, `${newJsonFilename}.json`);

// const outputFolderCreate = new Function();
// if (!fs.existsSync(outputFolder)) {
//   fs.mkdirSync(outputFolder);
// }


// MAP DATA OBJECT TRANSFORMATION
// obj.restricted_access !null used because including null blows up json file size to > 15mb, now json is < 1mb
const mappedData = data.fuel_stations.map((obj) => {
  if (obj.fuel_type_code === "ELEC" && obj.restricted_access === !null) {
    return {
      name: obj.station_name,
      lat: obj.latitude,
      lng: obj.longitude,
      address: obj.street_address,
      city: obj.city,
      state: obj.state,
      zip: obj.zip,
      accessType:obj.access_code,
      accessTime:obj.access_days_time,
      fuelType: obj.fuel_type_code,
      connectorTypes: obj.ev_connector_types,
      owner: 'undefined' ? 'N/A' : getOwner(obj.owner_type_code),
      status: 'undefined' ? 'N/A' : getStatus(obj.status_code),
      network: obj.ev_network,
      pricing: obj.ev_pricing,
    }
  }
})


// truthy check to remove nulls from mapped array
const results =
  mappedData.filter((el) => {
    return el;
  })


// Use enum in code rather than adding long string for json file space reduction
getOwner = (code) => {
  const lowerCode = code.toLowerCase();
  let codeReturn = '';
  switch(code) {
    case 'a':
      codeReturn = 'all';
      break;
    case 'fg':
      codeReturn = 'federal government';
      break;
    case 'j':
      codeReturn = 'jointly';
      break;
    case 'lg':
      codeReturn = 'local government';
      break;
    case 'p':
      codeReturn = 'private';
      break;
    case 'sg':
      codeReturn = 'state goverment';
      break;
    case 't':
      codeReturn = 'utility';
      break;
    default:
      break;
  }
}

// Use enum in code rather than adding long string for json file space reduction
getStatus = (code) => {
const lowerCode = code.toLowerCase();
let codeReturn = '';
switch(code) {
  case 'e':
    codeReturn = 'available';
    break;
  case 'p':
    codeReturn = 'planned';
    break;
  case 't':
    codeReturn = 'temporarily unavailable';
    break;
  default:
    break;
}

}


// OUTPUT
fs.writeFileSync(outputJsonFilepath, JSON.stringify(results), {
  encoding: 'utf8',
});
console.log('Complete');
