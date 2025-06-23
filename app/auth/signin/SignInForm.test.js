import React from 'react';
import { render, screen } from '@testing-library/react';
import SignInForm from './SignInForm';

describe('SignInForm', () => {
    it('renders email and password fields', () => {
        render(<SignInForm />);
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('renders a sign in button', () => {
        render(<SignInForm />);
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });
}); 