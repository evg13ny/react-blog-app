import { body } from "express-validator"

export const loginValidation = [
    body('email', 'Invalid email format').isEmail(),
    body('password', 'Too small password').isLength({ min: 5 }),
]

export const registerValidation = [
    body('email', 'Invalid email format').isEmail(),
    body('password', 'Too small password').isLength({ min: 5 }),
    body('fullName', 'Name can not be empty').isLength({ min: 3 }),
    body('avatarUrl', 'Invalid avatar link').optional().isURL()
]

export const postCreateValidation = [
    body('title', 'Input title').isLength({ min: 3 }).isString(),
    body('text', 'Input text').isLength({ min: 3 }).isString(),
    body('tags', 'Wrong format').optional().isString(),
    body('imageUrl', 'Invalid image link').optional().isString()
]