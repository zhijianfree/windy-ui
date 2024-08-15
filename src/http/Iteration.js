import http from '../lib/http'
export default {
  getIterationList() {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/iterations`
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
  getIterationStatistic(iterationId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/iterations/${iterationId}/statistic`
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
  getIterationDetail(iterationId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/iterations/${iterationId}`
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
  createIteration(iteration) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/iterations`
      http
        .post(url, iteration)
        .then((res) => {
          resolve(res)
        })
        .catch((e) => {
          reject(e)
        })
    })
  },
  updateIteration(iterationId, iteration) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/iterations/${iterationId}`
      http
        .put(url, iteration)
        .then((res) => {
          resolve(res)
        })
        .catch((e) => {
          reject(e)
        })
    })
  },
}
