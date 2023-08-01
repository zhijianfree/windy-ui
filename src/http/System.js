import http from '../lib/http'
export default {
  updateGitConfig(data) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/pipeline/system/config/git`
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
  updateRepository(data) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/pipeline/system/config/repository`
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
      let url = `/v1/devops/pipeline/system/config/git`
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
  getDefaultPipeline() {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/pipeline/system/config/pipe`
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
  getImageRepository() {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/pipeline/system/config/repository`
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
