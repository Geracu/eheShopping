document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const username = document.getElementById('username');
    const password = document.getElementById('password');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const errorContainer = document.getElementById('error-message');
        if (errorContainer) errorContainer.remove();

        window.electronAPI.send('verificarLogin', { idEmpleado: username.value, contrasena: password.value });
        
    });

    window.electronAPI.receive('respuestaLogin', ({ error, message }) => {
        if (error) {
            displayErrorMessages(loginForm, [message]);
        } else {
            window.location.href = 'listadoDeProductos.html';
        }
    });

    function displayErrorMessages(form, messages) {
        const errorMessageElement = document.createElement('p');
        errorMessageElement.id = 'error-message';
        errorMessageElement.textContent = messages.join(" ");
        form.appendChild(errorMessageElement);
    }
});
