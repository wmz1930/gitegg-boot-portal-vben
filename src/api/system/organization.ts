import { defHttp } from '/@/utils/http/axios';

export function getOrganizationList(data) {
  return defHttp.get({
    url: '/system/organization/tree',
    params: data,
  });
}

export function createOrganization(data) {
  return defHttp.post({
    url: '/system/organization/create',
    data,
  });
}

export function updateOrganization(data) {
  return defHttp.post({
    url: '/system/organization/update',
    data,
  });
}

export function deleteOrganization(id) {
  return defHttp.post({
    url: '/system/organization/delete/' + id,
  });
}

export function updateOrganizationStatus(organizationId, status) {
  return defHttp.post({
    url: '/system/organization/status/' + organizationId + '/' + status,
  });
}

export function checkOrganizationExist(data) {
  return defHttp.post({
    url: '/system/organization/check',
    data,
  });
}
