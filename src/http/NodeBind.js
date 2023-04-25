import http from '../lib/http'
export default {
  createNode(data) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/pipeline/nodes`
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
  updateNode(data) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/pipeline/node`
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
  getNode(nodeId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/pipeline/node/${nodeId}`
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
  getNodeActions(nodeId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/pipeline/${nodeId}/executors`
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
  getNodePage(page, size, name) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/pipeline/nodes?page=${page}&size=${size}&name=${name}`
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
  getAllNodes() {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/pipeline/nodes/all`
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
  deleteNode(nodeId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/pipeline/node/${nodeId}`
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
