// ListContainer.test.tsx
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ListContainer } from './ListContainer';
import React from 'react';

global.fetch = vi.fn();

describe('ListContainer', () => {
  const listId = 1;
  const links = [
    { id: 1, title: 'Link 1', description: 'Desc 1', url: 'https://a.com', image: '', position: 1, list_id: 1, created_at: '' },
    { id: 2, title: 'Link 2', description: 'Desc 2', url: 'https://b.com', image: '', position: 2, list_id: 1, created_at: '' },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
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

  it('handles delete link with confirmation', async () => {
    (fetch as any)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ title: 'My List', description: '' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => links })
      .mockResolvedValueOnce({ ok: true });
    
    // Mock window.confirm to return true
    const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => true);
    
    render(<ListContainer listId={listId} />);
    await waitFor(() => expect(screen.getByText('Link 1')).toBeInTheDocument());
    fireEvent.click(screen.getAllByLabelText(/delete link/i)[0]);
    
    // Check if confirm was called with the right message
    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to delete Link 1?');
    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/links/1', expect.anything()));
    
    confirmSpy.mockRestore();
  });

  it('cancels delete when confirmation is declined', async () => {
    (fetch as any)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ title: 'My List', description: '' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => links });
    
    // Mock window.confirm to return false
    const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => false);
    
    render(<ListContainer listId={listId} />);
    await waitFor(() => expect(screen.getByText('Link 1')).toBeInTheDocument());
    fireEvent.click(screen.getAllByLabelText(/delete link/i)[0]);
    
    // Check if confirm was called
    expect(confirmSpy).toHaveBeenCalled();
    
    // Verify the API was not called
    expect(fetch).not.toHaveBeenCalledWith('/api/links/1', expect.objectContaining({ method: 'DELETE' }));
    
    confirmSpy.mockRestore();
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
