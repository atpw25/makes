import test from 'ava';
import {select} from './_prompt-under-test';

test('select prompt returns default first value', async (t) => {
  const answer = await select({
    message: 'prompt',
    choices: [
      {value: 'one', title: 'One'},
      {value: 'two', title: 'Two'}
    ]
  }, [{name: 'return'}]);

  t.is(answer, 'one');
});

test('select prompt allows empty string value', async (t) => {
  const answer = await select({
    message: 'prompt',
    choices: [
      {value: '', title: 'One'},
      {value: 'two', title: 'Two'}
    ]
  }, [{name: 'return'}]);

  t.is(answer, '');
});

test('select prompt allows missing value', async (t) => {
  const answer = await select({
    message: 'prompt',
    choices: [
      {title: 'One'},
      {value: 'two', title: 'Two'}
    ]
  }, [{name: 'return'}]);

  t.is(answer, undefined);
});

test('select prompt returns user selection', async (t) => {
  const answer = await select({
    message: 'prompt',
    choices: [
      {value: 'one', title: 'One'},
      {value: 'two', title: 'Two'},
      {value: 'three', title: 'Three'}
    ]
  }, [{name: 'down'}, {name: 'return'}]);

  t.is(answer, 'two');
});

test('select prompt returns user selection, case2', async (t) => {
  const answer = await select({
    message: 'prompt',
    choices: [
      {value: 'one', title: 'One'},
      {value: 'two', title: 'Two'},
      {value: 'three', title: 'Three'}
    ]
  }, [{name: 'down'}, {name: 'down'}, {name: 'return'}]);

  t.is(answer, 'three');
});

test('select prompt returns user selection, case3', async (t) => {
  const answer = await select({
    message: 'prompt',
    choices: [
      'one',
      'two',
      'three',
    ]
  }, [{name: 'down'}, {name: 'down'}, {name: 'down'}, {name: 'return'}]);
  // wrapped to top
  t.is(answer, 'one');
});

test('select prompt returns user selection with number shortcut', async (t) => {
  const answer = await select({
    message: 'prompt',
    choices: [
      {value: 'one', title: 'One'},
      {value: 'two', title: 'Two'},
      {value: 'three', title: 'Three'}
    ]
  }, ['2', {name: 'return'}]);

  t.is(answer, 'two');
});

test('select prompt returns user selection with number shortcut, case2', async (t) => {
  const answer = await select({
    message: 'prompt',
    choices: [
      'one',
      'two',
      'three',
    ]
  }, ['3', {name: 'return'}]);

  t.is(answer, 'three');
});

test('select prompt returns user selection with number shortcut, case3', async (t) => {
  const answer = await select({
    message: 'prompt',
    choices: [
      {value: 'one', title: 'One'},
      {value: 'two', title: 'Two'},
      {value: 'three', title: 'Three'}
    ]
  }, ['1', {name: 'return'}]);

  t.is(answer, 'one');
});

test('select prompt can reset', async (t) => {
  const answer = await select({
    message: 'prompt',
    choices: [
      {value: 'one', title: 'One'},
      {value: 'two', title: 'Two'},
      {value: 'three', title: 'Three'}
    ]
  }, ['3', {name: 'g', ctrl: true}, {name: 'return'}]);

  t.is(answer, 'one');
});

test('select prompt can abort', async (t) => {
  await t.throwsAsync(select({
    message: 'prompt',
    choices: [
      {value: 'one', title: 'One'},
      {value: 'two', title: 'Two'},
      {value: 'three', title: 'Three'}
    ]
  }, ['3', {name: 'c', ctrl: true}]), {
    message: 'abort with answer three'
  });
});

test('select prompt supports terminal short-cut to start', async (t) => {
  const answer = await select({
    message: 'prompt',
    choices: [
      {value: 'one', title: 'One'},
      {value: 'two', title: 'Two'},
      {value: 'three', title: 'Three'}
    ]
  }, ['3', {name: 'a', ctrl: true}, {name: 'enter'}]);

  t.is(answer, 'one');
});

test('select prompt supports terminal short-cut to end', async (t) => {
  const answer = await select({
    message: 'prompt',
    choices: [
      {value: 'one', title: 'One'},
      {value: 'two', title: 'Two'},
      {value: 'three', title: 'Three'}
    ]
  }, [{name: 'e', ctrl: true}, {name: 'enter'}]);

  t.is(answer, 'three');
});

test('select prompt supports terminal short-cut tab', async (t) => {
  const answer = await select({
    message: 'prompt',
    choices: [
      {value: 'one', title: 'One'},
      {value: 'two', title: 'Two'},
      {value: 'three', title: 'Three'}
    ]
  }, [{name: 'tab'}, {name: 'enter'}]);

  t.is(answer, 'two');
});

test('select prompt supports space to submit', async (t) => {
  const answer = await select({
    message: 'prompt',
    choices: [
      {value: 'one', title: 'One'},
      {value: 'two', title: 'Two'},
      {value: 'three', title: 'Three'}
    ]
  }, [{name: 'tab'}, {name: 'down'}, {name: 'up'}, ' ']);

  t.is(answer, 'two');
});
