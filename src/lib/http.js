import axios from "axios";
import { Message } from "element-ui";

axios.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    if (error.response.data.code) {
      Message.error(
        `[${error.response.data.code}] ${error.response.data.message}`
      );
    } else {
      Message.error(`访问服务器失败`);
    }

    return Promise.reject(error);
  }
);

let base = "";
if (process.env.NODE_ENV != "production") {
  base = "/api";
}
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
  postFile(url, form) {
    return new Promise((resolve, reject) => {
      axios
        .post(base + url, form, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
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
