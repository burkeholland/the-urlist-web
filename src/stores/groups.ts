import type { LinkGroup } from '../types/group';
import { atom } from 'nanostores';

export const currentGroups = atom<LinkGroup[]>([]);

export async function fetchGroups(listId: number) {
    try {
        const response = await fetch(`/api/groups?list_id=${listId}`);
        if (!response.ok) throw new Error('Failed to fetch groups');
        const groups = await response.json();
        currentGroups.set(groups);
        return groups;
    } catch (error) {
        console.error('Error fetching groups:', error);
        return [];
    }
}
