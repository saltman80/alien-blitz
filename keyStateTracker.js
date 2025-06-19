let keyState = {};

let initialized = false;

function handleKeyDown(event) {
  keyState[event.code] = true;
}

function handleKeyUp(event) {
  delete keyState[event.code];
}

function clearKeyStates() {
  keyState = {};
}

export function initKeyStateTracker() {
  if (initialized) return;
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  window.addEventListener('blur', clearKeyStates);
  initialized = true;
}

export function teardownKeyStateTracker() {
  if (!initialized) return;
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
  window.removeEventListener('blur', clearKeyStates);
  clearKeyStates();
  initialized = false;
}

export function isKeyDown(key) {
  return !!keyState[key];
}