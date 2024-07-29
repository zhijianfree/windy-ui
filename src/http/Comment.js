import http from '../lib/http'
export default {
  getComments(relativeId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/${relativeId}/comments`
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
  createComment(data) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/comments`
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
  updateDemand(data) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/comments`
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
  deleteComment(commentId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/${commentId}/comment`
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
