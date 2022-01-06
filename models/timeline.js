import { isInteger } from "lodash";

class Timeline {
  constructor(
    { time, formattedTime, formattedAxisTime, value, hasData, formattedValue },
    { displayKey, key, topic }
  ) {
    this.date = new Date(formattedAxisTime).toISOString();
    this.displayKey = displayKey;
    this.formattedTime = this.getFormattedTime(formattedTime);
    this.key = key;
    this.time = this.getTime(time);
    this.topic = topic;
    this.value = this.getValue(value);
  }

  getFormattedTime(time) {
    if (typeof time === "object" && time instanceof Date) {
      return time.toDateString().slice(4);
    } else if (typeof time === "string") {
      return time;
    } else {
      return new Date(Date.now()).toDateString().slice(4);
    }
  }

  getTime(time) {
    if (!isNaN(time)) {
      return new Date(time * 1000).getTime() / 1000 + "";
    } else if (typeof time === "string") {
      return new Date(time).getTime() / 1000 + "";
    } else {
      throw "Invalid Date";
    }
  }

  getValue(value) {
    if (Array.isArray(value) && value.length >= 0) {
      return value[0];
    } else if (typeof value === "string" && !isNaN(parseInt(value))) {
      return parseInt(value);
    } else if (typeof value === "number") {
      return value;
    } else isInteger(value) || 0;
  }
}

export default Timeline;
