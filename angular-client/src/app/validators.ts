import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const hasUppercase: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = control.value;
  if (value && !/[A-Z]/.test(value)) {
    return { uppercase: true };
  }
  return null;
};

export const hasNumber: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = control.value;
  if (value && !/\d/.test(value)) {
    return { number: true };
  }
  return null;
};

export const hasSpecialCharacter: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = control.value;
  if (value && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
    return { specialCharacter: true };
  }
  return null;
};

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (control.value.password === control.value.repeatpassword) {
    return { passwordMismatch: true };
  }
  return null;
};

export const commaSeparatedStringsValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = control.value;

  if (typeof value !== 'string')
    return { invalidFormat: 'Value must be a string' };

  if (value.trim() === '') return null;

  const items = value.split(',').map((item) => item.trim());

  const invalidItems = items.filter((item) => item === '');

  return invalidItems.length > 0
    ? { commaSeparatedStringsValidator: true }
    : null;
};

export function containsWordValidator(requiredWord: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toLowerCase() || '';

    if (value.includes(requiredWord.toLowerCase())) {
      return { containsWordValidator: true };
    }
    return null;
  };
}
