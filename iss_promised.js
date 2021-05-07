const request = require('request-promise-native');

const fetchMyIP = function() {
  return request('https://api.ipify.org?format=json');
};

const fetchCoordsByIP = function(body) {
  const ipAddress = JSON.parse(body).ip;
  return request(`https://freegeoip.app/json/${ipAddress}`);
};

const fetchISSFlyOverTimes = function(body) {
  const latitude = JSON.parse(body)["latitude"];
  const longitude = JSON.parse(body)["longitude"];
  const url = `http://api.open-notify.org/iss/v1/?lat=${latitude}&lon=${longitude}&alt=1650`;
  return request(url);
};

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {           // not sure what this data is?
      const { response } = JSON.parse(data);
      return response;
    });
};


module.exports = { nextISSTimesForMyLocation };