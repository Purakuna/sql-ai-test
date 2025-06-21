/* eslint-disable react/display-name */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import EERDiagram from './EERDiagram'; // Ajusta la ruta si es necesario
import { useDiagram } from '@/ui/client/useDiagram';
import mermaid from 'mermaid';

jest.mock('@/ui/client/useDiagram');
jest.mock('../Spinner', () => () => <div data-testid="spinner" />);
jest.mock('mermaid', () => ({
    initialize: jest.fn(),
    render: jest.fn(),
}));

const mockUseDiagram = useDiagram as jest.Mock;
const mockMermaidRender = mermaid.render as jest.Mock;
const mockMermaidInitialize = mermaid.initialize as jest.Mock;

describe('EERDiagram', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the loading state correctly', () => {
        mockUseDiagram.mockReturnValue({
            data: null,
            error: null,
            isLoading: true,
        });

        render(<EERDiagram />);

        expect(screen.getByTestId('spinner')).toBeInTheDocument();
        expect(screen.getByText('Generando diagrama de tablas...')).toBeInTheDocument();
        expect(screen.queryByText('Error al generar diagrama de tablas')).not.toBeInTheDocument();
    });

    it('should render the error state correctly', () => {
        mockUseDiagram.mockReturnValue({
            data: null,
            error: new Error('Failed to load'),
            isLoading: false,
        });

        render(<EERDiagram />);

        expect(screen.getByText('Error al generar diagrama de tablas')).toBeInTheDocument();
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
        expect(screen.queryByText('Generando diagrama de tablas...')).not.toBeInTheDocument();
    });

    it('should render the diagram on successful data fetch', async () => {
        const diagramDefinition = 'graph TD; A-->B;';
        const mockSvg = '<svg>mock diagram</svg>';
        const mockBindFunctions = jest.fn();
        
        mockUseDiagram.mockReturnValue({
            data: { diagram: diagramDefinition },
            error: null,
            isLoading: false,
        });
        mockMermaidRender.mockResolvedValue({ svg: mockSvg, bindFunctions: mockBindFunctions });

        const { container } = render(<EERDiagram />);

        await waitFor(() => {
            expect(mockMermaidInitialize).toHaveBeenCalledWith({ startOnLoad: false, theme: 'dark' });
            expect(mockMermaidRender).toHaveBeenCalledWith('mermaid-svg', diagramDefinition);
            const mermaidContainer = container.querySelector('.mermaid-container');
            expect(mermaidContainer).not.toBeNull();
            expect(mermaidContainer?.innerHTML).toBe(mockSvg);
            expect(mockBindFunctions).toHaveBeenCalled();
        });
    });

    it('should not attempt to render a diagram if data is missing', () => {
        mockUseDiagram.mockReturnValue({
            data: null,
            error: null,
            isLoading: false,
        });

        render(<EERDiagram />);

        expect(mockMermaidRender).not.toHaveBeenCalled();
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
        expect(screen.queryByText('Error al generar diagrama de tablas')).not.toBeInTheDocument();
    });

    it('should not attempt to render a diagram if diagram string is empty or null', () => {
        mockUseDiagram.mockReturnValue({
            data: { diagram: null },
            error: null,
            isLoading: false,
        });

        render(<EERDiagram />);
        
        expect(mockMermaidRender).not.toHaveBeenCalled();
    });
});
