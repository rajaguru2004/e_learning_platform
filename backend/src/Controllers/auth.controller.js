const authService = require('../Services/auth.service');
const sendResponse = require('../Utils/response');

const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return sendResponse(res, 400, false, 'Please provide all required fields');
        }

        const user = await authService.register({ name, email, password, role });
        return sendResponse(res, 201, true, 'User registered successfully', user);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return sendResponse(res, 400, false, 'Please provide email and password');
        }

        const data = await authService.login(email, password);
        return sendResponse(res, 200, true, 'Login successful', data);
    } catch (error) {
        return sendResponse(res, 401, false, error.message);
    }
};

module.exports = {
    register,
    login,
};
