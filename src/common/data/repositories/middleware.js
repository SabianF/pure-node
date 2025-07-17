/**
 *
 * @param {Request} request
 * @param {Response} response
 */
export function logRequests(request, response) {
  const date = new Date();
  const year = date.getFullYear().toString().padStart(4, "0");
  const month = date.getMonth().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const second = date.getSeconds().toString().padStart(2, "0");
  const millisecond = date.getMilliseconds().toString().padStart(3, "0");
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  console.log(
    [
      `${year}-${month}-${day} ${hour}:${minute}:${second}.${millisecond} (${timezone})`,
      request.method,
      request.url,
    ].join(" "),
  );
}
