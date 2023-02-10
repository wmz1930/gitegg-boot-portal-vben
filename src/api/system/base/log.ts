import { defHttp } from '/@/utils/http/axios';

export function fetchList(query) {
  return defHttp.get({
    url: '/base/log/list',
    params: query,
  });
}
