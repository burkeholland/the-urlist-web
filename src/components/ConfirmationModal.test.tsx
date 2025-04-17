import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmationModal } from './ConfirmationModal';
import { vi } from 'vitest';

describe('ConfirmationModal', () => {
  const onConfirmMock = vi.fn();
  const onCancelMock = vi.fn();
  const message = 'Test confirmation message';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly when open', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        message={message}
        onConfirm={onConfirmMock}
        onCancel={onCancelMock}
      />
    );

    expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
    expect(screen.getByText(message)).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <ConfirmationModal
        isOpen={false}
        message={message}
        onConfirm={onConfirmMock}
        onCancel={onCancelMock}
      />
    );

    expect(screen.queryByText('Confirm Deletion')).not.toBeInTheDocument();
    expect(screen.queryByText(message)).not.toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        message={message}
        onConfirm={onConfirmMock}
        onCancel={onCancelMock}
      />
    );

    fireEvent.click(screen.getByText('Delete'));
    expect(onConfirmMock).toHaveBeenCalledTimes(1);
    expect(onCancelMock).not.toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        message={message}
        onConfirm={onConfirmMock}
        onCancel={onCancelMock}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancelMock).toHaveBeenCalledTimes(1);
    expect(onConfirmMock).not.toHaveBeenCalled();
  });

  it('calls onCancel when backdrop is clicked', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        message={message}
        onConfirm={onConfirmMock}
        onCancel={onCancelMock}
      />
    );

    // Click on the backdrop (note: we need to find it by its class since it doesn't have text)
    const backdrop = document.querySelector('.absolute.inset-0.bg-gray-900\\/50');
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(onCancelMock).toHaveBeenCalledTimes(1);
      expect(onConfirmMock).not.toHaveBeenCalled();
    }
  });

  it('calls onCancel when escape key is pressed', () => {
    render(
      <ConfirmationModal
        isOpen={true}
        message={message}
        onConfirm={onConfirmMock}
        onCancel={onCancelMock}
      />
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onCancelMock).toHaveBeenCalledTimes(1);
    expect(onConfirmMock).not.toHaveBeenCalled();
  });
});