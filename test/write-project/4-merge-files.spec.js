import test from 'ava';
import mergeFiles from '../../lib/write-project/4-merge-files';
import Vinyl from 'vinyl';

test.cb('mergeFiles bypasses unique file', t => {
  const merge = mergeFiles();
  merge.write(new Vinyl({
    cwd: '/',
    base: '/test',
    path: '/test/foo/bar.ext',
    contents: Buffer.from('abc')
  }));

  const files = [];
  merge.on('data', file => files.push(file));

  merge.end();
  merge.once('end', () => {
    t.is(files.length, 1);
    t.is(files[0].path.replace(/\\/g, '/'), '/test/foo/bar.ext');
    t.is(files[0].contents.toString(), 'abc');
    t.end();
  });
});

test.cb('mergeFiles by default use last file with same relative path', t => {
  const merge = mergeFiles();
  merge.write(new Vinyl({
    cwd: '/',
    base: '/test',
    path: '/test/foo/bar.ext',
    contents: Buffer.from('abc')
  }));
  merge.write(new Vinyl({
    cwd: '/',
    base: '/f1',
    path: '/f1/foo/bar.ext',
    contents: Buffer.from('cde')
  }));
  merge.write(new Vinyl({
    cwd: '/',
    base: '/f2',
    path: '/f2/foo/bar.ext',
    contents: Buffer.from('efg')
  }));

  const files = [];
  merge.on('data', file => files.push(file));

  merge.end();
  merge.once('end', () => {
    t.is(files.length, 1);
    t.is(files[0].path.replace(/\\/g, '/'), '/f2/foo/bar.ext');
    t.is(files[0].contents.toString(), 'efg');
    t.end();
  });
});

test.cb('mergeFiles by default merges json files', t => {
  const merge = mergeFiles();
  merge.write(new Vinyl({
    cwd: '/',
    base: '/test',
    path: '/test/foo/bar.json',
    contents: Buffer.from('{"a":1}')
  }));
  merge.write(new Vinyl({
    cwd: '/',
    base: '/f1',
    path: '/f1/foo/bar.json',
    contents: Buffer.from('{"a":2,"b":[1,2]}')
  }));
  merge.write(new Vinyl({
    cwd: '/',
    base: '/f2',
    path: '/f2/foo/bar.json',
    contents: Buffer.from('{"b":[2,3]}')
  }));

  const files = [];
  merge.on('data', file => files.push(file));

  merge.end();
  merge.once('end', () => {
    t.is(files.length, 1);
    t.is(files[0].path.replace(/\\/g, '/'), '/test/foo/bar.json');
    t.deepEqual(JSON.parse(files[0].contents.toString()), {
      a:2, b: [1,2,3]
    });
    t.end();
  });
});

test.cb('mergeFiles cleanup single json file', t => {
  const merge = mergeFiles();
  merge.write(new Vinyl({
    cwd: '/',
    base: '/test',
    path: '/test/foo/bar.json',
    contents: Buffer.from('{"a":1,}')
  }));

  const files = [];
  merge.on('data', file => files.push(file));

  merge.end();
  merge.once('end', () => {
    t.is(files.length, 1);
    t.is(files[0].path.replace(/\\/g, '/'), '/test/foo/bar.json');
    t.deepEqual(JSON.parse(files[0].contents.toString()), {
      a:1
    });
    t.end();
  });
});

test.cb('mergeFiles by default appends readme file', t => {
  const merge = mergeFiles();
  merge.write(new Vinyl({
    cwd: '/',
    base: '/test',
    path: '/test/foo/readme.txt',
    contents: Buffer.from('foo')
  }));
  merge.write(new Vinyl({
    cwd: '/',
    base: '/f1',
    path: '/f1/foo/readme.txt',
    contents: Buffer.from('bar')
  }));
  merge.write(new Vinyl({
    cwd: '/',
    base: '/f2',
    path: '/f2/foo/readme.txt',
    contents: Buffer.from('lo')
  }));

  const files = [];
  merge.on('data', file => files.push(file));

  merge.end();
  merge.once('end', () => {
    t.is(files.length, 1);
    t.is(files[0].path.replace(/\\/g, '/'), '/test/foo/readme.txt');
    t.is(files[0].contents.toString(), 'foo\nbar\nlo');
    t.end();
  });
});

test.cb('mergeFiles by default appends readme file, case2', t => {
  const merge = mergeFiles();
  merge.write(new Vinyl({
    cwd: '/',
    base: '/test',
    path: '/test/foo/README',
    contents: Buffer.from('foo')
  }));
  merge.write(new Vinyl({
    cwd: '/',
    base: '/f1',
    path: '/f1/foo/README',
    contents: Buffer.from('bar')
  }));
  merge.write(new Vinyl({
    cwd: '/',
    base: '/f2',
    path: '/f2/foo/README',
    contents: Buffer.from('lo')
  }));

  const files = [];
  merge.on('data', file => files.push(file));

  merge.end();
  merge.once('end', () => {
    t.is(files.length, 1);
    t.is(files[0].path.replace(/\\/g, '/'), '/test/foo/README');
    t.is(files[0].contents.toString(), 'foo\nbar\nlo');
    t.end();
  });
});