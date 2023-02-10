import { defHttp } from '/@/utils/http/axios';

export function getResourceList(data) {
  return defHttp.get({
    url: '/system/resource/tree',
    params: data,
  });
}

export function createResource(data) {
  return defHttp.post({
    url: '/system/resource/create',
    data,
  });
}

export function updateResource(data) {
  return defHttp.post({
    url: '/system/resource/update',
    data,
  });
}

export function updateResourceStatus(resourceId, status) {
  return defHttp.post({
    url: '/system/resource/status/' + resourceId + '/' + status,
  });
}

export function deleteResource(id) {
  return defHttp.post({
    url: '/system/resource/delete/' + id,
  });
}

export function checkResourceExist(data) {
  return defHttp.post({
    url: '/system/resource/check',
    data,
  });
}
