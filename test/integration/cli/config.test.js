/* eslint-env node, mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { assert } from 'chai';
import path from 'path';
import { exec } from './util/childProcess';

const fixtureDir = path.relative(process.cwd(), path.join(__dirname, 'fixture'));
const binPath = path.relative(process.cwd(), path.join('bin', '_mocha'));
const testSimple = path.join(fixtureDir, 'simple/simple.js');

describe('cli --webpack-config', function () {
  it('does not throw for missing default config', function (done) {
    exec(`node ${binPath} "${testSimple}"`, (err) => {
      assert.isNull(err);
      done();
    });
  });

  it('throws when not found', function (done) {
    const configNotFound = 'xxxxxxx.js';
    exec(`node ${binPath} --webpack-config ${configNotFound} "${testSimple}"`, (err) => {
      assert.include(err.message, `Webpack config could not be found: ${configNotFound}`);
      done();
    });
  });

  it('passes --webpack-env random to config', function (done) {
    const config = path.join(fixtureDir, 'config/config.env.js');
    const env = Math.random();
    exec(`node ${binPath} --webpack-config ${config} --webpack-env ${env} "${testSimple}"`, (err, output) => {
      assert.isNull(err);
      assert.include(output, env);
      done();
    });
  });

  it('passes --webpack-env object to config', function (done) {
    const config = path.join(fixtureDir, 'config/config.env.js');
    const env = Math.random();
    exec(`node ${binPath} --webpack-config ${config} --webpack-env.test ${env} "${testSimple}"`, (err, output) => {
      assert.isNull(err);
      assert.include(output, env);
      done();
    });
  });
});
