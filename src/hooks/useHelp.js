import { useContext } from 'react';
// Re-exporting from context file for cleaner imports if needed, 
// but since the context logic is simple, we can just point to the context.
// However, the prompt asked for a specific hook file.
// We will just wrap the context hook here.

// NOTE: Ideally we import the context from the .jsx file, but circular deps can be tricky.
// For simplicity in this environment, I'll assume the context is the source of truth.
// If direct import fails due to file extension issues in some bundlers, we'd duplicate logic.
// But Vite handles .jsx imports fine.

// Actually, to avoid "Refresh" issues or hot reload quirks, let's just make this file
// a consumer of the context defined in HelpContext.jsx.

// Since I cannot import 'useHelp' from HelpContext.jsx inside useHelp.js (circular if I export it there too),
// I will just define a helper here if needed, or better yet, make this file the primary hook definition
// and the context file just the provider. But standard pattern is context + hook in one file or separate.
// I will strictly follow the request to create this file.

import { useHelp as useContextHelp } from '@/contexts/HelpContext';

export const useHelp = () => {
  return useContextHelp();
};