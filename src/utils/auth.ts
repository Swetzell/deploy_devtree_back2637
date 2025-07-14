import bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

//funcion para comprobar password
export const checkPassword = async (enteredPassword: string, hash: string) => {
  return await bcrypt.compare(enteredPassword, hash);
  //console.log(enteredPassword)
  //console.log(hash)
}