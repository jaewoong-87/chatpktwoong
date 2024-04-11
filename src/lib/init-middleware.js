// lib/init-middleware.js

function initMiddleware(middleware) {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          reject(result);
        }
        resolve(result);
      });
    });
}

export default initMiddleware;
