// A simple in-memory store for sharing data between tests or page objects

let sharedData: Record<string, any> = {};

/**
 * Save key-value pairs to shared data store
 * @param data - Object with keys and values to store
 */

// Supports both: saveSharedData('key', value) and saveSharedData({ key: value })
export function saveSharedData(keyOrObject: string | Record<string, any>, value?: any): void {
    if (typeof keyOrObject === 'string') {
      sharedData[keyOrObject] = value;
    } else {
      Object.assign(sharedData, keyOrObject);
    }
  }
/**
 * Retrieve all stored shared data as an object
 * @returns The entire shared data object
 */
export function getSharedData(): Record<string, any> {
  return sharedData;
}

/**
 * Retrieve value by specific key from shared data store
 * @param key - The key to retrieve
 * @returns Value associated with the key or undefined
 */
export function getSharedDataByKey(key: string): any {
  return sharedData[key];
}
