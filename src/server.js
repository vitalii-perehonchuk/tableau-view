// import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import includes from 'lodash/includes';

const ALLOWED_ORIGINS = [
  'http://localhost:8080',
  'https://tableau-view.netlify.app',
];

const app = express();
// app.use(bodyParser.json());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(undefined, true);
      }
      if (includes(ALLOWED_ORIGINS, origin)) {
        return callback(undefined, true);
      }
      return callback(
        new Error(
          'The CORS policy for this site does not allow access from the specified Origin.',
        ),
        false,
      );
    },
  }),
);

app.use(
  '/api',
  createProxyMiddleware(['/api'], {
    changeOrigin: true,
    logLevel: 'debug',
    target: 'https://10ax.online.tableau.com',
    xfwd: true,
  }),
);
app.use(express.static('public'));
app.use(express.static('dist'));
app.listen(process.env.PORT || 8090);
