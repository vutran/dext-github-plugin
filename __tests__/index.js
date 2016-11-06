const m = require('../');

jest.mock('got');

describe('dext-github-plugin', () => {
  it('should retrieve some results', async () => {
    require('got').__setResponseBody({
      items: [
        {
          id: 10,
          name: 'dext',
          full_name: 'vutran/dext',
          owner: {
            login: 'vutran',
            id: 20,
            avatar_url: 'https://avatars.githubusercontent.com/u/1088312?v=3',
          },
        },
      ],
    });
    const results = await m.query('dext');
    expect(results.items.length).toBeGreaterThan(0);
  });

  it('should retrieve the readme contents', async () => {
    require('got').__setResponseBody({
      name: 'README.md',
      path: 'README.md',
      type: 'file',
      content: 'SGVsbG8gV29ybGQh',
      encoding: 'base64'
    });
    const details = await m.details.render({ title: 'vutran/dext' });
    expect(details).toBe('Hello World!');
  });
});
