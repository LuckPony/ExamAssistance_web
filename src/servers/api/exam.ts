// @ts-ignore
/* eslint-disable */
import request from "umi-request";

/** 获取考试日期信息 GET /api/exam/ */
export async function getExam(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getExamParams,
  options?: { [key: string]: any }
) {
  return request<any>("/api/exam/", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新考试日期信息 PUT /api/exam/ */
export async function putExam(
  body: API.exam,
  options?: { [key: string]: any }
) {
  return request<any>("/api/exam/", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
