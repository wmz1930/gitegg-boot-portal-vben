import { defHttp } from '/@/utils/http/axios';

export function queryMailTemplateList(query) {
  return defHttp.get({
    url: '/extension/mail/template/list',
    method: 'get',
    params: query,
  });
}

export function queryMailTemplateListAll(query) {
  return defHttp.get({
    url: '/extension/mail/template/list/all',
    method: 'get',
    params: query,
  });
}

export function createMailTemplate(data) {
  return defHttp.post({
    url: '/extension/mail/template/create',
    data,
  });
}

export function updateMailTemplate(data) {
  return defHttp.post({
    url: '/extension/mail/template/update',
    data,
  });
}

export function updateMailTemplateStatus(mailTemplateId, status) {
  return defHttp.post({
    url: '/extension/mail/template/status/' + mailTemplateId + '/' + status,
  });
}

export function batchDeleteMailTemplate(data) {
  return defHttp.post({
    url: '/extension/mail/template/batch/delete',
    data,
  });
}

export function deleteMailTemplate(id) {
  return defHttp.post({
    url: '/extension/mail/template/delete/' + id,
  });
}

export function checkMailTemplateExist(data) {
  return defHttp.post({
    url: '/extension/mail/template/check',
    params: data,
  });
}

export function downloadMailTemplateList(query) {
  return defHttp.get({
    url: '/extension/mail/template/download',
    method: 'get',
    responseType: 'blob',
    params: query,
  });
}

export function uploadMailTemplate(formData) {
  return defHttp.post({
    url: '/extension/mail/template/upload',
    data: formData,
  });
}

export function downloadMailTemplateTemplate(query) {
  return defHttp.get({
    url: '/extension/mail/template/download/template',
    method: 'get',
    responseType: 'blob',
    params: query,
  });
}
