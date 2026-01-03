// Minimal WASI stubs for test execution
export const args_sizes_get = () => 0;
export const args_get = () => 0;
export const environ_sizes_get = () => 0;
export const environ_get = () => 0;
export const fd_write = () => 0;
export const proc_exit = (code) => {
  // Ignore exit to keep host alive
  if (code !== 0) console.warn(`wasi proc_exit(${code}) ignored`);
};
