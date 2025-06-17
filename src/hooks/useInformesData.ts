
import { useState, useEffect } from 'react';

export const useInformesData = () => {
  const [operators, setOperators] = useState<any[]>([]);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const operatorUsers = storedUsers.filter((u: any) => u.role === 'Operador');
    setOperators(operatorUsers);
    console.log('Loaded operators:', operatorUsers);
  }, []);

  return {
    operators
  };
};
