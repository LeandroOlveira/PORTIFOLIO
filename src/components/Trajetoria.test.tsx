import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Trajetoria } from '@/components/Trajetoria';

describe('Trajetoria', () => {
  it('usa marcos profissionais factuais sem placeholders de autoria', () => {
    render(<Trajetoria />);

    expect(screen.getByText('2014')).toBeInTheDocument();
    expect(screen.getByText(/Delphi e Firebird/i)).toBeInTheDocument();
    expect(screen.getByText(/liderança técnica e operacional/i)).toBeInTheDocument();
    expect(screen.queryByText(/substitua|placeholder|pendente/i)).not.toBeInTheDocument();
  });
});

