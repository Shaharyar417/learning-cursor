import React from 'react';
import { render, screen } from '@testing-library/react';
import SignInPage from './page';

describe('SignInPage', () => {
    it('renders the heading and register link', () => {
        render(<SignInPage />);
        expect(screen.getByRole('heading', { name: /sign in to this social media platform/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /create a new account/i })).toHaveAttribute('href', '/auth/register');
    });
}); 