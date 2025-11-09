import mongoose from 'mongoose';
import User from '../models/User.mjs';
import dotenv from 'dotenv';

dotenv.config();

const seedRootAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Check if root admin already exists
        const existingAdmin = await User.findOne({ root: true });

        if (!existingAdmin) {
            const rootAdmin = new User({
                name: 'Root Admin',
                email: 'root@admin.com',
                password: 'admin123', // This will be hashed by the pre-save hook
                role: 'admin',
                status: 'active',
                root: true,
                bio: 'System root administrator'
            });

            await rootAdmin.save();
            console.log('Root admin created successfully');
            console.log('Email: root@admin.com');
            console.log('Password: admin123');
            console.log('Please change the password after first login!');
        } else {
            console.log('Root admin already exists');
        }

        await mongoose.disconnect();
        console.log('Database disconnected');
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedRootAdmin();