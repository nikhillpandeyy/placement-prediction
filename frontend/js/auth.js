function showTab(tab) {
    document.getElementById('login-form').classList.toggle('hidden', tab !== 'login');
    document.getElementById('register-form').classList.toggle('hidden', tab !== 'register');
    document.getElementById('tab-login').classList.toggle('active', tab === 'login');
    document.getElementById('tab-register').classList.toggle('active', tab === 'register');
}

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const spinner = e.target.querySelector('.spinner');
    if (btn) btn.disabled = true;
    if (spinner) spinner.classList.remove('hidden');
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    try {
        const data = await api.post('/auth/login', { email, password });
        if (data.token) {
            localStorage.setItem('token', data.token);
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            if (typeof showToast !== 'undefined') showToast('Success', 'Logged in successfully', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 500);
        }
    } catch (error) {
        console.error('Login error:', error);
        if (typeof showToast !== 'undefined') {
            showToast('Login Failed', error.message || 'Invalid credentials', 'error');
        } else {
            alert(error.message || 'Login failed');
        }
    } finally {
        if (btn) btn.disabled = false;
        if (spinner) spinner.classList.add('hidden');
    }
});

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    try {
        const data = await api.post('/auth/register', { name, email, password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        if (typeof showToast !== 'undefined') showToast('Success', 'Account created successfully', 'success');
        window.location.href = 'dashboard.html';
    } catch (err) {
        if (typeof showToast !== 'undefined') {
            showToast('Registration Failed', err.message, 'error');
        } else {
            document.getElementById('register-error').textContent = err.message;
            document.getElementById('register-error').classList.remove('hidden');
        }
    }
});

const forgotPasswordForm = document.getElementById('forgot-password-form');
if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        const spinner = e.target.querySelector('.spinner');
        if (btn) btn.disabled = true;
        if (spinner) spinner.classList.remove('hidden');
        
        const email = document.getElementById('reset-email').value.trim();
        const newPassword = document.getElementById('reset-password').value;
        
        try {
            await api.post('/auth/reset-password', { email, newPassword });
            if (typeof showToast !== 'undefined') showToast('Success', 'Password reset successfully', 'success');
            showTab('login');
        } catch (err) {
            console.error('Reset password error:', err);
            if (typeof showToast !== 'undefined') {
                showToast('Reset Failed', err.message, 'error');
            } else {
                const errorDiv = document.getElementById('reset-error');
                if (errorDiv) {
                    errorDiv.textContent = err.message;
                    errorDiv.classList.remove('hidden');
                } else {
                    alert(err.message || 'Reset failed');
                }
            }
        } finally {
            if (btn) btn.disabled = false;
            if (spinner) spinner.classList.add('hidden');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('dashboard.html') && !localStorage.getItem('token')) {
        window.location.href = 'auth.html';
    }
    if ((window.location.pathname.endsWith('auth.html') || window.location.pathname === '/') && localStorage.getItem('token')) {
        window.location.href = 'dashboard.html';
    }
});

function showTab(tabId) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    
    const tabElem = document.getElementById(`tab-${tabId}`);
    if (tabElem) tabElem.classList.add('active');
    
    ['login', 'register', 'forgot-password'].forEach(id => {
        const form = document.getElementById(`${id}-form`);
        if (form) {
            form.classList.add('hidden');
            form.classList.remove('anim-fade-in-up');
        }
    });

    const activeForm = document.getElementById(`${tabId}-form`);
    if (activeForm) {
        activeForm.classList.remove('hidden');
        void activeForm.offsetWidth;
        activeForm.classList.add('anim-fade-in-up');
    }
}

function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = '🙈';
    } else {
        input.type = 'password';
        btn.textContent = '👁️';
    }
}

function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/[A-Z]/) && password.match(/[0-9]/)) strength++;
    if (password.match(/[^A-Za-z0-9]/)) strength++;
    const bars = [
        document.getElementById('strength-1'),
        document.getElementById('strength-2'),
        document.getElementById('strength-3')
    ];
    const text = document.getElementById('strength-text');
    bars.forEach(b => b.className = 'strength-bar');
    if (password.length === 0) {
        text.textContent = 'Password strength';
        return;
    }
    if (strength === 1) {
        bars[0].classList.add('weak');
        text.textContent = 'Weak';
        text.style.color = 'var(--accent-warn)';
    } else if (strength === 2) {
        bars[0].classList.add('medium');
        bars[1].classList.add('medium');
        text.textContent = 'Medium';
        text.style.color = 'var(--accent-gold)';
    } else if (strength >= 3) {
        bars[0].classList.add('strong');
        bars[1].classList.add('strong');
        bars[2].classList.add('strong');
        text.textContent = 'Strong';
        text.style.color = 'var(--accent-primary)';
    }
}
