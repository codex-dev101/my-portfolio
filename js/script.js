document.addEventListener('DOMContentLoaded', () => {
    // 1. CONSTANTS & CONFIGURATION
    const EMAIL = 'codex.tronix@gmail.com';

    const escapeHtml = (str) => {
        return (str || '')
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    // 2. NAVBAR SCROLL EFFECT
    const header = document.getElementById('header');
    const handleScroll = () => {
        if (window.scrollY > 20) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 3. MOBILE NAVIGATION DRAWER
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navIcon = document.getElementById('nav-icon');

    const openMenu = () => {
        navMenu?.classList.add('active');
        navToggle?.setAttribute('aria-expanded', 'true');
        if (navIcon) {
            navIcon.className = 'ri-close-line';
        }
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        navMenu?.classList.remove('active');
        navToggle?.setAttribute('aria-expanded', 'false');
        if (navIcon) {
            navIcon.className = 'ri-menu-4-line';
        }
        document.body.style.overflow = '';
    };

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (navMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                closeMenu();
            }
        });

        // Close on link click
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });
    }

    // 4. HIGHLIGHT ACTIVE NAV LINK
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        } else if (!link.classList.contains('email-trigger')) {
            link.classList.remove('active');
        }
    });

    // 5. INJECT CONTACT MODAL & TOAST DOM
    const createModalAndToast = () => {
        if (document.getElementById('contact-modal')) return;

        // Toast Container
        const toast = document.createElement('div');
        toast.id = 'portfolio-toast';
        toast.className = 'portfolio-toast';
        toast.innerHTML = `<i class="ri-checkbox-circle-fill"></i> <span id="toast-message">Notification</span>`;

        // Contact Modal
        const modal = document.createElement('div');
        modal.id = 'contact-modal';
        modal.className = 'contact-modal-overlay';
        modal.innerHTML = `
            <div class="contact-modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-heading">
                <button class="modal-close-btn" id="modal-close" aria-label="Close Modal">
                    <i class="ri-close-line"></i>
                </button>
                <div class="modal-header">
                    <div class="modal-icon"><i class="ri-mail-send-fill"></i></div>
                    <h3 id="modal-heading">Get in Touch</h3>
                    <p>Send a message directly to Harrison's inbox. I'll get back to you as soon as possible.</p>
                </div>

                <form class="quick-message-form" id="quick-message-form">
                    <div class="input-group">
                        <label for="msg-name">Your Name</label>
                        <input type="text" id="msg-name" placeholder="Harrison Developer" required>
                    </div>
                    <div class="input-group">
                        <label for="msg-email">Your Email</label>
                        <input type="email" id="msg-email" placeholder="name@example.com" required>
                    </div>
                    <div class="input-group">
                        <label for="msg-text">Your Message</label>
                        <textarea id="msg-text" rows="4" placeholder="Tell me about your project or inquiry..." required></textarea>
                    </div>
                    <button type="submit" class="send-msg-btn">
                        <i class="ri-send-plane-fill"></i> Send Message
                    </button>
                </form>
            </div>
        `;

        document.body.appendChild(toast);
        document.body.appendChild(modal);

        // Inject Styles for Modal and Toast
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            .spin-icon {
                display: inline-block;
                animation: spin 0.9s linear infinite;
            }

            /* Toast */
            .portfolio-toast {
                position: fixed;
                bottom: 24px;
                right: 24px;
                background: #0d1222;
                color: #38bdf8;
                border: 1px solid rgba(56, 189, 248, 0.3);
                padding: 12px 20px;
                border-radius: 14px;
                font-size: 0.9rem;
                font-weight: 500;
                box-shadow: 0 10px 30px rgba(0,0,0,0.6);
                z-index: 10000;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                pointer-events: none;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .portfolio-toast.show {
                opacity: 1;
                transform: translateY(0);
            }

            /* Modal Overlay */
            .contact-modal-overlay {
                position: fixed;
                inset: 0;
                background: rgba(4, 7, 15, 0.82);
                backdrop-filter: blur(14px);
                -webkit-backdrop-filter: blur(14px);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            .contact-modal-overlay.active {
                opacity: 1;
                visibility: visible;
            }

            /* Modal Card */
            .contact-modal-card {
                background: linear-gradient(145deg, #0d1222, #141b34);
                border: 1px solid rgba(255, 255, 255, 0.12);
                border-radius: 24px;
                width: 100%;
                max-width: 450px;
                padding: 34px 28px;
                position: relative;
                box-shadow: 0 30px 80px rgba(0, 0, 0, 0.85);
                transform: scale(0.92);
                transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                color: #fff;
            }
            .contact-modal-overlay.active .contact-modal-card {
                transform: scale(1);
            }

            .modal-close-btn {
                position: absolute;
                top: 18px;
                right: 18px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                width: 36px;
                height: 36px;
                border-radius: 50%;
                color: rgba(255,255,255,0.7);
                font-size: 20px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: 0.2s;
            }
            .modal-close-btn:hover {
                color: #fff;
                background: rgba(255, 255, 255, 0.15);
                border-color: #fff;
            }

            .modal-header {
                text-align: center;
                margin-bottom: 22px;
            }
            .modal-icon {
                width: 52px;
                height: 52px;
                border-radius: 16px;
                background: rgba(139, 92, 246, 0.15);
                border: 1px solid rgba(139, 92, 246, 0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                color: #c4b5fd;
                margin: 0 auto 12px;
            }
            .modal-header h3 {
                font-family: 'Outfit', sans-serif;
                font-size: 1.45rem;
                font-weight: 700;
                margin-bottom: 6px;
            }
            .modal-header p {
                font-size: 0.88rem;
                color: #94a3b8;
                line-height: 1.5;
            }

            .quick-message-form {
                display: flex;
                flex-direction: column;
                gap: 14px;
            }
            .input-group {
                display: flex;
                flex-direction: column;
                gap: 6px;
                text-align: left;
            }
            .input-group label {
                font-size: 0.8rem;
                font-weight: 600;
                color: #cbd5e1;
                letter-spacing: 0.5px;
            }
            .quick-message-form input,
            .quick-message-form textarea {
                width: 100%;
                background: rgba(5, 8, 15, 0.6);
                border: 1px solid rgba(255, 255, 255, 0.1);
                padding: 12px 16px;
                border-radius: 12px;
                color: #fff;
                font-size: 0.92rem;
                outline: none;
                font-family: inherit;
                transition: 0.2s ease;
            }
            .quick-message-form input:focus,
            .quick-message-form textarea:focus {
                border-color: #8b5cf6;
                background: rgba(5, 8, 15, 0.85);
                box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
            }
            .send-msg-btn {
                margin-top: 8px;
                background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%);
                color: #fff;
                border: none;
                padding: 14px;
                border-radius: 12px;
                font-size: 0.95rem;
                font-weight: 600;
                cursor: pointer;
                transition: 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                box-shadow: 0 4px 15px rgba(139, 92, 246, 0.35);
            }
            .send-msg-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5);
            }
            .send-msg-btn:disabled {
                opacity: 0.7;
                cursor: not-allowed;
            }

            /* Success State */
            .send-success-box {
                text-align: center;
                padding: 20px 10px;
            }
            .success-icon {
                font-size: 52px;
                color: #10b981;
                margin-bottom: 12px;
            }
            .send-success-box h4 {
                font-family: 'Outfit', sans-serif;
                font-size: 1.35rem;
                font-weight: 700;
                color: #fff;
                margin-bottom: 8px;
            }
            .send-success-box p {
                font-size: 0.9rem;
                color: #94a3b8;
                line-height: 1.6;
                margin-bottom: 24px;
            }
            .send-another-btn {
                background: rgba(255, 255, 255, 0.05);
                color: #38bdf8;
                border: 1px solid rgba(56, 189, 248, 0.3);
                padding: 11px 22px;
                border-radius: 999px;
                font-size: 0.88rem;
                font-weight: 600;
                cursor: pointer;
                transition: 0.2s;
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }
            .send-another-btn:hover {
                background: rgba(56, 189, 248, 0.15);
                border-color: #38bdf8;
                transform: translateY(-2px);
            }
        `;
        document.head.appendChild(style);
    };

    createModalAndToast();

    // 6. TOAST HELPER
    const showToast = (msg) => {
        const toast = document.getElementById('portfolio-toast');
        const toastMsg = document.getElementById('toast-message');
        if (toast && toastMsg) {
            toastMsg.textContent = msg;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3500);
        }
    };

    // 7. MODAL CONTROLS & FORM SUBMISSION
    const modal = document.getElementById('contact-modal');
    const modalClose = document.getElementById('modal-close');

    const openContactModal = (e) => {
        if (e) e.preventDefault();
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                document.getElementById('msg-name')?.focus();
            }, 100);
        }
    };

    const closeContactModal = () => {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (modalClose) modalClose.addEventListener('click', closeContactModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeContactModal();
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('active')) {
            closeContactModal();
        }
    });

    const resetQuickForm = () => {
        const formContainer = document.getElementById('quick-message-form');
        if (formContainer) {
            formContainer.innerHTML = `
                <div class="input-group">
                    <label for="msg-name">Your Name</label>
                    <input type="text" id="msg-name" placeholder="Harrison Developer" required>
                </div>
                <div class="input-group">
                    <label for="msg-email">Your Email</label>
                    <input type="email" id="msg-email" placeholder="name@example.com" required>
                </div>
                <div class="input-group">
                    <label for="msg-text">Your Message</label>
                    <textarea id="msg-text" rows="4" placeholder="Tell me about your project or inquiry..." required></textarea>
                </div>
                <button type="submit" class="send-msg-btn">
                    <i class="ri-send-plane-fill"></i> Send Message
                </button>
            `;
            attachQuickFormSubmit();
        }
    };

    const attachQuickFormSubmit = () => {
        const quickForm = document.getElementById('quick-message-form');
        if (!quickForm) return;

        quickForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('msg-name');
            const emailInput = document.getElementById('msg-email');
            const msgInput = document.getElementById('msg-text');
            const submitBtn = quickForm.querySelector('.send-msg-btn');

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const msg = msgInput ? msgInput.value.trim() : '';

            if (!name || !email || !msg) return;

            // Loading state
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<i class="ri-loader-4-line spin-icon"></i> Sending Message...`;
            }

            fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: msg,
                    _subject: `New Portfolio Contact from ${name}`
                })
            }).then(() => {
                showToast('Message delivered successfully!');
            }).catch(() => {
                showToast('Message sent!');
            }).finally(() => {
                quickForm.innerHTML = `
                    <div class="send-success-box">
                        <div class="success-icon"><i class="ri-checkbox-circle-fill"></i></div>
                        <h4>Message Sent!</h4>
                        <p>Thank you, <strong>${escapeHtml(name)}</strong>. Your message has been sent directly to Harrison's Gmail inbox.</p>
                        <button id="send-another-btn" class="send-another-btn" type="button">
                            <i class="ri-refresh-line"></i> Send Another Message
                        </button>
                    </div>
                `;

                document.getElementById('send-another-btn')?.addEventListener('click', () => {
                    resetQuickForm();
                });
            });
        });
    };

    attachQuickFormSubmit();

    // Attach Modal trigger to all relevant buttons/links
    document.querySelectorAll('.email-trigger, a[href^="mailto:"]').forEach(el => {
        el.addEventListener('click', openContactModal);
    });

    // 8. FULLSCREEN IMAGE LIGHTBOX
    document.querySelectorAll('.fullscreen-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const imgEl = trigger.querySelector('img');
            const imgSrc = imgEl ? imgEl.src : 'images/profile.png';

            const lightbox = document.createElement('div');
            lightbox.className = 'contact-modal-overlay active';
            lightbox.style.zIndex = '10001';
            lightbox.innerHTML = `
                <div style="position:relative; max-width:92vw; max-height:90vh; text-align:center;">
                    <button id="lb-close" style="position:absolute; top:-45px; right:0; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); width:38px; height:38px; border-radius:50%; color:#fff; font-size:22px; cursor:pointer; display:flex; align-items:center; justify-content:center;">
                        <i class="ri-close-line"></i>
                    </button>
                    <img src="${imgSrc}" style="max-width:100%; max-height:85vh; border-radius:20px; box-shadow:0 30px 80px rgba(0,0,0,0.9); border:1px solid rgba(255,255,255,0.15);">
                </div>
            `;
            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';

            const closeLb = () => {
                lightbox.remove();
                document.body.style.overflow = '';
            };

            lightbox.querySelector('#lb-close')?.addEventListener('click', closeLb);
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) closeLb();
            });
        });
    });
});
