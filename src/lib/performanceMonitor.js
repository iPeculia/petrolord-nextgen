export const performanceMonitor = {
  metrics: {
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    navigationStart: 0,
  },

  init() {
    if (typeof window === 'undefined') return;
    
    this.metrics.navigationStart = performance.now();

    // Simple observer for Web Vitals
    if (window.PerformanceObserver) {
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime;
          }
        }
      }).observe({ type: 'paint', buffered: true });
    }
  },

  logMetric(name, value) {
    console.log(`[Perf] ${name}:`, value);
    // In production, send to analytics endpoint
  },

  getMetrics() {
    return {
      ...this.metrics,
      uptime: performance.now() - this.metrics.navigationStart,
      memory: performance.memory ? {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize
      } : null
    };
  }
};