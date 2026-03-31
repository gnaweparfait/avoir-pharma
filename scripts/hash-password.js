import bcrypt from "bcrypt";

const password = "Gnawe2001@123";

const hash = await bcrypt.hash(password, 10);

console.log(hash);