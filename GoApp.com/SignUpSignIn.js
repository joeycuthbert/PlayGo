window.addEventListener('DOMContentLoaded', (event) => {
    const loginForm = document.getElementById('LogInForm');
    const signupForm = document.getElementById('SignUpForm');

    loginForm.style.display = 'none';

    document.getElementById('logInRadio').addEventListener('change', function() {
        if (this.checked) {
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
        }
    });

    document.getElementById('signUpRadio').addEventListener('change', function() {
        if (this.checked) {
            loginForm.style.display = 'none';
            signupForm.style.display = 'block';
        }
    });
});