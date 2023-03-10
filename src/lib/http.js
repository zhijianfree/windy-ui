import axios from "axios";
axios.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const base = "/api";
export default {
  get(url) {
    return new Promise((resolve, reject) => {
      axios
        .get(base + url)
        .then((res) => {
          if (res.status == 200) {
            resolve(res.data);
          } else {
            reject(res.data);
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  delete(url) {
    return new Promise((resolve, reject) => {
      axios
        .delete(base + url)
        .then((res) => {
          if (res.status == 200) {
            resolve(res.data);
          } else {
            reject(res.data);
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  post(url, data) {
    return new Promise((resolve, reject) => {
      axios
        .post(base + url, data)
        .then((res) => {
          if (res.status == 200) {
            resolve(res.data);
          } else {
            reject(res.data);
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  put(url, data) {
    return new Promise((resolve, reject) => {
      axios
        .put(base + url, data)
        .then((res) => {
          if (res.status == 200) {
            resolve(res.data);
          } else {
            reject(res.data);
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
};
