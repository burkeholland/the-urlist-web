import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { LinkList } from './LinkList';
import * as nanostoresReact from '@nanostores/react';
import * as listsStore from '../stores/lists';

// Mock the stores
vi.mock('@nanostores/react', () => ({
  useStore: vi.fn()
}));

vi.mock('../stores/lists', () => ({
  currentLinks: { set: vi.fn() },
  fetchLinks: vi.fn().mockResolvedValue([])
}));

describe('LinkList Component', () => {
  const mockLinks = [
    { 
      id: 1, 
      title: 'Test Link', 
      url: 'https://example.com', 
      description: 'Test description', 
      image: '' 
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Setup useStore mock to return our test links
    vi.mocked(nanostoresReact.useStore).mockReturnValue(mockLinks);
  });

  it('renders the component without error', () => {
    const { container } = render(<LinkList listId={1} />);
    expect(container).toBeDefined();
    expect(listsStore.fetchLinks).toHaveBeenCalledWith(1);
  });
});