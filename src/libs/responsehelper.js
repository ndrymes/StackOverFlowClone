class Responses {
  constructor() {
    return this;
  }
  success(errorCode, data, message, meta) {
    return {
      error: false,
      errorCode,
      data,
      message,
      meta
    };
  }
  error(errorCode, message) {
    return {
      error: true,
      errorCode,
      message
    };
  }
  output(errorCode, data, count = 0) {
    return {
      count,
      data,
      error: false,
      errorCode
    };
  }
}
const responses = new Responses();
module.exports = responses;
