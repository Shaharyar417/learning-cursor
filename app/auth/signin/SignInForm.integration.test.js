import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignInForm from './SignInForm';

describe('SignInForm Integration', () => {
    it('allows user to type email and password', async () => {
        render(<SignInForm />);
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        await userEvent.type(emailInput, 'test@example.com');
        await userEvent.type(passwordInput, 'password123');
        expect(emailInput).toHaveValue('test@example.com');
        expect(passwordInput).toHaveValue('password123');
    });

    it('submits the form', async () => {
        render(<SignInForm />);
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const button = screen.getByRole('button', { name: /sign in/i });
        await userEvent.type(emailInput, 'test@example.com');
        await userEvent.type(passwordInput, 'password123');
        await userEvent.click(button);
        // You can add more assertions here if the form shows a loading state or error message
    });
}); 