import http from '../lib/http'
export default {
  getEnvs(page, size, name) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/environments?page=${page}&size=${size}&name=${name}`
      http
        .get(url)
        .then((res) => {
          resolve(res)
        })
        .catch((e) => {
          reject(e)
        })
    })
  },
  getAllEnvs() {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/environments/all`
      http
        .get(url)
        .then((res) => {
          resolve(res)
        })
        .catch((e) => {
          reject(e)
        })
    })
  },
  createEnv(data) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/environments`
      http
        .post(url, data)
        .then((res) => {
          resolve(res)
        })
        .catch((e) => {
          reject(e)
        })
    })
  },
  checkEnv(checkType, data) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/environment/check?checkType=${checkType}`
      http
        .post(url, data)
        .then((res) => {
          resolve(res)
        })
        .catch((e) => {
          reject(e)
        })
    })
  },
  updateEnv(data) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/environment`
      http
        .put(url, data)
        .then((res) => {
          resolve(res)
        })
        .catch((e) => {
          reject(e)
        })
    })
  },
  deleteEnv(envId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/environments/${envId}`
      http
        .delete(url)
        .then((res) => {
          resolve(res)
        })
        .catch((e) => {
          reject(e)
        })
    })
  },
  getService(envId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/environments/${envId}`
      http
        .get(url)
        .then((res) => {
          resolve(res)
        })
        .catch((e) => {
          reject(e)
        })
    })
  },
  getNodeList(envId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/environment/${envId}/nodes`
      http
        .get(url)
        .then((res) => {
          resolve(res)
        })
        .catch((e) => {
          reject(e)
        })
    })
  },
}
