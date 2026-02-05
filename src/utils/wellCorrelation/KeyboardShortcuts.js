import { useEffect } from 'react';

export const useKeyboardShortcuts = (actions) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Check for Ctrl or Command key
            if (event.ctrlKey || event.metaKey) {
                switch (event.key.toLowerCase()) {
                    case 'z':
                        event.preventDefault();
                        if (actions.undo) actions.undo();
                        break;
                    case 'y':
                        event.preventDefault();
                        if (actions.redo) actions.redo();
                        break;
                    case 's':
                        event.preventDefault();
                        if (actions.save) actions.save();
                        break;
                    case 'e':
                        event.preventDefault();
                        if (actions.export) actions.export();
                        break;
                    default:
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [actions]);
};