import http from '../lib/http'
export default {
  getPublishes(serviceId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/pipeline/${serviceId}/publishes`
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
  createPublish(data) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/pipeline/publish`
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
  updatePublish(data) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/pipeline/publish`
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
  deletePublish(publishId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/pipeline/publish/${publishId}`
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
