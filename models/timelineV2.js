import { isInteger } from "lodash";

class TimelineV2 {
  constructor({ time, keys, values }, CAT_MAP) {
    // this.time = this.getFormattedTime(time);
    const bucketWiseData = {};
    for (let k = 1; k < keys.length; k++) {
      if(!this[CAT_MAP[keys[k]]]) {
        this[CAT_MAP[keys[k]]] = {};
        this[CAT_MAP[keys[k]]]['time'] = this.getFormattedTime(time);
      }
      this[CAT_MAP[keys[k]]][keys[k]] = this.getValue(values[k]);
    }
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
    } else if (isInteger(value)) {
      return value;
    } else {
      return 0;
    }
  }
}

export default TimelineV2;
