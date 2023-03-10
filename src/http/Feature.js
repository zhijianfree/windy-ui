import http from '../lib/http'
export default {
  getFeatures(testCaseId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/case/${testCaseId}/features?page=1&size=10`
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
  getFeatureDetail(featureId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/feature/${featureId}`
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
  createFeature(data) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/feature`
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
  deleteFeature(featureId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/feature/${featureId}`
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
  updateFeature(data) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/feature`
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
  getFeatureByUser(userId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/user/${userId}/features`
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
  getExecutePoints(featureId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/feature/${featureId}/execute/points`
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
  deleteExecutePoint(executePointId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/feature/execute/point/${executePointId}`
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
  getFeatureTemplates() {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/feature/templates`
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
  startFeature(featureId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/feature/start/${featureId}`
      http
        .post(url)
        .then((res) => {
          resolve(res)
        })
        .catch((e) => {
          reject(e)
        })
    })
  },
  getFeatureHistory(featureId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/feature/${featureId}/histories`
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
  getExecuteRecords(historyId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/feature/${historyId}/records`
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
  getExecuteOperators() {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/feature/execute/operators`
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
  deleteHistory(historyId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops//feature/history/${historyId}`
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
  filterFeatureByTag(data) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/feature/tag/filter`
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
  getFeatureTree(testCaseId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/${testCaseId}/tree/features`
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
  copyFeature(data) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/feature/copy`
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
  batchDeleteFeature(data) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/delete/features`
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
}
