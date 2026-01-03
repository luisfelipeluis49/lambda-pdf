// Minimal env stubs for emscripten-built wasm
let tempRet0 = 0;
export function getTempRet0() {
  return tempRet0;
}
export function setTempRet0(v) {
  tempRet0 = v;
}
// invoke_* thunks: just throw to surface unexpected calls
function unimplemented(name) {
  return () => {
    throw new Error(`env stub ${name} called`);
  };
}
export const invoke_vi = unimplemented("invoke_vi");
export const __cxa_find_matching_catch_2 = unimplemented("__cxa_find_matching_catch_2");
export const __resumeException = unimplemented("__resumeException");
export const invoke_vii = unimplemented("invoke_vii");
export const invoke_viii = unimplemented("invoke_viii");
export const invoke_viiiii = unimplemented("invoke_viiiii");
export const invoke_iiii = unimplemented("invoke_iiii");
export const invoke_v = unimplemented("invoke_v");
export const invoke_viiii = unimplemented("invoke_viiii");
export const invoke_ii = unimplemented("invoke_ii");
export const invoke_iiiiii = unimplemented("invoke_iiiiii");
export const __syscall_getcwd = () => 0;
