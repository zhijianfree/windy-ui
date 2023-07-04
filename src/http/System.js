import http from '../lib/http'
export default {
  updateGitConfig(data) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/pipeline/system/config`
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
  requestGitConfig() {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/pipeline/system/config/2`
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
  getMonitor() {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/pipeline/system/monitor`
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
