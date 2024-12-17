export class GeneralUtility {
  /**
   * Syncronous timeout.
   * Awaiting on return promise will execute in syncronous mode.
   * @param milliseconds number of millisecond to wait
   * @returns empty promise to await for
   */
  static sleep = (milliseconds: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }; // sleep
} // GeneralUtility
