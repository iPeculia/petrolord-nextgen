export const UndoRedoService = {
    history: [],
    currentIndex: -1,
    maxHistory: 50,

    init(initialState) {
        this.history = [JSON.parse(JSON.stringify(initialState))];
        this.currentIndex = 0;
    },

    pushState(state) {
        // Remove any future history if we were back in time
        if (this.currentIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentIndex + 1);
        }

        // Add new state
        this.history.push(JSON.parse(JSON.stringify(state)));
        
        // Limit history size
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        } else {
            this.currentIndex++;
        }
    },

    undo() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            return JSON.parse(JSON.stringify(this.history[this.currentIndex]));
        }
        return null;
    },

    redo() {
        if (this.currentIndex < this.history.length - 1) {
            this.currentIndex++;
            return JSON.parse(JSON.stringify(this.history[this.currentIndex]));
        }
        return null;
    },

    canUndo() {
        return this.currentIndex > 0;
    },

    canRedo() {
        return this.currentIndex < this.history.length - 1;
    }
};