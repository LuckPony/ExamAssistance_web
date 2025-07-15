// @ts-ignore
/* eslint-disable */
import request from "umi-request";

/** 获取计划列表 GET /api/plan/ */
export async function getPlanDeatil(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPlanDeatilParams,
  options?: { [key: string]: any }
) {
  return request<any>("/api/plan/", {
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

/** 更新计划 PUT /api/plan/${param0} */
export async function putPlan(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putPlanParams,
  body: API.plan,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/plan/${param0}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 添加计划 POST /api/plan/${param0} */
export async function postPlan(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postPlanParams,
  body: API.plan,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/plan/${param0}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** "删除计划 DELETE /api/plan/${param0} */
export async function deletePlan(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deletePlanParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/plan/${param0}`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 根据时间模糊查询获取计划列表 GET /api/plan/getByData */
export async function getPlanFuzzyInquiry(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPlanFuzzyInquiryParams,
  options?: { [key: string]: any }
) {
  return request<any>("/api/plan/getByData", {
    method: "GET",
    params: {
      // user_id has a default value: 1
      user_id: "1",
      ...params,
    },
    ...(options || {}),
  });
}
