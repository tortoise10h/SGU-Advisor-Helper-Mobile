import { call } from 'typed-redux-saga';

export function* safeCall(fn: any, ...args: any[]): Generator {
  try {
    return yield* call(fn, ...args);
  } catch (err) {
    console.log('Safe call err: ', err);
    const { error } = err;
    console.log('Safe call error: ', error);
  }
}
