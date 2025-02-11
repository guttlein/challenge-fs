import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import Profile from './Profile';
import { useFetch } from './hooks/useFetch';
import { userType, postType } from './types/customTypes';

// Mock de la función useFetch
jest.mock('./hooks/useFetch');

describe('Profile behavior', () => {
  const mockUserData: userType = {
    id: 1,
    name: 'John Doe',
    username: 'johndoe',
    phone: '123-456-7890',
    email: 'john@example.com',
    address: {
      street: '123 Main St',
      suite: 'Apt 4B',
      city: 'New York',
      zipcode: '10001',
    },
    company: {
      name: 'Tech Corp',
      catchPhrase: 'Innovating the Future',
      bs: 'Business Solutions',
    },
    website: 'www.johndoe.com',
  };

  const mockPostsData: postType[] = [
    {
      id: 1,
      userId: 1,
      title: 'Post 1',
      body: 'This is the body of post 1.',
    },
    {
      id: 2,
      userId: 1,
      title: 'Post 2',
      body: 'This is the body of post 2.',
    },
  ];

  it('should render loading text when data is being fetched', () => {
    // Mock de la llamada de useFetch con datos de carga
    (useFetch as jest.Mock).mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    const router = createMemoryRouter(
      [
        {
          path: '/profile/:userId',
          element: <Profile />,
        },
      ],
      {
        initialEntries: ['/profile/1'],
      }
    );

    render(<RouterProvider router={router} />);

    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('should render error message when there is an error fetching data', () => {
    // Mock de la llamada de useFetch con error
    (useFetch as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      error: 'Error fetching data',
    });

    const router = createMemoryRouter(
      [
        {
          path: '/profile/:userId',
          element: <Profile />,
        },
      ],
      {
        initialEntries: ['/profile/1'],
      }
    );

    render(<RouterProvider router={router} />);

    expect(screen.getByText('Error: Error fetching data')).toBeInTheDocument();
  });

  it('should render profile and posts when data is fetched successfully', async () => {
    // Mock de la llamada de useFetch con datos de usuario y posts
    (useFetch as jest.Mock)
      .mockReturnValueOnce({
        data: mockUserData,
        loading: false,
        error: null,
      })
      .mockReturnValueOnce({
        data: mockPostsData,
        loading: false,
        error: null,
      });

    const router = createMemoryRouter(
      [
        {
          path: '/profile/:userId',
          element: <Profile />,
        },
      ],
      {
        initialEntries: ['/profile/1'],
      }
    );

    render(<RouterProvider router={router} />);

    // Esperar a que se rendericen los elementos después de la carga
    await waitFor(() => expect(screen.getByText('Perfil de John Doe')).toBeInTheDocument());

    // Verificar la información del perfil
    expect(screen.getByText('Nombre de usuario:')).toBeInTheDocument();
    expect(screen.getByText(mockUserData.username)).toBeInTheDocument();
    expect(screen.getByText(mockUserData.phone)).toBeInTheDocument();
    expect(screen.getByText(mockUserData.email)).toBeInTheDocument();
    expect(screen.getByText(mockUserData.address.street)).toBeInTheDocument();
    expect(screen.getByText(mockUserData.company.name)).toBeInTheDocument();
    expect(screen.getByText(mockUserData.website)).toBeInTheDocument();

    // Verificar los posts
    mockPostsData.forEach((post) => {
      expect(screen.getByText(post.title)).toBeInTheDocument();
      expect(screen.getByText(post.body)).toBeInTheDocument();
    });
  });

  it('should have a link to go back to the users list', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/profile/:userId',
          element: <Profile />,
        },
      ],
      {
        initialEntries: ['/profile/1'],
      }
    );

    render(<RouterProvider router={router} />);

    expect(screen.getByText('Volver a la lista de usuarios')).toBeInTheDocument();
  });
});
