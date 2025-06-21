function displayErrorToUser(error) {
  const ui = window.gameUI;
  if (ui && typeof ui.showError === 'function') {
    ui.showError(error);
  } else {
    alert('An unexpected error occurred: ' + (error && error.message ? error.message : error));
  }
}

function initUI() {
  return new Promise((resolve, reject) => {
    try {
      const ui = window.gameUI;
      if (!ui || typeof ui.init !== 'function') {
        return reject(new Error('UI module is not available'));
      }
      ui.init((err) => {
        if (err) reject(err);
        else resolve();
      });
    } catch (e) {
      reject(e);
    }
  });
}

function initEngine() {
  return new Promise((resolve, reject) => {
    try {
      const engine = window.gameEngine;
      if (!engine || typeof engine.init !== 'function') {
        return reject(new Error('Engine module is not available'));
      }
      const result = engine.init();
      if (result && typeof result.then === 'function') {
        result.then(resolve).catch(reject);
      } else {
        resolve();
      }
    } catch (e) {
      reject(e);
    }
  });
}

export default async function bootstrapApp() {
  try {
    await initUI();
  } catch (uiError) {
    console.error('UI initialization failed:', uiError);
    displayErrorToUser(uiError);
    return;
  }

  try {
    await initEngine();
  } catch (engineError) {
    console.error('Engine initialization failed:', engineError);
    displayErrorToUser(engineError);
  }
}
