export const validateForm = (email: any, password: any, name: string) => {
  const isEmailValid = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/.test(email);

  if (!isEmailValid) return "Please enter a valid email address";

  return null;
};

export const isNameValidation = (name: string) => {
  const isNameValid = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/.test(name);

  if (!isNameValid)
    return " userName is not valid. Name contains atleast one number.";

  return null;
};

export const isPasswordValid = (password: any) => {
  const isPasswordValid =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/.test(
      password
    );

  if (!isPasswordValid)
    return "Your password must contain  8 characters and numbers and one special characters.";

  return null;
};
