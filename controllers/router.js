import express, { request, response } from "express";
import { interestOverTime } from "google-trends-api";
import fs from "fs";
import readXlsxFile from "read-excel-file/node";
import {
  FEED_ROUTES_CONFIG,
  FEED_ACTION_CONSTANTS,
  SUCCESS_STATUS,
  JSON_RESPONSE_TYPE,
  FROM_DATE_IN_MILISECONDS
} from "../helpers/feed-constants";
import feedutils from "../helpers/feed-utility";
import Timeline from "../models/timeline";
import TimelineV2 from "../models/timelineV2";

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
     * 1. FEED_ROUTES_CONFIG.SUPPORTED_PATHS - google-trends-api supported
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

    /**
     * 2. FEED_ROUTES_CONFIG.GET_COMPARISON_FEED_PATH - pytrends datafile supported
     *    pytrends fetches the data based on provided keywords,
     *    then it uploads the data to a separate file which then node api consumes this datafile to plot json.
     */
    router.get(
      FEED_ROUTES_CONFIG.GET_COMPARISON_FEED_PATH,
      (request, response) => {
        const { type = "weekly" } = request.query;
        let dataSheet = 1;
        let mapSheet = 2;
        if (type === "daily") {
          dataSheet = 3;
          mapSheet = 4;
        }
        readXlsxFile(fs.createReadStream("./build/data/gtrends-data.xlsx"), {
          sheet: mapSheet
        })
          .then(MAPPING => {
            const CAT_MAP = MAPPING.reduce((map = {}, item) => {
              map[item[0]] = item[1];
              return map;
            }, {});
            readXlsxFile(fs.createReadStream("./build/data/gtrends-data.xlsx"), {
              sheet: dataSheet,
              dateFormat: "yyyy-mm-dd"
            })
              .then(ROWS => {
                try {
                  const bucketWiseData = {};
                  const jsonRes = {};
                  if (Array.isArray(ROWS) && ROWS.length > 0) {
                    const headers = ROWS[0];
                    for (let row = 1; row < ROWS.length; row++) {
                      try {
                        const tlObj = {};
                        tlObj.time = ROWS[row][0];
                        tlObj.keys = headers;
                        tlObj.values = ROWS[row];

                        let timelnObj = new TimelineV2(tlObj, CAT_MAP);
                        for (const key in timelnObj) {
                          if (Object.hasOwnProperty.call(timelnObj, key)) {
                            if (
                              !Object.hasOwnProperty.call(bucketWiseData, key)
                            ) {
                              bucketWiseData[key] = [];
                            }
                            bucketWiseData[key].push(timelnObj[key]);
                          }
                        }
                      } catch (error) {
                        // console.log(error)
                      }
                    }
                    /**
                     * bucketWiseData : 
                     * {
                     *    timelineData : {
                     *        cateforyA : [
                     *                      {
                     *                        "time" : 'Jan 01 2021',
                     *                        "Cyclone Tauktae": 0.1,
                                              "Tamil Thalaivas": 0.1,
                                              "Vaishno Devi stampede": 0.1,
                                              ...
                     *                      },
                     *                      ...timeline data],
                     *        cateforyB : [...timeline data],
                     *        ...
                     *    }
                     * }
                     */
                    jsonRes.timelineData = bucketWiseData;
                  }
                  response.status(SUCCESS_STATUS);
                  response.type(JSON_RESPONSE_TYPE);
                  response.set("Cache-Control", "public, max-age=86400");
                  response.send(jsonRes);
                } catch (error) {
                  feedutils.sendErrorResponse(response, error.message);
                }
              })
              .catch(error =>
                feedutils.sendErrorResponse(response, error.message)
              );
          })
          .catch(error => feedutils.sendErrorResponse(response, error.message));
      }
    );

    return router;
  }
}

export default Router.getRoutes();
