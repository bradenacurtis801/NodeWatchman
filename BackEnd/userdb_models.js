const fs = require('fs').promises;
const USERS_FILE = './db/users.json';

async function readDataFromFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // If the file does not exist, return an empty object or array depending on your structure
            return []; // or return {}; depending on your expected structure
        } else {
            throw error;
        }
    }
}

async function writeDataToFile(filePath, dataObject) {
    await fs.writeFile(filePath, JSON.stringify(dataObject, null, 2), 'utf8');
}

async function createUser(username, email, password) {
    const usersObject = await readDataFromFile(USERS_FILE);
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, email, hashedPassword, isAdmin: false };
    
    // Check if the user already exists
    const exists = usersObject.some(user => user.email === email);
    if (exists) {
        throw new Error('User already exists with this email');
    }

    usersObject.push(newUser);
    await writeUsersToFile(usersObject);
    console.log('User created successfully');
}

async function getUserByEmail(email) {
    const usersObject = await readUsersFromFile();
    return usersObject.users.find(user => user.email === email);
}

module.exports  = { createUser, getUserByEmail, readDataFromFile, writeDataToFile };