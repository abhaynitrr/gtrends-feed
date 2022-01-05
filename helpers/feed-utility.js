import { ERROR_CONSTANTS, JSON_RESPONSE_TYPE } from "./feed-constants";

ERROR_CONSTANTS;

export default {
  sendErrorResponse: (response, errorMessage) => {
    response.status(ERROR_CONSTANTS.ERROR_STATUS);
    response.type(JSON_RESPONSE_TYPE);
    response.send(
      JSON.stringify({
        error: `${errorMessage}`
      })
    );
  },
  sendNotFoundResponse: response => {
    response.status(ERROR_CONSTANTS.NOT_FOUND);
    response.type(JSON_RESPONSE_TYPE);
    response.send(
      JSON.stringify({
        error: `${ERROR_CONSTANTS.ROUTE_NOT_FOUND}`
      })
    );
  }
};
