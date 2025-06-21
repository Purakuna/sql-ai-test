import React from 'react';
import { render, screen } from '@testing-library/react';
import QuestionFeedback from './QuestionFeedback';
import { Question } from '@/shared/models/Question';
import { QuestionEvaluation } from '@/lib/models/EvaluationResults';

jest.mock('@uiw/react-codemirror', () => ({
    __esModule: true,
    default: ({ value }: { value: string }) => (
        <pre data-testid="codemirror-readonly">{value}</pre>
    )
}));

const mockQuestion: Question = {
    id: 'q1',
    title: 'Pregunta de Prueba',
    points: 1.5,
    prompt: 'Dada la tabla de usuarios,',
    requirement: 'selecciona a todos los que viven en Colombia.'
};

const mockQuery = "SELECT * FROM users WHERE country = 'Colombia';";

describe('QuestionFeedback', () => {

    it('should render nothing if questionEvaluation is null', () => {
        const { container } = render(
            <QuestionFeedback
                question={mockQuestion}
                query={mockQuery}
                questionEvaluation={null}
            />
        );
        expect(container.firstChild).toBeNull();
    });

    it('should render the "Correcto" state', () => {
        const mockEvaluation: QuestionEvaluation = {
            id: 'q1',
            isValid: true,
            feedback: '¡Excelente! La consulta es perfecta.',
            finalGrade: 100
        };

        render(
            <QuestionFeedback
                question={mockQuestion}
                query={mockQuery}
                questionEvaluation={mockEvaluation}
            />
        );

        expect(screen.getByText('Pregunta de Prueba (1.5 Puntos)')).toBeInTheDocument();
        expect(screen.getByText(/selecciona a todos los que viven en Colombia/)).toBeInTheDocument();
        expect(screen.getByTestId('codemirror-readonly')).toHaveTextContent(mockQuery);
        expect(screen.getByText('¡Excelente! La consulta es perfecta.')).toBeInTheDocument();
        
        const badge = screen.getByText(/Correcto/);
        expect(badge).toHaveTextContent('Correcto (1.50 pts)');
        expect(badge).toHaveClass('bg-green-500/20', 'text-green-300');
    });

    it('should render the "Parcialmente Correcto" state', () => {
        const mockEvaluation: QuestionEvaluation = {
            id: 'q1',
            isValid: true,
            feedback: 'Casi, te faltó una condición en el WHERE.',
            finalGrade: 50
        };

        render(
            <QuestionFeedback
                question={mockQuestion}
                query={mockQuery}
                questionEvaluation={mockEvaluation}
            />
        );

        // (50/100) * 1.5 = 0.75
        const badge = screen.getByText(/Parcialmente Correcto/);
        expect(badge).toHaveTextContent('Parcialmente Correcto (0.75 pts)');
        expect(badge).toHaveClass('bg-yellow-500/20', 'text-yellow-300');
    });

    it('should render the "Incorrecto" state', () => {
        const mockEvaluation: QuestionEvaluation = {
            id: 'q1',
            isValid: false,
            feedback: 'La sintaxis de la consulta es incorrecta.',
            finalGrade: 0
        };

        render(
            <QuestionFeedback
                question={mockQuestion}
                query={mockQuery}
                questionEvaluation={mockEvaluation}
            />
        );

        const badge = screen.getByText(/Incorrecto/);
        expect(badge).toHaveTextContent('Incorrecto (0.0 pts)');
        expect(badge).toHaveClass('bg-red-500/20', 'text-red-300');
    });
});
