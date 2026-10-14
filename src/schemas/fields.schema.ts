import { z } from 'zod'

export const emailFieldSchema = z.email('Invalid email address').trim().toLowerCase().max(254, 'Email is too long')

export const phoneFieldSchema = z
	.string()
	.trim()
	.min(1, 'Phone is required')
	.max(25)
	.regex(/^[+0-9()\-\s]+$/)
	.refine((value) => {
		const digits = value.replace(/\D/g, '')
		return digits.length >= 6 && digits.length <= 15
	}, 'Invalid phone number')

export const passwordFieldSchema = z
	.string()
	.trim()
	.min(8, 'Password must be at least 8 characters')
	.max(128, 'Password must be at most 128 characters')

export const passwordConfirmationFieldsSchema = z
	.object({
		password: passwordFieldSchema,
		confirmPassword: z.string().trim().min(1, 'Confirm password is required'),
	})
	.refine((values) => values.password === values.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	})
