import L from 'leaflet';

/**
 * Validates the facility layout based on current items, zones, lines, and mode.
 * @param {Array} items - Equipment items
 * @param {Array} zones - Buffer/Exclusion zones
 * @param {Array} lines - Pipelines
 * @param {string} mode - 'engineering' or 'draft'
 */
export const validateLayout = (items, zones, lines, mode) => {
  const violations = [];

  // Basic Checks (Always run)
  items.forEach(item => {
      if (!item.tag || item.tag.trim() === '') {
          violations.push({
              itemId: item.id,
              type: 'warning',
              message: 'Tag number is missing.'
          });
      }
  });

  // Engineering Mode Strict Checks
  if (mode === 'engineering') {
    // 1. PSV must be associated to a vessel
    items.forEach(item => {
        if (item.type === 'PSV') {
        // Simplified check: Does it have a note referencing a parent or is it near a vessel?
        // In full impl, check line connectivity
        const isNearVessel = items.some(other => 
            other.id !== item.id && 
            other.type.includes('Vessel') &&
            Math.abs(other.lat - item.lat) < 0.0001 && // Very close
            Math.abs(other.lng - item.lng) < 0.0001
        );
        
        if (!isNearVessel) {
            violations.push({
                itemId: item.id,
                type: 'error',
                message: `PSV ${item.tag} must be located on or near a Vessel.`
            });
        }
        }
    });

    // 2. Flare must have an exclusion zone
    items.forEach(item => {
        if (item.type === 'Flare Stack') {
            const hasZone = zones.some(z => 
                z.type === 'Exclusion' && 
                // Check if flare is inside zone center roughly
                Math.abs(z.geometry.center[0] - item.lat) < 0.0001 &&
                Math.abs(z.geometry.center[1] - item.lng) < 0.0001
            );

            if (!hasZone) {
                violations.push({
                    itemId: item.id,
                    type: 'error',
                    message: `Flare ${item.tag} requires a defined Exclusion Zone.`
                });
            }
        }
    });

    // 3. Buffer Zone Violations (Equipment inside Exclusion Zone)
    // We need to use Leaflet's distanceTo if available, or Haversine formula
    items.forEach(item => {
        zones.forEach(zone => {
            if (zone.type === 'Exclusion') {
                // Approximate distance check (Lat/Lng to meters rough conversion)
                const R = 6371e3; // metres
                const φ1 = item.lat * Math.PI/180;
                const φ2 = zone.geometry.center[0] * Math.PI/180;
                const Δφ = (zone.geometry.center[0]-item.lat) * Math.PI/180;
                const Δλ = (zone.geometry.center[1]-item.lng) * Math.PI/180;

                const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                        Math.cos(φ1) * Math.cos(φ2) *
                        Math.sin(Δλ/2) * Math.sin(Δλ/2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                const distance = R * c;

                if (distance < zone.geometry.radius && item.type !== 'Flare Stack') {
                    violations.push({
                        itemId: item.id,
                        type: 'error',
                        message: `Equipment ${item.tag} is illegally placed inside Exclusion Zone ${zone.name}.`
                    });
                }
            }
        });
    });

    // 4. Line connectivity checks
    lines.forEach(line => {
        if (line.points.length < 2) {
             violations.push({
                 itemId: line.id,
                 type: 'error',
                 message: `Line ${line.line_id} is incomplete.`
             });
        }
        // Future: Check if start/end points coincide with equipment nozzles
    });
  }

  return violations;
};