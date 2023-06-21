import http from '../lib/http'
export default {
  latestPipelineHistory(serviceId, pipelineId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/pipeline/${serviceId}/${pipelineId}/latest/history`
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
  getPipelienStatus(pipelineId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/pipeline/${pipelineId}/status`
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
  approval(historyId, nodeId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/pipeline/node/approval?historyId=${historyId}&nodeId=${nodeId}`
      http
        .put(url)
        .then((res) => {
          resolve(res)
        })
        .catch((e) => {
          reject(e)
        })
    })
  },
}
