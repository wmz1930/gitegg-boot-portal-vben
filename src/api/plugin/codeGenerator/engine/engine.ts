import { defHttp } from '/@/utils/http/axios';

export function queryTableList(query) {
  return defHttp.get({
    url: '/code/generator/engine/table/list',
    params: query,
  });
}

export function queryTableFieldList(query) {
  return defHttp.get({
    url: '/code/generator/engine/table/field/list',
    params: query,
  });
}

export function generateCode(query) {
  return defHttp.get({
    url: '/code/generator/engine/process/generate/code',
    params: query,
  });
}
