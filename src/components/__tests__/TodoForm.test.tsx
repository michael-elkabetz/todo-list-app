import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../test/utils/test-utils';
import TodoForm from '../TodoForm';
import { CreateTodoRequest } from '../../types/todo';

describe('TodoForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form elements', () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText('Task')).toBeInTheDocument();
    expect(screen.getByLabelText('Category (Optional)')).toBeInTheDocument();
    expect(screen.getByLabelText('Priority')).toBeInTheDocument();
    expect(screen.getByText('Add Task')).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);

    const textInput = screen.getByLabelText('Task');
    const categoryInput = screen.getByLabelText('Category (Optional)');
    const submitButton = screen.getByText('Add Task');

    fireEvent.change(textInput, { target: { value: 'Test todo' } });
    fireEvent.change(categoryInput, { target: { value: 'Test category' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        text: 'Test todo',
        priority: 'medium',
        category: 'Test category'
      });
    });
  });

  it('does not submit form with empty text', async () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByText('Add Task');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('resets form after successful submission', async () => {
    mockOnSubmit.mockResolvedValue(undefined);
    render(<TodoForm onSubmit={mockOnSubmit} />);

    const textInput = screen.getByLabelText('Task');
    const categoryInput = screen.getByLabelText('Category (Optional)');
    const submitButton = screen.getByText('Add Task');

    fireEvent.change(textInput, { target: { value: 'Test todo' } });
    fireEvent.change(categoryInput, { target: { value: 'Test category' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(textInput).toHaveValue('');
      expect(categoryInput).toHaveValue('');
    });
  });

  it('disables submit button when loading', () => {
    render(<TodoForm onSubmit={mockOnSubmit} loading={true} />);

    const submitButton = screen.getByText('Adding...');
    expect(submitButton).toBeDisabled();
  });

  it('disables submit button when text is empty', () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByText('Add Task');
    expect(submitButton).toBeDisabled();
  });
});
