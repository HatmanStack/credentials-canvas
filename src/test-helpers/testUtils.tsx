import React from 'react';
import {render, RenderOptions} from '@testing-library/react';

/**
 * Custom render function with common providers
 * Currently no providers needed (no Context after Phase 2)
 * But keeps pattern for future needs
 *
 * @param ui - React element to render
 * @param options - Render options
 * @returns Render result
 */
const customRender = (
    ui: React.ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>,
) => {
  return render(ui, {...options});
};

// Re-export everything from React Testing Library
export * from '@testing-library/react';

// Export custom render as named export
export {customRender as render};
