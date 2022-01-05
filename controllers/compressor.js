import compression from 'compression';

/**
 * Function for supporting compression on request
 * @param {*} req - request object
 * @param {*} res - response object
 */
export default function (req, res) {
  // Logger.log('request headers:', req.headers);
  // Logger.log('encoding request header:', req.headers['accept-encoding']);

  if (req.headers['accept-encoding']
    && req.headers['accept-encoding'].indexOf('gzip') !== -1) {
    // don't compress responses with this request header
    return true;
  }

  // fallback to standard filter function
  return compression.filter(req, res);
}
