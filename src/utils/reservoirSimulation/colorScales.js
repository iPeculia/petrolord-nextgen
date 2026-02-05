export const getColorScale = (type) => {
  switch (type) {
    case 'viridis':
      return (t) => {
        // Simplified Viridis approximation
        const r = Math.max(0, Math.min(1, 4.0 * t - 1.5));
        const g = Math.max(0, Math.min(1, 4.0 * t - 0.5));
        const b = Math.max(0, Math.min(1, 4.0 * t + 0.5));
        
        // Adjust for purple-blue-green-yellow look (custom approximation)
        const R = Math.floor(255 * (t < 0.5 ? 0.2 + 0.2*t*2 : 0.4 + 0.6*(t-0.5)*2));
        const G = Math.floor(255 * (t < 0.5 ? 0.0 + 0.8*t*2 : 0.8 + 0.2*(t-0.5)*2));
        const B = Math.floor(255 * (t < 0.5 ? 0.4 + 0.4*t*2 : 0.4 - 0.4*(t-0.5)*2));
        return `rgb(${R}, ${G}, ${B})`;
      };
    case 'pressure':
       // Custom: Blue (low) -> Green -> Red (high)
       return (t) => {
           let r, g, b;
           if (t < 0.5) {
               // Blue to Green
               r = 0;
               g = Math.floor(255 * (t * 2));
               b = Math.floor(255 * (1 - t * 2));
           } else {
               // Green to Red
               r = Math.floor(255 * ((t - 0.5) * 2));
               g = Math.floor(255 * (1 - (t - 0.5) * 2));
               b = 0;
           }
           return `rgb(${r}, ${g}, ${b})`;
       };
    case 'sw':
    case 'water_saturation':
       // Water Saturation: White (Dry) -> Blue (Wet)
       return (t) => {
           // White to Deep Blue
           const r = Math.floor(255 - (255 - 30) * t);
           const g = Math.floor(255 - (255 - 144) * t);
           const b = Math.floor(255 - (255 - 255) * 0.1 * t); // Keep blue high
           return `rgb(${r}, ${g}, ${b})`;
       };
    case 'so':
    case 'oil_saturation':
       // Oil Saturation: White (None) -> Dark Green (Oil)
       return (t) => {
           // White to Dark Green
           const r = Math.floor(255 - (255 - 34) * t);
           const g = Math.floor(255 - (255 - 139) * t);
           const b = Math.floor(255 - (255 - 34) * t);
           return `rgb(${r}, ${g}, ${b})`;
       };
    case 'sg':
    case 'gas_saturation':
       // Gas Saturation: White (None) -> Red (Gas)
       return (t) => {
           // White to Red
           const r = 255;
           const g = Math.floor(255 * (1 - t));
           const b = Math.floor(255 * (1 - t));
           return `rgb(${r}, ${g}, ${b})`;
       };
    case 'saturation':
       // Generic Saturation fallback: Brown -> Blue
       return (t) => {
           const r = Math.floor(139 + (30 - 139) * t);
           const g = Math.floor(69 + (144 - 69) * t);
           const b = Math.floor(19 + (255 - 19) * t);
           return `rgb(${r}, ${g}, ${b})`;
       };
    default:
      return (t) => `rgb(${Math.floor(t*255)}, ${Math.floor(t*255)}, ${Math.floor(t*255)})`;
  }
};