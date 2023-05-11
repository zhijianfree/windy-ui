import http from '../lib/http'
export default {
  getTaskList(page, size, name) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/feature/tasks?page=${page}&pageSize=${size}&name=${name}`
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
  getAllTaskList(serviceId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/feature/${serviceId}/tasks`
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
  createTask(task) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/feature/task`
      http
        .post(url, task)
        .then((res) => {
          resolve(res)
        })
        .catch((e) => {
          reject(e)
        })
    })
  },
  updateTask(testCase) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/feature/task`
      http
        .put(url, testCase)
        .then((res) => {
          resolve(res)
        })
        .catch((e) => {
          reject(e)
        })
    })
  },
  getTaskDetail(taskId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/feature/task/${taskId}`
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
  runTask(taskId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/feature/task/${taskId}`
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
  deleteTask(taskId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/feature/task/${taskId}`
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
  getTaskRecords(page, size) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/feature/task/records?page=${page}&pageSize=${size}`
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
  getTaskRecordDetail(recordId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/feature/task/record/${recordId}`
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
  deleteTaskRecord(recordId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/feature/task/record/${recordId}`
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
  getTaskHistories(recordId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/feature/task/record/${recordId}/history`
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
