import axios from 'axios';

export const api = axios.create({
  baseURL: "https://api.github.com/",
  timeout: 10,
  headers: {
    Authorization: `Bearer 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`
  }
});
