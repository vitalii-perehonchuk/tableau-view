"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _cors = _interopRequireDefault(require("cors"));

var _express = _interopRequireDefault(require("express"));

var _httpProxyMiddleware = require("http-proxy-middleware");

var _includes = _interopRequireDefault(require("lodash/includes"));

// import bodyParser from 'body-parser';
const ALLOWED_ORIGINS = ['http://localhost:8080', 'https://tableau-view.netlify.app'];
const app = (0, _express.default)(); // app.use(bodyParser.json());

app.use((0, _cors.default)({
  origin(origin, callback) {
    if (!origin) {
      return callback(undefined, true);
    }

    if ((0, _includes.default)(ALLOWED_ORIGINS, origin)) {
      return callback(undefined, true);
    }

    return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
  }

}));
app.use('/api', (0, _httpProxyMiddleware.createProxyMiddleware)(['/api'], {
  changeOrigin: true,
  logLevel: 'debug',
  target: 'https://10ax.online.tableau.com',
  xfwd: true
}));
app.use(_express.default.static('dist'));
app.listen(process.env.PORT || 8090);
