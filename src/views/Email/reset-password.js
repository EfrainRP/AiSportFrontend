import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ResetPassword = () => {
  const [newPassword, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [email, setEmail] = useState(''); // Añadir el estado para el email
  const [message, setMessage] = useState('');

  // Capturar el token y el email de la URL cuando carga la página
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    const emailFromUrl = urlParams.get('email'); // Obtener el email

    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }

    if (emailFromUrl) {
      setEmail(emailFromUrl); // Guardar el email
    }

    // Limpia el token y email de la URL (opcional, pero recomendable)
    window.history.replaceState({}, document.title, '/reset-password');
  }, []);

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de contraseñas
    if (newPassword !== confirmPassword) {
      setMessage('❌ Las contraseñas no coinciden.');
      return;
    }

    if (!newPassword || !confirmPassword) {
      setMessage('❌ Por favor ingrese las contraseñas.');
      return;
    }

    try {
      // Llamada al backend para restablecer la contraseña
      const response = await axios.put(`http://localhost:5000/sporthub/api/restore-password`, {
        newPassword,
        confirmPassword, // Confirm pass
        token, // Enviar el token
        email, // Enviar el email
      });

      setMessage(`✅ ${response.data.message}`); // Ej: "Contraseña actualizada con éxito"
    } catch (error) {
      console.error(error);
      setMessage(`❌ ${error.response?.data?.message || 'Error al restablecer la contraseña.'}`);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>Restablecer Contraseña</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Nueva Contraseña:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Confirmar Contraseña:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px', width: '100%' }}>
          Restablecer Contraseña
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
