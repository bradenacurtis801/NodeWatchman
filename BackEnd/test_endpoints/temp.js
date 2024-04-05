import bcrypt from "bcrypt";
const hashedPassword = await bcrypt.hash('wpkf0224', 10)
console.log(hashedPassword)