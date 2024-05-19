"use strict";

const circularReplacer = () => {
    const seen = new WeakSet();
  
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };


exports.logger = (filename, message, data = {}) => {
    try {
      console.log(JSON.stringify({
        filename: filename,
        message: message,
        data: data,
      }, circularReplacer()));
      return;
    } catch (error) {
      console.log("Logger Error", error);
      return;
    }
  };