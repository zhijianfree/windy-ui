import http from '../lib/http'
export default {
  getServicesPage(page, size, name) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/services/page?page=${page}&size=${size}&name=${name}`
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
  getServices() {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/services`
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
  createService(data) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/services`
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
  updateService(data) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/services`
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
  deleteService(serviceId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/service/${serviceId}`
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
}
