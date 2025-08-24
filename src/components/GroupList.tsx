
import { useState, useEffect } from 'react';
import { currentGroups, fetchGroups } from '../stores/groups';
import type { LinkGroup } from '../types/group';
import { Button } from './Button';

interface GroupListProps {
    listId: number;
    onGroupSelect?: (groupId: number | null) => void;
    selectedGroupId: number | null;
    onRename: (group: LinkGroup) => void;
}

export function GroupList({ listId, onGroupSelect, selectedGroupId, onRename }: GroupListProps) {
    const [groups, setGroups] = useState<LinkGroup[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [createError, setCreateError] = useState<string | null>(null);

    useEffect(() => {
        fetchGroups(listId).then(setGroups);
    }, [listId]);

    const handleCreateGroup = async () => {
        if (!newGroupName.trim()) {
            setCreateError('Group name required');
            return;
        }
        setCreateError(null);
        setIsCreating(true);
        try {
            const res = await fetch('/api/groups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ list_id: listId, name: newGroupName })
            });
            if (!res.ok) throw new Error('Failed to create group');
            setNewGroupName('');
            setIsCreating(false);
            fetchGroups(listId).then(setGroups);
        } catch (e) {
            setCreateError('Could not create group');
            setIsCreating(false);
        }
    };

    return (
        <div className="flex flex-wrap gap-2 items-center mb-4">
            <Button
                variant={selectedGroupId === null ? 'primary' : 'secondary'}
                onClick={() => onGroupSelect?.(null)}
            >
                All Links
            </Button>
            {groups.map((group) => (
                <div key={group.id} className="flex items-center gap-1">
                    <Button
                        variant={selectedGroupId === group.id ? 'primary' : 'secondary'}
                        onClick={() => onGroupSelect?.(group.id)}
                    >
                        {group.name}
                    </Button>
                    <button
                        className="text-xs text-gray-400 hover:text-[#15BFAE] px-1"
                        onClick={() => onRename(group)}
                        aria-label="Rename group"
                    >
                        <svg width="14" height="14" fill="none" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" fill="currentColor" /></svg>
                    </button>
                </div>
            ))}
            <form
                onSubmit={e => {
                    e.preventDefault();
                    handleCreateGroup();
                }}
                className="flex items-center gap-2"
            >
                <input
                    type="text"
                    value={newGroupName}
                    onChange={e => setNewGroupName(e.target.value)}
                    placeholder="New group"
                    className="px-2 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#15BFAE]"
                    disabled={isCreating}
                />
                <Button type="submit" variant="secondary" disabled={isCreating} isLoading={isCreating}>
                    +
                </Button>
            </form>
            {createError && <span className="text-xs text-red-500 ml-2">{createError}</span>}
        </div>
    );
}
