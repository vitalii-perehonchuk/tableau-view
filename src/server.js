import cors from 'cors';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import includes from 'lodash/includes';

const ALLOWED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:8090',
  'https://tableau-view.netlify.app',
  'https://tableau-view.herokuapp.com',
];

const app = express();
app.use(
  '/',
  express.static(process.env.NODE_ENV === 'production' ? '.' : 'dist'),
);
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
export default app;
