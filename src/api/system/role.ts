import { defHttp } from '/@/utils/http/axios';

export function getRoleList(query) {
  return defHttp.get({
    url: '/system/role/list',
    params: query,
  });
}

export function getRoleListAll(data) {
  return defHttp.get({
    url: '/system/role/all',
    params: data,
  });
}

export function createRole(data) {
  return defHttp.post({
    url: '/system/role/create',
    data,
  });
}

export function updateRole(data) {
  return defHttp.post({
    url: '/system/role/update',
    data,
  });
}

export function updateRoleStatus(roleId, status) {
  return defHttp.post({
    url: '/system/role/status/' + roleId + '/' + status,
  });
}

export function batchDeleteRole(data) {
  return defHttp.post({
    url: '/system/role/batch/delete',
    data,
  });
}

export function deleteRole(id) {
  return defHttp.post({
    url: '/system/role/delete/' + id,
  });
}

export function queryRoleResource(roleId) {
  return defHttp.get({
    url: '/system/role/resource/' + roleId,
  });
}

export function updateRoleResources(data) {
  return defHttp.post({
    url: '/system/role/resource/update',
    data,
  });
}

export function checkRoleExist(data) {
  return defHttp.post({
    url: '/system/role/check',
    data,
  });
}

export function exportRoleList(data) {
  return defHttp.post({
    url: '/system/role/export',
    responseType: 'blob',
    data,
  });
}

export function importRoleList(formData) {
  return defHttp.post({
    url: '/system/role/import',
    data: formData,
  });
}

export function downloadRoleTemplate(query) {
  return defHttp.get({
    url: '/system/role/download/template',
    responseType: 'blob',
    params: query,
  });
}
