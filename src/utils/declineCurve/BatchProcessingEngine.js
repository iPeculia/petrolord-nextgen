/**
 * Batch Processing Engine for DCA
 * Handles bulk operations for wells, models, and forecasts.
 */

export class BatchProcessor {
    constructor() {
        this.queue = [];
        this.isProcessing = false;
        this.isPaused = false;
        this.subscribers = [];
        this.results = [];
        this.errors = [];
        this.progress = 0;
        this.currentTask = null;
    }

    subscribe(callback) {
        this.subscribers.push(callback);
        return () => this.subscribers = this.subscribers.filter(s => s !== callback);
    }

    notify() {
        this.subscribers.forEach(cb => cb({
            isProcessing: this.isProcessing,
            isPaused: this.isPaused,
            progress: this.progress,
            results: this.results,
            errors: this.errors,
            currentTask: this.currentTask,
            queueLength: this.queue.length
        }));
    }

    addToQueue(tasks) {
        this.queue.push(...tasks);
        this.notify();
    }

    async start() {
        if (this.isProcessing) return;
        this.isProcessing = true;
        this.isPaused = false;
        this.notify();
        await this.processQueue();
    }

    pause() {
        this.isPaused = true;
        this.notify();
    }

    resume() {
        this.isPaused = false;
        this.notify();
        this.processQueue();
    }

    cancel() {
        this.queue = [];
        this.isProcessing = false;
        this.isPaused = false;
        this.progress = 0;
        this.notify();
    }

    async processQueue() {
        const total = this.results.length + this.errors.length + this.queue.length;
        
        while (this.queue.length > 0 && !this.isPaused) {
            const task = this.queue.shift();
            this.currentTask = task.description || 'Processing...';
            
            try {
                // Simulate async work if task doesn't return promise
                const result = await Promise.resolve(task.action());
                this.results.push({ id: task.id, status: 'success', data: result });
            } catch (error) {
                console.error("Batch Error:", error);
                this.errors.push({ id: task.id, status: 'error', error: error.message });
                if (!task.continueOnError) {
                    this.isPaused = true; // Stop on critical error if configured
                }
            }

            const completed = this.results.length + this.errors.length;
            this.progress = (completed / total) * 100;
            this.notify();

            // Tiny delay to allow UI updates and pause check
            await new Promise(r => setTimeout(r, 50));
        }

        if (this.queue.length === 0) {
            this.isProcessing = false;
            this.currentTask = 'Complete';
            this.notify();
        }
    }
}

// Singleton instance for the app
export const batchProcessor = new BatchProcessor();