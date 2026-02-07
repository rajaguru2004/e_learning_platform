const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { prisma } = require('../Prisma/client');

const register = async (userData) => {
    const { name, email, password, role } = userData;

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: role || 'USER',
        },
    });

    // Exclude password from return
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

const login = async (email, password) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
};

module.exports = {
    register,
    login,
};
