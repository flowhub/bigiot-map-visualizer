const express = require('express');
const serve = require('express-static');
const jwt = require('jsonwebtoken');
const qs = require('querystring');
// Polyfill for fetch()
require('isomorphic-fetch');

const port = process.env.PORT || 3000;
const providerSecret = process.env.BIGIOT_PROVIDER_SECRET;
const providerUrl = 'https://flowhub-bigiot-bridge.herokuapp.com';
 
const app = express();

function getData(route, params) {
  const token = jwt.sign({}, Buffer.from(providerSecret, 'base64'), {expiresIn:'1h'});
  return fetch(`${providerUrl}${route}?${qs.stringify(params)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
  })
  .then((response) => {
    if (response.status !== 200) {
      throw new Error(`Provider failed with ${response.status}: ${response.statusText}`);
    }
    return response.json();
  });
}

app.get('/cologneparking', (req, res) => {
  getData('/cologneparking', req.query)
  .then((data) => {
    res.json(data);
  })
  .catch((e) => {
    res.status(500).send(e.message);
  });
});
app.get('/bahnparking', (req, res) => {
  getData('/bahnparking', req.query)
  .then((data) => {
    res.json(data);
  })
  .catch((e) => {
    res.status(500).send(e.message);
  });
});
 
app.use(serve(__dirname + '/dist'));
 
const server = app.listen(port, function(){
    console.log(`server is running at ${port}`);
});
