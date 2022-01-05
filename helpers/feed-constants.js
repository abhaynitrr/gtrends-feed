export const APP_PORT_NO = "3031";
export const JSON_RESPONSE_TYPE = "application/json";
export const SUCCESS_STATUS = 200;
export const FROM_DATE_IN_MILISECONDS = 6 * 30 * 24 * 60 * 60 * 1000;

export const FEED_ROUTES_CONFIG = {
  SUPPORTED_PATHS: ["/trends", "/trends/:type"],
  UN_SUPPORTED_PATHS: ["/feeds/:type/*"],
  HEALTH_CHECK_PATH: ["/healthCheck"],
  HEALTH_CHECK_MSG: "Health Check Ok"
};

export const FEED_ACTION_CONSTANTS = {
  GET_INTEREST_OVERTIME: "getInterestOvertime"
};

export const ERROR_CONSTANTS = {
  ERROR_STATUS: 400,
  NOT_FOUND: 404,
  ROUTE_NOT_FOUND: "Requested Endpoint Not Found"
};
