// @ts-ignore
/* eslint-disable */
import request from "umi-request";

/** 获取用户列表 GET /api/user/ */
export async function getUserDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserDetailParams,
  options?: { [key: string]: any }
) {
  return request<any>("/api/user/", {
    method: "GET",
    params: {
      // page has a default value: 1
      page: "1",
      // size has a default value: 10
      size: "10",
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新用户 PUT /api/user/${param0} */
export async function putUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putUserParams,
  body: API.user,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/user/${param0}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 删除用户 DELETE /api/user/${param0} */
export async function deleteUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteUserParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/user/${param0}`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 用户登录 POST /api/user/login */
export async function postUserLogin(
  body: API.login,
  options?: { [key: string]: any }
) {
  return request<any>("/api/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 用户注册 POST /api/user/register */
export async function postUserRegister(
  body: API.register,
  options?: { [key: string]: any }
) {
  return request<any>("/api/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
