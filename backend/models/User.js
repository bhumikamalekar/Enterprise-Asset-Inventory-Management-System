const bcrypt = require('bcryptjs');

// Mock user database
const users = [
    {
        id: '1',
        username: 'admin',
        email: 'admin@college.edu',
        password: '', 
        role: 'ADMIN',
        department: 'General'
    },
    {
        id: '2',
        username: 'hod.cse',
        email: 'hod.cse@college.edu',
        password: '', 
        role: 'DEPARTMENT',
        department: 'CSE'
    },
    {
        id: '3',
        username: 'hod.ai',
        email: 'hod.ai@college.edu',
        password: '',
        role: 'DEPARTMENT',
        department: 'AI'
    },
    {
        id: '4',
        username: 'hod.agri',
        email: 'hod.agri@college.edu',
        password: '',
        role: 'DEPARTMENT',
        department: 'Agriculture'
    }
];

// Hash passwords for the mock data
const initializeMockUsers = async () => {
    console.log('Initializing mock users...');
    for (let user of users) {
        const password = user.username === 'admin' ? 'admin123' : 'hod123';
        user.password = await bcrypt.hash(password, 10);
    }
    console.log('Mock users initialized.');
};

initializeMockUsers();

const findByUsername = async (identifier) => {
    console.log(`Searching for user with identifier: ${identifier}`);
    const normalizedIdentifier = identifier.toLowerCase();
    const user = users.find(u => 
        u.username.toLowerCase() === normalizedIdentifier || 
        u.email.toLowerCase() === normalizedIdentifier
    );
    if (!user) console.log('User not found in mock DB');
    return user;
};

const findById = async (id) => {
    return users.find(u => u.id === id);
};

const addUser = async (userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = {
        id: (users.length + 1).toString(),
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: userData.role || 'DEPARTMENT',
        department: userData.department || 'General'
    };
    users.push(newUser);
    return newUser;
};

const getAllUsers = async () => {
    return users;
};

module.exports = {
    findByUsername,
    findById,
    addUser,
    getAllUsers
};


