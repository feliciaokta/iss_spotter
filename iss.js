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


const fetchCoordsByIP = function(ip, callback) {
  const URL = `https://freegeoip.app/json/`;
  request(URL, function(error, response, body) {
    if (error) {
      callback(error, null);
      return;
    }
  
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
  
    if (response) {
      const latitude = JSON.parse(body)["latitude"];
      const longitude = JSON.parse(body)["longitude"];
      callback(null, {latitude, longitude});
    }
  });
};


const fetchISSFlyOverTimes = function(coords, callback) {
  const URL = `http://api.open-notify.org/iss/v1/?lat=${coords.latitude}&lon=${coords.longitude}&alt=1650`;
  request(URL, function(error, response, body) {
    if (error) {
      callback(error, null);
      return;
    }
  
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS pass times: ${body}`;
      callback(Error(msg), null);
      return;
    }
  
    if (response) {
      const passes = JSON.parse(body).response;
      callback(null, passes);
    }
  });
};



const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};



module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };