declare namespace API {
  type deletePlanParams = {
    id: string;
  };

  type deleteReflectionParams = {
    id: string;
  };

  type deleteUserParams = {
    id: string;
  };

  type exam = {
    /** 考试id */
    id?: number;
    /** 考试1开始时间 */
    date1?: string;
    /** 考试2开始时间 */
    date2?: string;
    /** 用户id */
    user_id?: number;
  };

  type getExamParams = {
    /** 用户id */
    user_id: number;
  };

  type getPlanDeatilParams = {
    /** 计划名称 */
    planname?: string;
    /** 计划开始时间 */
    begin_time?: string;
    /** 计划截止时间 */
    deal_time?: string;
    /** 计划是否完成 */
    finished?: boolean;
    /** 计划所有者id */
    user_id?: number;
    /** 页码 */
    page?: number;
    /** 每页数量 */
    size?: number;
  };

  type getPlanFuzzyInquiryParams = {
    /** 计划开始月份 */
    begin_month?: string;
    /** 计划截止月份 */
    deal_month?: string;
    /** 计划所有者id */
    user_id?: number;
  };

  type getReflectionDetailParams = {
    /** 请输入反思计划ID */
    plan_id?: number;
    /** 请输入反思内容 */
    content?: string;
    /** 请输入反思创建时间 */
    create_time?: string;
    /** 请输入反思更新时间 */
    update_time?: string;
    /** 请输入用户ID */
    user_id?: number;
    /** 页码 */
    page?: number;
    /** 每页条数 */
    page_size?: number;
  };

  type getUserDetailParams = {
    /** 用户名 */
    username?: string;
    /** 邮箱 */
    email?: string;
    /** 手机号 */
    phone?: string;
    /** 页码 */
    page?: number;
    /** 每页数量 */
    size?: number;
  };

  type login = {
    /** 用户名 */
    username: string;
    /** 密码 */
    password: string;
  };

  type plan = {
    /** 计划id */
    id?: number;
    /** 计划名称 */
    planname?: string;
    /** 计划描述 */
    description?: string;
    /** 计划开始时间 */
    begin_time?: string;
    /** 计划截止时间 */
    deal_time?: string;
    /** 计划是否完成 */
    finished?: boolean;
    /** 用户ID */
    user_id?: number;
  };

  type postPlanParams = {
    id: string;
  };

  type postReflectionParams = {
    id: string;
  };

  type putPlanParams = {
    id: string;
  };

  type putReflectionParams = {
    id: string;
  };

  type putUserParams = {
    id: string;
  };

  type reflection = {
    /** 反思记录ID */
    id?: number;
    /** 反思内容 */
    content?: string;
    /** 反思的计划ID */
    plan_id?: number;
    /** 反思的用户ID */
    user_id?: number;
  };

  type register = {
    /** 用户名 */
    username: string;
    /** 密码 */
    password: string;
    /** 邮箱 */
    email?: string;
    /** 手机号 */
    phone?: string;
  };

  type user = {
    /** 用户ID */
    id: number;
    /** 用户名 */
    username: string;
    /** 密码 */
    password: string;
    /** 邮箱 */
    email?: string;
    /** 手机号 */
    phone?: string;
  };
}
