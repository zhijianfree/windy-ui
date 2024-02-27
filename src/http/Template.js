import http from '../lib/http'
export default {
  getTemplatePage(serviceId, page, size, name) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/feature/${serviceId}/templates/page?page=${page}&size=${size}&name=${name}`
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
  getTemplateList() {
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
  getTemplate(templateId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/feature/template/${templateId}`
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
  createTemplate(template) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/feature/template`
      http
        .post(url, template)
        .then((res) => {
          resolve(res)
        })
        .catch((e) => {
          reject(e)
        })
    })
  },
  batchCreateTemplate(data) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/feature/templates`
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
  deletePlugin(pluginId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/feature/plugin/${pluginId}`
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
  upload(data) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/feature/template/upload`
      http
        .postFile(url, data)
        .then((res) => {
          resolve(res)
        })
        .catch((e) => {
          reject(e)
        })
    })
  },
  updateTemplate(template) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/feature/template`
      http
        .put(url, template)
        .then((res) => {
          resolve(res)
        })
        .catch((e) => {
          reject(e)
        })
    })
  },
  deleteTemplate(templateId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/feature/template/${templateId}`
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
  refresh(templateId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/feature/${templateId}/refresh`
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
