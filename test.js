
const _format = require('./')
const test = require('ava')

const identity = (x) => x

const identityFormatter = {
  punctuation: identity,
  property: identity,
  literal: identity,
  number: identity,
  string: identity
}

const format = (obj, depth, offset) =>
  _format(obj, depth, identityFormatter, offset)

test('literals', (t) => {
  t.true(format({ val: true }).includes('true'))
  t.true(format({ val: false }).includes('false'))
  t.true(format({ val: null }).includes('null'))
  t.true(format({ val: undefined }).includes('undefined'))
})

test('strings', (t) => {
   t.true(format({ val: 'hello world' }).includes('"hello world"'))
})

test('numbers', (t) => {
  t.true(format({ val: 12 }).includes('12'))
  t.true(format({ val: 12e10 }).includes('120000000000'))
  t.true(format({ val: 9.99 }).includes('9.99'))
  t.true(format({ val: -200 }).includes('-200'))
  t.true(format({ val: Infinity }).includes('Infinity'))
})

test('functions', (t) => {
  const normalFn = format({ helloWorld: () => {} })
  t.true(normalFn.includes('[Function helloWorld]'))

  const genFn = format({ helloWorld: function *() {} })
  t.true(genFn.includes('[GeneratorFunction helloWorld]'))
})

test('depth', (t) => {
  const actual = {
    a: {
      b: true,
      c: {
        d: true
      }
    }
  }

  const fmtNoDepth = format(actual, 0)
  t.true(fmtNoDepth.includes('(collapsed)'))
  t.false(fmtNoDepth.includes('b: true'))
  t.false(fmtNoDepth.includes('d: true'))

  const fmtOneLevel = format(actual, 1)
  t.true(fmtOneLevel.includes('(collapsed)'))
  t.true(fmtOneLevel.includes('b: true'))
  t.false(fmtOneLevel.includes('d: true'))
})
