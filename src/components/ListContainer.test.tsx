// ListContainer.test.tsx
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ListContainer } from './ListContainer';
import React from 'react';
import { vi } from 'vitest';

global.fetch = vi.fn();

describe('ListContainer', () => {
  const listId = 1;
  const links = [
    { id: 1, title: 'Link 1', description: 'Desc 1', url: 'https://a.com', image: '', position: 1, list_id: 1, created_at: '' },
    { id: 2, title: 'Link 2', description: 'Desc 2', url: 'https://b.com', image: '', position: 2, list_id: 1, created_at: '' },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
    // Mock window.confirm to return true by default
    vi.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  it('shows loading state initially', () => {
    (fetch as any).mockResolvedValue({ ok: true, json: async () => ({ title: '', description: '' }) });
    render(<ListContainer listId={listId} />);
    // Check for a skeleton loader by class
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders list title, description, and links', async () => {
    (fetch as any)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ title: 'My List', description: 'desc' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => links });
    render(<ListContainer listId={listId} />);
    await waitFor(() => expect(screen.getByText('My List')).toBeInTheDocument());
    expect(screen.getByText('desc')).toBeInTheDocument();
    expect(screen.getByText('Link 1')).toBeInTheDocument();
    expect(screen.getByText('Link 2')).toBeInTheDocument();
  });

  it('handles delete link when confirmed', async () => {
    (fetch as any)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ title: 'My List', description: '' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => links })
      .mockResolvedValueOnce({ ok: true });
    render(<ListContainer listId={listId} />);
    await waitFor(() => expect(screen.getByText('Link 1')).toBeInTheDocument());
    
    // Confirm deletion
    (window.confirm as any).mockReturnValueOnce(true);
    
    fireEvent.click(screen.getAllByLabelText(/delete link/i)[0]);
    
    // Verify confirmation dialog was shown
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete Link 1?');
    
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/links/1', expect.anything()));
  });

  it('cancels delete link when not confirmed', async () => {
    (fetch as any)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ title: 'My List', description: '' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => links });
    
    render(<ListContainer listId={listId} />);
    await waitFor(() => expect(screen.getByText('Link 1')).toBeInTheDocument());
    
    // Cancel deletion
    (window.confirm as any).mockReturnValueOnce(false);
    
    fireEvent.click(screen.getAllByLabelText(/delete link/i)[0]);
    
    // Verify confirmation dialog was shown
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete Link 1?');
    
    // Ensure the fetch delete request was NOT made
    expect(fetch).not.toHaveBeenCalledWith('/api/links/1', expect.objectContaining({ method: 'DELETE' }));
  });

  it('handles edit link', async () => {
    (fetch as any)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ title: 'My List', description: '' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => links })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ title: 'Edited', url: 'https://a.com', description: 'Desc 1' }) });
    render(<ListContainer listId={listId} />);
    await waitFor(() => expect(screen.getByText('Link 1')).toBeInTheDocument());
    fireEvent.click(screen.getAllByLabelText(/edit link/i)[0]);
    fireEvent.change(screen.getByPlaceholderText('Title (optional)'), { target: { value: 'Edited' } });
    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/links/1', expect.objectContaining({ method: 'PATCH' })));
  });
});
