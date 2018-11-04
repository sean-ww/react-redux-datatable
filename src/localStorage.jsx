/**
 * Set a local storage item
 *
 * @param {string} itemName The name of the item to be set.
 * @param {*} value The value to be set.
 */
export const setLocalStorageItem = (itemName, value) => {
  global.window.localStorage.setItem(itemName, JSON.stringify(value));
};

/**
 * Retrieve an item from local storage
 *
 * @param {string} itemName The name of the item to be retrieved.
 * @return {any} The local storage item.
 */
export const getLocalStorageItem = itemName => JSON.parse(global.window.localStorage.getItem(itemName));

/**
 * Remove an item from local storage
 *
 * @param {string} itemName The name of the item to be removed.
 */
export const removeLocalStorageItem = itemName => {
  global.window.localStorage.removeItem(itemName);
};

/**
 * Update a local storage item
 *
 * @param {string} itemName The name of the item to be updated.
 * @param {*} value The value to be added/updated.
 */
export const updateLocalStorageItem = (itemName, value) => {
  setLocalStorageItem(itemName, {
    ...getLocalStorageItem(itemName),
    ...value,
  });
};
