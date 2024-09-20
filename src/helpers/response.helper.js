// helper for handling response to client

const response = function ({ res, data = null, message, code }) {
  let resData = {
    status: true,
    message: message ?? 'Success',
    data,
  };


  if (code >= 400) {
    resData.status = false;
    if (!message) {
      if (code == 400) {
        resData.message = 'Invalid input';
      } else if (code == 404) {
        resData.message = 'Not found';
      } else if (code == 409) {
        resData.message = 'Duplicate data';
      } else {
        resData.message = 'Internal server error';
      }
    }

    if (code <= 599) {
      return res.status(code).json(resData);
    } else {
      return res.status(500).json(resData);
    }
  } else {
    if (code >= 100) {
      return res.status(code).json(resData);
    } else {
      return res.json(resData);
    }
  }
};

module.exports = response;
