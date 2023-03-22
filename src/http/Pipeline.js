import http from '../lib/http'
export default {
  pipelineList(serviceId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/pipeline/${serviceId}/list`
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
  queryPipeline(serviceId, pipelineId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/pipeline/${serviceId}/${pipelineId}`
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
  savePipeline(data) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/pipeline`
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
  updatePipeline(serviceId, pipelineId, data) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/pipeline/${serviceId}/${pipelineId}`
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
  deletePipeline(serviceId, pipelineId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/pipeline/${serviceId}/${pipelineId}`
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
  detaultConfig() {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/pipeline/system/config/123456`
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
