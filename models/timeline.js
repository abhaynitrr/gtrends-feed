import { isInteger } from "lodash";

class Timeline {
  constructor(
    { time, formattedTime, formattedAxisTime, value, hasData, formattedValue },
    { displayKey, key, topic }
  ) {
    this.date = new Date(formattedAxisTime).toISOString();
    this.displayKey = displayKey;
    this.formattedTime = formattedTime;
    this.key = key;
    this.time = time;
    this.topic = topic;
    this.value =
      (Array.isArray(value) && value.length >= 0 && value[0]) ||
      (typeof value === "string" && parseInt(value));
  }

  getValue(value) {
    if (Array.isArray(value) && value.length >= 0) {
      return value[0];
    } else if (typeof value === "string" && !isNaN(parseInt(value))) {
      return parseInt(value);
    }
    return isInteger(value) || 0;
  }
}

export default Timeline;
