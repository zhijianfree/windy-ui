import http from "../lib/http";
export default {
  getEnvs(page, size) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/environments?page=${page}&size=${size}`;
      http
        .get(url)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  createEnv(data) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/environments`;
      http
        .post(url, data)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  updateEnv(data) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/environment`;
      http
        .put(url, data)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  deleteEnv(envId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/environments/${envId}`;
      http
        .delete(url)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  getService(envId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/environments/${envId}`;
      http
        .get(url)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
};
