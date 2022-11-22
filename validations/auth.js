import { body } from "express-validator"

export const registerValidation = [
    body('email', 'Wrong email format').isEmail(),
    body('password', 'Too small password').isLength({ min: 5 }),
    body('fullName', 'Name can not be empty').isLength({ min: 3 }),
    body('avatarUrl', 'Wrong link').optional().isURL()
]
