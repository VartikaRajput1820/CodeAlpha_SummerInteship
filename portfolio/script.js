const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const scrollLinks = document.querySelectorAll('a[href^="#"]');
const revealElements = document.querySelectorAll('.reveal');

navToggle?.addEventListener('click', () => {
  siteNav.classList.toggle('open');
  document.body.style.overflow = siteNav.classList.contains('open') ? 'hidden' : 'auto';
});

scrollLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    if (targetId && targetId.startsWith('#')) {
      event.preventDefault();
      document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth' });
      siteNav.classList.remove('open');
      document.body.style.overflow = 'auto';
    }
  });
});

document.addEventListener('click', (event) => {
  if (siteNav.classList.contains('open') && !event.target.closest('.site-nav') && !event.target.closest('.nav-toggle')) {
    siteNav.classList.remove('open');
    document.body.style.overflow = 'auto';
  }
});

function revealOnScroll() {
  revealElements.forEach((element) => {
    const top = element.getBoundingClientRect().top;
    if (top < window.innerHeight - 80) {
      element.classList.add('active');
    }
  });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', () => {
  revealOnScroll();
});

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = contactForm.querySelector('input[name="name"]').value.trim();
    const senderEmail = contactForm.querySelector('input[name="email"]').value.trim();
    const message = contactForm.querySelector('textarea[name="message"]').value.trim();

    // Try to read recipient from the contact card mailto link
    const mailLink = document.querySelector('.contact-card a[href^="mailto:"]');
    let recipient = 'YOUR_EMAIL_HERE';
    if (mailLink) {
      recipient = mailLink.getAttribute('href').replace('mailto:', '').trim();
    }

    const subject = encodeURIComponent(`Portfolio message from ${name || senderEmail}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${senderEmail}\n\nMessage:\n${message}`);
    const mailto = `mailto:${recipient}?subject=${subject}&body=${body}`;

    // Open user's mail client to send the message
    window.location.href = mailto;

    contactForm.reset();
  });
}

// Profile card cursor-following spotlight
const profileAvatar = document.querySelector('.profile-avatar');
if (profileAvatar) {
  profileAvatar.addEventListener('mousemove', (e) => {
    const rect = profileAvatar.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    profileAvatar.style.setProperty('--mouse-x', x + '%');
    profileAvatar.style.setProperty('--mouse-y', y + '%');
  });

  profileAvatar.addEventListener('mouseenter', () => {
    profileAvatar.classList.add('hovered');
  });

  profileAvatar.addEventListener('mouseleave', () => {
    profileAvatar.classList.remove('hovered');
  });
}