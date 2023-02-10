import { defHttp } from '/@/utils/http/axios';

export function dfsUpload(formData) {
  return defHttp.post({
    url: '/extension/upload/file',
    data: formData,
  });
}

export function dfsGetFileUrl(query) {
  return defHttp.get({
    url: '/extension/get/file/url',
    params: query,
  });
}

export function dfsBatchGetFileUrl(data) {
  return defHttp.post({
    url: '/extension/batch/get/file/url',
    data,
  });
}

export function dfsDownloadFileUrl(query) {
  return defHttp.get({
    url: '/extension/get/file/download',
    responseType: 'blob',
    params: query,
  });
}
