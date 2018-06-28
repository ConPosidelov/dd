import axios from "axios";

export const endPointFree = axios.create({
  timeout: 5000
});

export const nodeApi = axios.create({
  baseURL: "http://localhost:3030/api/themeforest/",
  headers: { "Content-Type": "application/json;charset=UTF-8" }
});

export const nodeApiAuthorsGetAll = axios.create({
  baseURL: "http://localhost:3030/api/themeforest/author",
  headers: { "Content-Type": "application/json;charset=UTF-8" }
});

const endPointFree = axios.create({
  timeout: 3000
});

const nodeApiAuthorCreate = axios.create({
  method: "post",
  baseURL: "http://localhost:3030/api/themeforest/author",
  headers: { "Content-Type": "application/json;charset=UTF-8" }
});

const nodeApiAuthorUpdate = axios.create({
  method: "put",
  baseURL: "http://localhost:3030/api/themeforest/author",
  headers: { "Content-Type": "application/json;charset=UTF-8" }
});
