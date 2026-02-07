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

    // Default to LEARNER if no role provided
    const roleCode = role ? role.toUpperCase() : 'LEARNER';

    // Find the role in master data
    const userRole = await prisma.role.findUnique({
        where: { code: roleCode }
    });

    if (!userRole) {
        throw new Error(`Role '${roleCode}' not found`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: {
                connect: { id: userRole.id }
            }
        },
        include: {
            role: true // Include role details in response
        }
    });

    // Exclude password from return
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

const login = async (email, password) => {
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            role: true // Include role details
        }
    });

    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role.code,
            roleId: user.role.id
        },
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
