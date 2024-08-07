import http from '../lib/http'
export default {
  getUserDemands(page, size) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/user/demands?page=${page}&size=${size}`
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
  getDemandList(page, size, name, status) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/demands?page=${page}&size=${size}&name=${name}&status=${status}`
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
  getDemandDetail(demandId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/demands/${demandId}`
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
  getDemandStatuses() {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/demand/statuses`
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
  createDemand(demand) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/demands`
      http
        .post(url, demand)
        .then((res) => {
          resolve(res)
        })
        .catch((e) => {
          reject(e)
        })
    })
  },
  updateDemand(demand) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/demand`
      http
        .put(url, demand)
        .then((res) => {
          resolve(res)
        })
        .catch((e) => {
          reject(e)
        })
    })
  },
}
