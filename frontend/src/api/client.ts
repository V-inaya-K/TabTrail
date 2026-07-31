import axios from 'axios';

const client = axios.create({
  baseURL: '/api/v1',
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[API]', err.config?.url, err.response?.status, err.message);
    return Promise.reject(err);
  },
);

export default client;