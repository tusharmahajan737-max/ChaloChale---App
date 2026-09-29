const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function showMessage(element, message, success = false) {
    if (!element) return;
    element.textContent = message;
    element.classList.toggle('text-success', success);
    element.classList.toggle('text-danger', !success);
}

function validateEmail(email) {
    return emailPattern.test(email);
}

function login(event) {
    event.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const error = document.getElementById('error');

    if (!email || !password) return showMessage(error, 'Please complete both fields.');
    if (!validateEmail(email)) return showMessage(error, 'Please enter a valid email address.');
    if (password.length < 8) return showMessage(error, 'Password must contain at least 8 characters.');

    sessionStorage.setItem('chalochaleUser', email);
    alert('Login successful. Welcome back!');
    window.location.href = 'index.html';
    return true;
}

function isSignup(event) {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmation = document.getElementById('confirmpassword').value.trim();
    const error = document.getElementById('error');

    if (!name || !email || !password || !confirmation) return showMessage(error, 'Please complete every field.');
    if (!validateEmail(email)) return showMessage(error, 'Please enter a valid email address.');
    if (password.length < 8) return showMessage(error, 'Password must contain at least 8 characters.');
    if (password !== confirmation) return showMessage(error, 'Passwords do not match.');

    sessionStorage.setItem('chalochaleUser', email);
    alert('Registration successful. Welcome to ChaloChale!');
    window.location.href = 'index.html';
    return true;
}

function togglePassword() {
    const password = document.getElementById('password');
    if (password) password.type = password.type === 'password' ? 'text' : 'password';
}

function confirmPassword() {
    const password = document.getElementById('confirmpassword');
    if (password) password.type = password.type === 'password' ? 'text' : 'password';
}

function addFormMessage(form) {
    let message = form.querySelector('.js-form-message');
    if (!message) {
        message = document.createElement('p');
        message.className = 'js-form-message mt-3 mb-0';
        form.appendChild(message);
    }
    return message;
}

function setupBookingForm() {
    const form = document.getElementById('bookingForm');
    if (!form) return;

    const destination = document.getElementById('destination');
    const travelers = document.getElementById('travelers');
    const departureDate = document.getElementById('departureDate');
    const priceSummary = document.querySelector('.summary-row:last-child strong');
    const storedPackage = sessionStorage.getItem('chalochalePackage');
    departureDate.min = new Date().toISOString().split('T')[0];

    if (storedPackage && [...destination.options].some(option => option.value === storedPackage)) {
        destination.value = storedPackage;
    }

    const updatePrice = () => {
        const selected = destination.options[destination.selectedIndex];
        const basePrice = Number(selected && selected.dataset ? selected.dataset.price || 0 : 0);
        const count = Number(travelers.value || 1);
        if (priceSummary) priceSummary.textContent = basePrice ? `₹${(basePrice * count).toLocaleString('en-IN')}` : 'Choose a package';
    };

    destination.addEventListener('change', updatePrice);
    travelers.addEventListener('change', updatePrice);
    updatePrice();

    form.addEventListener('submit', event => {
        event.preventDefault();
        const message = addFormMessage(form);
        if (!form.checkValidity() || !destination.value) {
            form.classList.add('was-validated');
            showMessage(message, 'Please complete the required booking details.');
            return;
        }
        const reference = `CC${Date.now().toString().slice(-6)}`;
        sessionStorage.setItem('chalochaleBooking', reference);
        showMessage(message, `Booking request received. Your reference is ${reference}.`, true);
        form.querySelector('button[type="submit"]').disabled = true;
    });
}

function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', event => {
        event.preventDefault();
        const message = addFormMessage(form);
        const email = document.getElementById('contactEmail').value.trim();
        if (!form.checkValidity() || !validateEmail(email)) {
            form.classList.add('was-validated');
            showMessage(message, 'Please check your details and enter a valid email.');
            return;
        }
        showMessage(message, 'Thanks for reaching out. Our travel team will contact you shortly.', true);
        form.reset();
    });
}

function setupPackageHandoff() {
    const packageMap = {
        'Swiss Alps': 'Swiss Alps',
        'Bali Escape': 'Bali Escape',
        'Kyoto Heritage': 'Kyoto Heritage',
        'Dubai Premium': 'Dubai Premium',
        'Kerala Retreat': 'Kerala Retreat',
        'Paris Romance': 'Paris Romance'
    };
    document.querySelectorAll('a[href="Booking.html"]').forEach(link => {
        link.addEventListener('click', () => {
            const card = link.closest('.card');
            const heading = card && card.querySelector('h4');
            const packageName = heading ? heading.textContent.trim() : '';
            if (packageName) sessionStorage.setItem('chalochalePackage', packageMap[packageName] || packageName);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupBookingForm();
    setupContactForm();
    setupPackageHandoff();
});