import http from '../lib/http'
export default {
  createAction(data) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/pipeline/actions`
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
  updateAction(data) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/pipeline/action`
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
  getAction(actionId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/pipeline/action/${actionId}`
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
  getActionPage(page, size, name) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/pipeline/actions?page=${page}&size=${size}&name=${name}`
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
  deleteAction(actionId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/pipeline/action/${actionId}`
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
