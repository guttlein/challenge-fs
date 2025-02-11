import './App.css';
import { useFetch } from './hooks/useFetch';
import { CustomTable } from './components/CustomTable';
import { userType } from './types/customTypes';
import { Paper, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState, useRef } from 'react';

function App() {
  const { data: users, loading: usersLoading, error: usersError } = useFetch<userType[]>("users");
  const [usersFiltered, setUsersFiltered] = useState<userType[]>([]);

  // Usamos una ref para guardar el ID del timeout
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  if (usersLoading) {
    return <div>Cargando...</div>;
  }

  if (usersError) {
    return <div>Error: {usersError}</div>;
  }

  // Función de filtro con timeout
  const handleInputChange = (value: string) => {
    // Limpiar cualquier timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Establecer un nuevo timeout para ejecutar la búsqueda después de 1 segundo
    timeoutRef.current = setTimeout(() => {
      if (users) {
        const filteredUsers = users.filter((user) =>
          user.name.toLowerCase().includes(value.toLowerCase()) ||
          user.username.toLowerCase().includes(value.toLowerCase()) ||
          user.email.toLowerCase().includes(value.toLowerCase()) ||
          user.company.name.toLowerCase().includes(value.toLowerCase())
        );
        setUsersFiltered(filteredUsers);
      }
    }, 1000); // 1 segundo de espera
  };

  return (
    <>
      <Paper
        component="form"
        sx={{ mb: "10px", p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search User"
          inputProps={{ 'aria-label': 'search user' }}
          onChange={(e) => { handleInputChange(e.target.value) }}
        />
        <SearchIcon />
      </Paper>
      {users && <CustomTable users={usersFiltered.length > 0 ? usersFiltered : users} />}
    </>
  );
}

export default App;
