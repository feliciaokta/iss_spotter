/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const request = require("request");


const fetchMyIP = function(callback) {
  const URL = `https://api.ipify.org/?format=json`;
  request(URL, function(error, response, body) {
    if (error) {
      callback(error, null);
      return;
    }
    if (response) {
      const data = JSON.parse(body);
      callback(null, data);
      return;
    }
  }
  );
};


const fetchCoordsByIP = function (ip, callback) {
  const URL = `https://freegeoip.app/json/`;
  request (URL, function (error, response, body) {
  if (error) {
    callback(error, null);
    return;
  }
  
  if (response.statusCode !== 200) {
    const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
    callback(Error(msg), null);
    return;
  }
  
  // "latitude":49.2958, "longitude":-123.141
  if (response) {
    const latitude = JSON.parse(body)["latitude"];
    const longitude = JSON.parse(body)["longitude"];
    callback(null, {latitude, longitude});
    }
  });  
};



module.exports = { fetchMyIP, fetchCoordsByIP };