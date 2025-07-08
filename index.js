import http from "http";

function runApp() {
  /**
   *
   * @param {http.IncomingMessage} request
   * @param {http.ServerResponse<http.IncomingMessage>} response
   */
  const handle_requests = (request, response) => {
    switch (request.method.toUpperCase()) {
      case "GET":
        response.write("Hello");
        break;

      default:
        response.write(`Invalid request method [${request.method}].`);
        break;
    }

    response.end();
  }

  const router = http.createServer(handle_requests);
  const port = 3333;

  router.listen(port, () => {
    console.log(`Server started at http://localhost:${port}/`);
  });
}

runApp();
