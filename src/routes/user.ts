import { Router } from 'express';
import { User } from '../entities/user';
import { hash } from 'bcrypt';
import { AppDataSource } from '../data-source';

const router = Router();

// Create a new user
router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        
        // Validate input
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        // Check if user already exists
        const userRepository = AppDataSource.getRepository(User);
        const existingUser = await userRepository.findOneBy({ email });
        
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }
        
        // Hash password
        const hashedPassword = await hash(password, 10);
        
        // Create new user
        const newUser = userRepository.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });
        
        // Save user to database
        await userRepository.save(newUser);
        
        // Return user without password
        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
