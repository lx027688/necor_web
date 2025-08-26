import request from "@/plugin/axios";

export function snowflake () {
  return request({
    url: '/sys/algorithm/snowflake',
    method: 'post'
  })
}
