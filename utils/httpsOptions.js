const fs = require('fs');

const getHttpsOptions = () => ({
  key: fs.readFileSync('path/to/your/server.key'),
  cert: fs.readFileSync('path/to/your/server.cert'),
 
});

module.exports = { getHttpsOptions };
