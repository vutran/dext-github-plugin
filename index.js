// GitHub icon by Freepik <http://www.flaticon.com/free-icon/github-mascot-logo-variant_38521#term=github&page=1&position=30>

const got = require('got');

// defailt API endpoint
const ENDPOINT = 'https://api.github.com';

/**
 * Makes a new request to the given endpoint
 *
 * @param {String} endpoint
 * @param {Object} options
 * @return {Promise}
 */
const makeRequest = (endpoint, options) => {
  // merge props
  const opts = Object.assign({}, { json: true }, options);
  // parse URL
  const url = `${ENDPOINT}/${endpoint.replace(/^\//, '')}`;
  // make request
  const prom = got(url, opts);
  return new Promise((resolve) => {
    prom.then(res => resolve(res.body));
  });
};

/**
 * Converst relative URLs into absolute URLs for the given repo
 *
 * @param {String} html
 * @param {String} fullName
 * @return {String}
 */
const applyRelativeUrls = (html, fullName) => {
  const url = `https://github.com/${fullName}/blob/master`;
  // replace images
  const parsed = html.replace(/\(([\w\d\s]+\.(?:png|gif|jpg|jpeg)+.*)\)/g, `(${url}/$1)`);
  return parsed;
};

/**
 * Maps the GitHub repository item to a Dext item
 *
 * @param {Object} item
 * @return {Object}
 */
const mapItems = item => Object.assign({}, {
  title: item.full_name,
  subtitle: item.description,
  arg: item.html_url,
  icon: {
    path: item.owner.avatar_url,
  },
  mods: {
    alt: {
      arg: `${item.html_url}/issues`,
      subtitle: 'View project issues.',
    },
    cmd: {
      arg: `https://github.com/${item.full_name.split('/')[0]}`,
      subtitle: 'View author\'s profile.',
    },
  },
});

/**
 * Converts a base64 string to utf8
 */
const base64ToUTF8 = (content) => {
  const buff = Buffer.from(content || '', 'base64');
  return buff.toString('utf8');
};

module.exports = {
  keyword: 'gh',
  action: 'openurl',
  helper: {
    title: 'Search GitHub repositories.',
    subtitle: 'Example: gh dext',
    icon: {
      path: './icon.png',
    },
  },
  query: q => new Promise((resolve) => {
    const opts = {
      query: {
        q: `${q} in:name`,
      },
    };
    // searches the API for repositories by name
    // https://developer.github.com/v3/search/#search-repositories
    makeRequest('/search/repositories', opts)
      .then((body) => {
        const items = body.items
          .map(mapItems)
          .slice(0, 20);
        resolve({ items });
      });
  }),
  details: {
    type: 'md',
    // retrieve the preferred README file
    // https://developer.github.com/v3/repos/contents/#get-the-readme
    render: item => new Promise((resolve) => {
      makeRequest(`/repos/${item.title}/readme`)
        .then(body => resolve(applyRelativeUrls(base64ToUTF8(body.content), item.title)));
    }),
  },
};
