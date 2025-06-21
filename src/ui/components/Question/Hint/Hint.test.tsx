/* eslint-disable react/display-name */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Hint from './Hint';
import { useHint } from '@/ui/client/useHints';

jest.mock('@/ui/client/useHints');
jest.mock('@/ui/components/Spinner', () => () => <div data-testid="spinner" />);

const mockUseHint = useHint as jest.Mock;

describe('Hint', () => {
    const requirement = 'Test requirement';
    let mockTrigger: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockTrigger = jest.fn();
    });

    it('should render the initial button to request a hint', () => {
        mockUseHint.mockReturnValue({
            data: null,
            trigger: mockTrigger,
            isMutating: false,
        });

        render(<Hint requirement={requirement} />);

        const button = screen.getByRole('button', { name: /pedir una pista/i });
        expect(button).toBeInTheDocument();
        expect(button).not.toBeDisabled();
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    it('should call the trigger function when the button is clicked', async () => {
        mockUseHint.mockReturnValue({
            data: null,
            trigger: mockTrigger,
            isMutating: false,
        });

        const user = userEvent.setup();
        render(<Hint requirement={requirement} />);
        
        const button = screen.getByRole('button', { name: /pedir una pista/i });
        await user.click(button);

        expect(mockTrigger).toHaveBeenCalledTimes(1);
    });

    it('should render the loading state when isMutating is true', () => {
        mockUseHint.mockReturnValue({
            data: null,
            trigger: mockTrigger,
            isMutating: true,
        });

        render(<Hint requirement={requirement} />);
        
        const button = screen.getByRole('button', { name: /generando/i });
        expect(button).toBeInTheDocument();
        expect(button).toBeDisabled();
        expect(screen.getByTestId('spinner')).toBeInTheDocument();
        expect(screen.getByText('Generando...')).toBeInTheDocument();
    });

    it('should render the hint text when data is available', () => {
        const hintText = 'This is a test hint.';
        mockUseHint.mockReturnValue({
            data: { hint: hintText },
            trigger: mockTrigger,
            isMutating: false,
        });

        render(<Hint requirement={requirement} />);

        expect(screen.getByText(hintText)).toBeInTheDocument();
        expect(screen.getByText('Pista:')).toBeInTheDocument();
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
    
    it('should pass the correct requirement to the useHint hook', () => {
        mockUseHint.mockReturnValue({
            data: null,
            trigger: mockTrigger,
            isMutating: false,
        });

        render(<Hint requirement={requirement} />);

        expect(mockUseHint).toHaveBeenCalledWith(requirement);
    });
});