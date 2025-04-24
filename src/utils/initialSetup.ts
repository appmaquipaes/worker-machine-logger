
export const createInitialAdminUser = () => {
  const adminUser = {
    id: '1',
    name: 'Admin Principal',
    email: 'admin@maquipaes.com',
    password: 'admin123',
    role: 'Administrador'
  };

  // Obtener usuarios existentes o inicializar un array vacío
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  // Verificar si ya existe un usuario con este email
  const existingUser = users.find((u: any) => u.email === adminUser.email);
  
  if (!existingUser) {
    users.push(adminUser);
    localStorage.setItem('users', JSON.stringify(users));
    console.log('Usuario administrador creado exitosamente');
  } else {
    console.log('El usuario administrador ya existe');
  }
};
