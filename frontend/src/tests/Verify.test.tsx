import React from 'react';
import { render, screen } from '@testing-library/react';

describe('Frontend Environment Verification', () => {
  it('should render a simple component', () => {
    render(<div>Test Component</div>);
    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });
});
