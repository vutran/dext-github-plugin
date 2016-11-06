let mockResponseBody = null;

/**
 * Mocks the `got()` function
 */
const got = () => {
  const body = mockResponseBody;
  return new Promise((resolve) => {
    resolve({ body });
  });
};

/**
 * Mocks the response body
 */
got.__setResponseBody = (data) => {
  mockResponseBody = data;
};

module.exports = got;
