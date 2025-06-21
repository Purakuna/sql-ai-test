/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Question from './Question';
import { useExamStore } from '@/ui/store';
import { usePreview } from '@/ui/client/usePreview';
import { Question as QuestionType } from "@/shared/models/Question";

jest.mock('@/ui/store');
jest.mock('@/ui/client/usePreview');
jest.mock('./Hint', () => ({ __esModule: true, default: ({ requirement }: { requirement: string }) => <div data-testid="hint">{requirement}</div> }));
jest.mock('../Spinner', () => ({ __esModule: true, default: () => <div data-testid="spinner" /> }));
jest.mock('./PreviewModal', () => ({ __esModule: true, default: ({ isOpen, onClose, result }: { isOpen: boolean, onClose: () => void, result: any }) => isOpen ? (
    <div data-testid="preview-modal">
        <button onClick={onClose}>Close</button>
        <pre>{JSON.stringify(result)}</pre>
    </div>
) : null }));
jest.mock('@uiw/react-codemirror', () => ({
    __esModule: true,
    default: ({ value, onChange }: { value: string, onChange: (val: string) => void }) => (
        <textarea
            data-testid="codemirror"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    )
}));

const mockUseExamStore = useExamStore as unknown as jest.Mock;
const mockUsePreview = usePreview as unknown as jest.Mock;

const mockQuestion: QuestionType = {
    id: 'q1',
    title: 'Pregunta 1',
    points: 1.5,
    prompt: 'Escribe una consulta para',
    requirement: 'seleccionar todos los usuarios.'
};

describe('Question', () => {
    let mockSetQuery: jest.Mock;
    let mockTrigger: jest.Mock;
    
    beforeEach(() => {
        jest.clearAllMocks();
        mockSetQuery = jest.fn();
        mockTrigger = jest.fn();

        mockUseExamStore.mockReturnValue({
            queries: {},
            setQuery: mockSetQuery,
        });
        mockUsePreview.mockReturnValue({
            data: null,
            trigger: mockTrigger,
            isMutating: false,
        });
    });

    it('should render initial state correctly', () => {
        render(<Question question={mockQuestion} />);

        expect(screen.getByText('Pregunta 1 (1.5 Puntos)')).toBeInTheDocument();
        expect(screen.getByTestId('codemirror')).toHaveValue('');
        expect(screen.getByRole('button', { name: '▶️ Ejecutar Consulta' })).toBeInTheDocument();
        expect(screen.getByTestId('hint')).toHaveTextContent(mockQuestion.requirement);
        expect(screen.queryByTestId('preview-modal')).not.toBeInTheDocument();
    });

    it('should display the query from the store if it exists', () => {
        const existingQuery = 'SELECT * FROM test_table;';
        mockUseExamStore.mockReturnValue({
            queries: { [mockQuestion.id]: existingQuery },
            setQuery: mockSetQuery,
        });

        render(<Question question={mockQuestion} />);
        expect(screen.getByTestId('codemirror')).toHaveValue(existingQuery);
    });

    it('should call setQuery from the store when typing in the editor', async () => {
        const user = userEvent.setup();
        render(<Question question={mockQuestion} />);

        const editor = screen.getByTestId('codemirror');
        await user.type(editor, 'SELECT name');
        
        expect(mockSetQuery).toHaveBeenCalledWith(expect.any(String), mockQuestion.id);
    });

    it('should call trigger with the current query when "Ejecutar Consulta" is clicked', async () => {
        const user = userEvent.setup();
        const currentQuery = 'SELECT * FROM users';
        
        mockUseExamStore.mockReturnValue({
            queries: { [mockQuestion.id]: currentQuery },
            setQuery: mockSetQuery,
        });
        mockUsePreview.mockReturnValue({
            data: null,
            trigger: mockTrigger,
            isMutating: false,
        });
    
        render(<Question question={mockQuestion} />);
        
        const executeButton = screen.getByRole('button', { name: '▶️ Ejecutar Consulta' });
        await user.click(executeButton);
    
        expect(mockTrigger).toHaveBeenCalledWith(currentQuery);
    });
    
    it('should show the loading state when isMutating is true', () => {
        mockUsePreview.mockReturnValue({
            data: null,
            trigger: mockTrigger,
            isMutating: true,
        });
    
        render(<Question question={mockQuestion} />);
        
        const executeButton = screen.getByRole('button', { name: /generando/i });
        expect(executeButton).toBeDisabled();
        expect(screen.getByTestId('spinner')).toBeInTheDocument();
        expect(screen.getByText('Generando...')).toBeInTheDocument();
    });

    it('should open the preview modal with data after a successful preview', async () => {
        const previewData = { status: 'success', headers: ['name'], rows: [['John']] };
        
        const { rerender } = render(<Question question={mockQuestion} />);
        
        mockUsePreview.mockReturnValue({
            data: previewData,
            trigger: mockTrigger,
            isMutating: false,
        });

        rerender(<Question question={mockQuestion} />);
        
        await waitFor(() => {
            expect(screen.getByTestId('preview-modal')).toBeInTheDocument();
        });

        expect(screen.getByText(JSON.stringify(previewData))).toBeInTheDocument();
    });

    it('should close the preview modal when its close button is clicked', async () => {
        const user = userEvent.setup();
        const previewData = { status: 'success', headers: ['name'], rows: [['John']] };

        mockUsePreview.mockReturnValue({ data: previewData, trigger: mockTrigger, isMutating: false });

        render(<Question question={mockQuestion} />);
        await waitFor(() => {
            expect(screen.getByTestId('preview-modal')).toBeInTheDocument();
        });

        const closeButton = screen.getByRole('button', { name: 'Close' });
        await user.click(closeButton);

        expect(screen.queryByTestId('preview-modal')).not.toBeInTheDocument();
    });
});