import nodemailer from 'nodemailer';

// Create transporter (using Gmail as example)
const createTransporter = () => {
    return nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

// Send admin approval notification
export const sendAdminApprovalEmail = async (userEmail, approved) => {
    try {
        const transporter = createTransporter();

        const subject = approved
            ? 'Admin Request Approved'
            : 'Admin Request Rejected';

        const text = approved
            ? 'Congratulations! Your admin request has been approved. You can now access the admin dashboard.'
            : 'Your admin request has been reviewed and rejected. Please contact support for more information.';

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: subject,
            text: text,
        };

        await transporter.sendMail(mailOptions);
        console.log('Admin approval email sent successfully');
    } catch (error) {
        console.error('Error sending admin approval email:', error);
    }
};

// Send welcome email
export const sendWelcomeEmail = async (userEmail, userName) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Welcome to Our Blog Platform',
            text: `Hello ${userName},\n\nWelcome to our blog platform! We're excited to have you on board.\n\nBest regards,\nThe Blog Team`,
        };

        await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully');
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
};