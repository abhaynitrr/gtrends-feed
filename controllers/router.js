import express from "express";
import { interestOverTime } from "google-trends-api";
import {
  FEED_ROUTES_CONFIG,
  FEED_ACTION_CONSTANTS,
  SUCCESS_STATUS,
  JSON_RESPONSE_TYPE,
  FROM_DATE_IN_MILISECONDS
} from "../helpers/feed-constants";
import feedutils from "../helpers/feed-utility";
import Timeline from "../models/timeline";

class Router {
  static getRoutes() {
    const router = express.Router();

    /**
     * Health check response to the server
     */
    router.get(FEED_ROUTES_CONFIG.HEALTH_CHECK_PATH, (request, response) => {
      response.send(FEED_ROUTES_CONFIG.HEALTH_CHECK_MSG);
    });

    /**
     * Handling for multiple routes like, getInterestOvertime etc
     */
    router.get(
      FEED_ROUTES_CONFIG.SUPPORTED_PATHS,
      async (request, response) => {
        const { type } = request.params;
        const {
          q = "",
          geo = "IN",
          from = FROM_DATE_IN_MILISECONDS
        } = request.query;
        //   console.log("Request >", request);
        switch (type) {
          case FEED_ACTION_CONSTANTS.GET_INTEREST_OVERTIME:
            try {
              /**
               * TRENDS OVER TIME
               */
              let trendsOverTime = await interestOverTime({
                keyword: q,
                startTime: new Date(Date.now() - parseInt(from)),
                endTime: new Date(),
                granularTimeResolution: true,
                geo
              });
              // Await promise response
              let promRes = await trendsOverTime;
              if (!promRes) {
                return response.send(jsonRes);
              }
              promRes = JSON.parse(promRes);
              let jsonRes = {};
              let queryObj = {
                displayKey: q,
                key: q,
                topic: "news"
              };
              const timelineData = [];
              if (
                promRes &&
                promRes.default &&
                Array.isArray(promRes.default.timelineData)
              ) {
                promRes.default.timelineData.forEach(element => {
                  timelineData.push(new Timeline(element, queryObj));
                });
                jsonRes.timelineData = timelineData;
              }
              response.status(SUCCESS_STATUS);
              response.type(JSON_RESPONSE_TYPE);
              response.set("Cache-Control", "public, max-age=86400");
              response.send(jsonRes);
            } catch (error) {
              feedutils.sendErrorResponse(response, error.message);
            }
            break;

          default:
            feedutils.sendNotFoundResponse(response);
            break;
        }
      }
    );

    return router;
  }
}

export default Router.getRoutes();
