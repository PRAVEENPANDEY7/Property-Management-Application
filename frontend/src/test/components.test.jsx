import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Button, Badge } from '../components/atoms';
import { Pagination, SearchBar } from '../components/molecules';
import { PropertyCard } from '../components/organisms';

describe('UI Atom & Molecule Components', () => {
  it('Button renders text and responds to clicks', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    const btn = screen.getByRole('button', { name: /click me/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('Button disables and shows spinner when isLoading is true', () => {
    render(<Button isLoading={true}>Submit</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('Badge renders variant styling', () => {
    render(<Badge variant="admin">ADMIN</Badge>);
    const badge = screen.getByText('ADMIN');
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain('purple');
  });

  it('Pagination renders pages and invokes onPageChange', () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination
        currentPage={0}
        totalPages={5}
        totalElements={45}
        pageSize={9}
        onPageChange={handlePageChange}
      />
    );

    expect(screen.getByText(/showing/i)).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();

    const nextBtn = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextBtn);
    expect(handlePageChange).toHaveBeenCalledWith(1);
  });

  it('SearchBar triggers onSearch callback on form submission', () => {
    const handleSearch = vi.fn();
    render(<SearchBar onSearch={handleSearch} placeholder="Search houses..." />);

    const input = screen.getByPlaceholderText(/search houses/i);
    fireEvent.change(input, { target: { value: 'Penthouse' } });

    const submitBtn = screen.getByRole('button', { name: /^search$/i });
    fireEvent.click(submitBtn);

    expect(handleSearch).toHaveBeenCalledWith('Penthouse');
  });

  it('PropertyCard renders property name, formatted price, and city tag', () => {
    const mockProperty = {
      id: 42,
      name: 'Luxury Oceanfront Haven',
      description: 'Expansive private beach villa with state of the art finishes.',
      price: 2500000.00,
      location: '1200 Ocean Blvd',
      city: 'Miami',
      primaryImagePath: 'uploads/properties/ocean.jpg',
      images: [{ id: 1, filePath: 'uploads/properties/ocean.jpg', isPrimary: true }],
    };

    render(
      <BrowserRouter>
        <PropertyCard property={mockProperty} />
      </BrowserRouter>
    );

    expect(screen.getByText('Luxury Oceanfront Haven')).toBeInTheDocument();
    expect(screen.getByText('$2,500,000.00')).toBeInTheDocument();
    expect(screen.getByText('Miami')).toBeInTheDocument();
  });
});
