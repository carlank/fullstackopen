const app = require('./app.js');

const logger = require('./utils/logger.js');
const {PORT} = require('./utils/config.js');

app.listen(PORT, () => {
  logger.log(`Server running on port ${PORT}`);
});