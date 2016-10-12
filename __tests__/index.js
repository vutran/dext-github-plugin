const m = require('../');

describe('module', () => {
  it('should retrieve some results', async () => {
    const results = await m.query('dext');
    expect(results).toBeTruthy();
  });

  it('should retrieve the readme contents', async () => {
    const details = await m.details.render({ title: 'vutran/dext' });
    expect(details).toBeTruthy();
  });
});
