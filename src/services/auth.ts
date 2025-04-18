export const login = async (usuario: string, password: string) => {
    const res = await fetch('http://localhost:3002/api/auth/login', {
      method: 'POST',
      credentials: 'include', // 👈 importante para enviar/recibir cookies
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usuario, password }),
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Error al iniciar sesión');
    }
  
    return await res.json(); // { message: 'Login exitoso' }
  };
  