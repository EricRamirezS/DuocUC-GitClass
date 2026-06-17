import { render, screen } from '@testing-library/react';
import CollaboratorCard from './CollaboratorCard';
import { describe, it, expect } from 'vitest';

describe('CollaboratorCard', () => {
  const mockData = {
    nombre_completo: 'Test User',
    usuario_github: 'testuser123',
    comentario_libre: 'This is a test bio.',
    color: '#123456',
    apodo: 'The Debugger',
    emoji: '🚀',
    frase_motivacional: 'Ship it!',
    lenguaje_favorito: 'Python',
    nivel_programador: 'junior',
    estado_actual: 'Estudiando',
    hobby: 'Gaming',
    comida_favorita: 'Sushi',
    superpoder: 'Leer logs'
  };

  it('renders collaborator information correctly', () => {
    render(<CollaboratorCard data={mockData} />);
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('This is a test bio.')).toBeInTheDocument();
    
    const link = screen.getByRole('link', { name: /ver perfil de github/i });
    expect(link).toHaveAttribute('href', 'https://github.com/testuser123');
  });

  it('generates the correct avatar URL', () => {
    render(<CollaboratorCard data={mockData} />);
    
    const avatar = screen.getByAltText('Avatar de Test User');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'https://github.com/testuser123.png');
  });

  it('applies custom color correctly', () => {
    const { container } = render(<CollaboratorCard data={mockData} />);
    
    const card = container.querySelector('.collaborator-card');
    const accentLine = container.querySelector('.card-accent');
    
    expect(card).toHaveStyle('border-color: #123456');
    expect(accentLine).toHaveStyle('background-color: #123456');
  });
  
  it('does not apply custom borders if color is missing', () => {
    const dataWithoutColor = { ...mockData, color: undefined };
    const { container } = render(<CollaboratorCard data={dataWithoutColor} />);
    
    const card = container.querySelector('.collaborator-card');
    expect(card).toHaveStyle('border-width: 0');
  });

  it('renders emoji and nickname when provided', () => {
    render(<CollaboratorCard data={mockData} />);
    
    expect(screen.getByText('🚀')).toBeInTheDocument();
    expect(screen.getByText('The Debugger')).toBeInTheDocument();
  });

  it('renders dev identity badges (language, level, status)', () => {
    render(<CollaboratorCard data={mockData} />);
    
    expect(screen.getByText(/Python/)).toBeInTheDocument();
    expect(screen.getByText(/junior/)).toBeInTheDocument();
    expect(screen.getByText(/Estudiando/)).toBeInTheDocument();
  });

  it('renders motivational quote when provided', () => {
    render(<CollaboratorCard data={mockData} />);
    
    expect(screen.getByText(/Ship it!/)).toBeInTheDocument();
  });

  it('renders personal details (superpoder, hobby, comida)', () => {
    render(<CollaboratorCard data={mockData} />);
    
    expect(screen.getByText(/Leer logs/)).toBeInTheDocument();
    expect(screen.getByText(/Gaming/)).toBeInTheDocument();
    expect(screen.getByText(/Sushi/)).toBeInTheDocument();
  });

  it('handles missing optional fields gracefully', () => {
    const minimalData = {
      nombre_completo: 'Minimal User',
      usuario_github: 'minimaluser',
      comentario_libre: 'Just basics.'
    };
    
    const { container } = render(<CollaboratorCard data={minimalData} />);
    
    expect(screen.getByText('Minimal User')).toBeInTheDocument();
    expect(screen.getByText('Just basics.')).toBeInTheDocument();
    // No badges, no quote, no details should render
    expect(container.querySelector('.card-badges')).toBeNull();
    expect(container.querySelector('.card-quote')).toBeNull();
    expect(container.querySelector('.card-details')).toBeNull();
    expect(container.querySelector('.card-emoji')).toBeNull();
    expect(container.querySelector('.card-nickname')).toBeNull();
  });
});
