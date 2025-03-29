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

// Get all users

router.get("/", async (req, res) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const users = await userRepository.find();

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = Number(req.params.id); // Convert ID to number

        if (isNaN(userId)) {
            res.status(400).json({ message: "Invalid user ID" });
            return;
        }

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching user", error });
    }
});

export default router;
