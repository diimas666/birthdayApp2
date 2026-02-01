/**
 * @format
 */

import { AppRegistry, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// #region agent log
const _dbg = (loc, msg, data, hyp) => {
  const payload = { location: loc, message: msg, data, hypothesisId: hyp, platform: Platform.OS };
  console.log('[DEBUG]', JSON.stringify(payload));
  fetch('http://127.0.0.1:7244/ingest/be24e36e-c29f-4989-be54-b71a377e8d68',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...payload,timestamp:Date.now(),sessionId:'debug-session'})}).catch(()=>{});
};
_dbg('index.js:entry', 'entry before register', { appName }, 'H4');
const _origHandler = global.ErrorUtils?.getGlobalHandler?.();
if (global.ErrorUtils?.setGlobalHandler) {
  global.ErrorUtils.setGlobalHandler((err, isFatal) => {
    _dbg('index.js:globalError', 'unhandled error', { message: err?.message, name: err?.name, isFatal }, 'H2');
    if (_origHandler) _origHandler(err, isFatal); else throw err;
  });
}
// #endregion

AppRegistry.registerComponent(appName, () => App);
