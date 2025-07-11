// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** 获取反思记录列表 GET /api/reflection/ */
export async function getReflectionDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getReflectionDetailParams,
  options?: { [key: string]: any }
) {
  return request<any>("/api/reflection/", {
    method: "GET",
    params: {
      // page has a default value: 1
      page: "1",
      // page_size has a default value: 10
      page_size: "10",
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新反思记录 PUT /api/reflection/${param0} */
export async function putReflection(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putReflectionParams,
  body: API.reflection,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/reflection/${param0}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 添加反思记录 POST /api/reflection/${param0} */
export async function postReflection(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postReflectionParams,
  body: API.reflection,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/reflection/${param0}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除反思记录 DELETE /api/reflection/${param0} */
export async function deleteReflection(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteReflectionParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/reflection/${param0}`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}
