const got = require('got');

module.exports = {
  keyword: 'gh',
  action: 'openurl',
  execute: q => new Promise(resolve => {
    const opts = {
      query: {
        q: `${q} in:name`,
      },
      json: true,
    };
    got('https://api.github.com/search/repositories', opts)
      .then(res => {
        if (res.body) {
          const items = res.body.items
            .map(i => Object.assign({}, {
              title: i.full_name,
              subtitle: i.description,
              arg: i.html_url,
              icon: {
                path: i.owner.avatar_url,
              },
            }))
            .slice(0, 20);
          resolve({ items });
        }
      });
  }),
};
