import http from "../lib/http";
export default {
  gitbindList(pipelineId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/pipeline/${pipelineId}/git/binds`;
      http
        .get(url)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  createGitbind(data) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/pipeline/git/bind`;
      http
        .post(url, data)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  deleteCodeChange(pipelineId, bindId) {
    return new Promise((resolve, reject) => {
      let url = `/v1/devops/pipeline/${pipelineId}/git/bind/${bindId}`;
      http
        .delete(url)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
};
