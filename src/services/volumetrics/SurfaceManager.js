/**
 * SurfaceManager - Manages loaded surfaces in memory
 */

export class SurfaceManager {
    constructor() {
        this.surfaces = new Map();
    }

    addSurface(surface) {
        if (!surface.id) surface.id = crypto.randomUUID();
        this.surfaces.set(surface.id, surface);
        return surface;
    }

    removeSurface(id) {
        return this.surfaces.delete(id);
    }

    getSurface(id) {
        return this.surfaces.get(id);
    }

    getAllSurfaces() {
        return Array.from(this.surfaces.values());
    }

    updateSurface(id, updates) {
        const surface = this.surfaces.get(id);
        if (!surface) return null;
        
        const updated = { ...surface, ...updates };
        this.surfaces.set(id, updated);
        return updated;
    }

    /**
     * Simple Gross Rock Volume calculation between two surfaces
     * Uses simple bounding box average depth difference logic for demo
     * In production, this would need Delaunay triangulation or Grid-based volume integration
     */
    calculateGRV(topSurfaceId, baseSurfaceId) {
        const top = this.surfaces.get(topSurfaceId);
        const base = this.surfaces.get(baseSurfaceId);

        if (!top || !base) throw new Error("Surfaces not found");

        // Check overlap (simplified)
        const overlapMinX = Math.max(top.bounds.minX, base.bounds.minX);
        const overlapMaxX = Math.min(top.bounds.maxX, base.bounds.maxX);
        const overlapMinY = Math.max(top.bounds.minY, base.bounds.minY);
        const overlapMaxY = Math.min(top.bounds.maxY, base.bounds.maxY);

        if (overlapMinX >= overlapMaxX || overlapMinY >= overlapMaxY) {
            return 0; // No overlap
        }

        const overlapArea = (overlapMaxX - overlapMinX) * (overlapMaxY - overlapMinY);
        
        // Avg Thickness (simplified: difference of averages)
        // Note: Z usually increases with depth in geology, so Base - Top = Thickness
        // If Z is elevation (negative down), then Top - Base. 
        // Assuming Z = Depth here.
        const avgThickness = Math.abs(base.stats.avgZ - top.stats.avgZ); 

        return overlapArea * avgThickness;
    }
}

// Singleton instance
export const surfaceManager = new SurfaceManager();