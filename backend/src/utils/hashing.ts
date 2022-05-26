import bcrypt from "bcrypt";

function hashSecret(secret: string): string | null {
  try {
    // Generate a salt
    const salt = bcrypt.genSaltSync(10);

    // Hash secret
    return bcrypt.hashSync(secret, salt);
  } catch (error) {
    console.log(error);
  }

  return null;
}

function verifySecret(secret: string, hash: string): boolean | null {
  try {
    return bcrypt.compareSync(secret, hash);
  } catch (error) {
    console.log(error);
  }

  return null;
}

export { hashSecret, verifySecret };
