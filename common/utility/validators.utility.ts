export class Validators {
  /**
   * Check if an email is well formatted.
   * @param email email to ckeck
   * @returns true if well formatted, false otherwise
   */
  static isValidEmail = (email: string): boolean => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };
} // Validators
