import request from "@/plugin/axios";

export function snowflake () {
  return request({
    url: '/algorithm/snowflake',
    method: 'post'
  })
}
