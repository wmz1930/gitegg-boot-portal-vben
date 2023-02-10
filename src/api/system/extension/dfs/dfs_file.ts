import { defHttp } from '/@/utils/http/axios';

export function queryDfsFileList(query) {
  return defHttp.get({
    url: '/extension/dfs/file/list',
    params: query,
  });
}

export function createDfsFile(data) {
  return defHttp.post({
    url: '/extension/dfs/file/create',
    data,
  });
}

export function updateDfsFile(data) {
  return defHttp.post({
    url: '/extension/dfs/file/update',
    data,
  });
}

export function updateDfsFileStatus(dfsFileId, status) {
  return defHttp.post({
    url: '/extension/dfs/file/status/' + dfsFileId + '/' + status,
  });
}

export function batchDeleteDfsFile(data) {
  return defHttp.post({
    url: '/extension/dfs/file/batch/delete',
    data,
  });
}

export function deleteDfsFile(id) {
  return defHttp.post({
    url: '/extension/dfs/file/delete/' + id,
  });
}

export function checkDfsFileExist(data) {
  return defHttp.post({
    url: '/extension/dfs/file/check',
    params: data,
  });
}
