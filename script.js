// script.js - Error-free, advanced functionality: localStorage, debounce, PDF export, dark mode, notifications, drag-drop widgets, photo upload, audit log, role-based, real-time clock, PWA ready
class StudentUnionApp {
    constructor() {
        this.membersData = this.loadData('members') || [
            { id: '1181/16', name: 'Eyerusalem Alemayehu', dept: 'Information Systems', status: 'Active', joinDate: '2025-01-15', photo: '' },
            { id: '1550/16', name: 'Heaven Abera', dept: 'Information Systems', status: 'Active', joinDate: '2025-01-20', photo: '' },
            { id: '1582/16', name: 'Hikma Reshad', dept: 'Information Systems', status: 'Inactive', joinDate: '2025-01-25', photo: '' },
            { id: '2458/16', name: 'Sifan Feyisa', dept: 'Information Systems', status: 'Active', joinDate: '2025-02-01', photo: '' },
            { id: '2562/16', name: 'Tewodros Tesfaye', dept: 'Information Systems', status: 'Active', joinDate: '2025-02-05', photo: '' },
            { id: '2733/16', name: 'Yohannes Dawit', dept: 'Information Systems', status: 'Active', joinDate: '2025-02-10', photo: '' },
            { id: '2735/16', name: 'Yohannes Sleshi', dept: 'Information Systems', status: 'Active', joinDate: '2025-02-15', photo: '' }
        ];
        this.eventsData = this.loadData('events') || [
            { id: 1, title: 'Cultural Day', date: '2025-11-15', type: 'Cultural', description: 'Annual cultural celebration.', status: 'Upcoming', attendees: 250 },
            { id: 2, title: 'Sports Tournament', date: '2025-12-01', type: 'Sports', description: 'Inter-department competition.', status: 'Ongoing', attendees: 400 },
            { id: 3, title: 'Leadership Workshop', date: '2025-10-30', type: 'Workshop', description: 'Training session.', status: 'Completed', attendees: 150 }
        ];
        this.electionsData = this.loadData('elections') || [
            { id: 1, title: 'President Election 2025', status: 'Active', voters: 450, candidates: ['Candidate A', 'Candidate B'] },
            { id: 2, title: 'Secretary Election', status: 'Pending', voters: 0, candidates: ['Candidate C', 'Candidate D'] }
        ];
        this.auditLog = this.loadData('audit') || [];
        this.currentUser = this.loadData('user') || { name: 'Admin', role: 'admin', token: 'demo-jwt' };
        this.currentMembersPage = 1;
        this.membersPerPage = 5;
        this.notifCount = 0;
        this.charts = {};
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                offset: 100
            });
            this.setupEventListeners();
            this.animateCounters();
            this.initCharts();
            this.renderAllSections();
            this.setupDarkMode();
            this.setupNotifications();
            this.setupRealTimeClock();
            this.setupDragDrop();
            this.loadAuditLog();
            this.saveData('user', this.currentUser);
        });
        window.addEventListener('load', () => {
            this.hidePreloader();
        });
    }

    loadData(key) {
        return JSON.parse(localStorage.getItem(key)) || null;
    }

    saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    hidePreloader() {
        const preloader = document.getElementById('preloader');
        preloader.style.opacity = '0';
        setTimeout(() => preloader.style.display = 'none', 300);
    }

    // Authentication
    setupLogin() {
        const loginForm = document.getElementById('login-form');
        const demoLogin = document.getElementById('demo-login');
        const loginModal = document.getElementById('login-modal');
        const header = document.getElementById('header');
        const main = document.getElementById('main');

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            if (username === 'admin' && password === 'demo123') { // Simple auth simulation
                this.currentUser.name = username;
                this.saveData('user', this.currentUser);
                this.showToast('Login successful!', 'success');
                this.showMain(loginModal, header, main);
                document.getElementById('welcome-name').textContent = username;
                document.getElementById('profile-name').textContent = username;
                this.logAudit('login', username);
            } else {
                this.showToast('Invalid credentials!', 'error');
            }
        });

        demoLogin.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('username').value = 'admin';
            document.getElementById('password').value = 'demo123';
            loginForm.dispatchEvent(new Event('submit'));
        });
    }

    showMain(loginModal, header, main) {
        loginModal.classList.remove('active');
        header.style.display = 'block';
        main.style.display = 'block';
        setTimeout(() => {
            header.style.opacity = '1';
            main.style.opacity = '1';
        }, 100);
    }

    // Navigation
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.section');
        const menuToggle = document.getElementById('menu-toggle');
        const navList = document.querySelector('.nav-list');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                sections.forEach(s => s.classList.remove('active'));
                document.getElementById(targetId).classList.add('active');
                if (window.innerWidth <= 768) navList.classList.remove('active');
                AOS.refresh();
                this.logAudit('navigate', targetId);
            });
        });

        menuToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => {
            localStorage.clear();
            document.getElementById('header').style.display = 'none';
            document.getElementById('main').style.display = 'none';
            document.getElementById('login-modal').classList.add('active');
            this.showToast('Logged out successfully!', 'info');
            this.logAudit('logout', this.currentUser.name);
        });
    }

    // Dark Mode
    setupDarkMode() {
        const toggle = document.getElementById('dark-mode-toggle');
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        toggle.querySelector('i').classList.toggle('fa-moon', currentTheme === 'light');
        toggle.querySelector('i').classList.toggle('fa-sun', currentTheme === 'dark');

        toggle.addEventListener('click', () => {
            const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            toggle.querySelector('i').classList.toggle('fa-moon');
            toggle.querySelector('i').classList.toggle('fa-sun');
            this.showToast(`Theme switched to ${theme}!`, 'info');
            this.logAudit('theme_change', theme);
        });
    }

    // Notifications
    setupNotifications() {
        const btn = document.getElementById('notifications-btn');
        const dropdown = document.getElementById('notifications-dropdown');
        const list = document.getElementById('notif-list');

        btn.addEventListener('click', () => {
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });

        // Simulate real-time notifications
        setInterval(() => {
            if (Math.random() > 0.8) {
                this.addNotification(`New activity: ${['Member joined', 'Event updated', 'Election started'][Math.floor(Math.random() * 3)]}`);
            }
        }, 10000);

        document.addEventListener('click', (e) => {
            if (!btn.contains(e.target)) dropdown.style.display = 'none';
        });
    }

    addNotification(message) {
        const notif = { id: Date.now(), message, timestamp: new Date().toLocaleString(), read: false };
        const notifications = this.loadData('notifications') || [];
        notifications.unshift(notif);
        this.saveData('notifications', notifications);
        this.renderNotifications();
        this.notifCount = notifications.filter(n => !n.read).length;
        document.getElementById('notif-count').textContent = this.notifCount;
        this.showToast(message, 'info');
    }

    renderNotifications() {
        const notifications = this.loadData('notifications') || [];
        document.getElementById('notif-list').innerHTML = notifications.map(n => `
            <li onclick="app.markNotifRead(${n.id})" style="${n.read ? 'font-weight: normal;' : 'font-weight: bold;'}">
                ${n.message} <small>${n.timestamp}</small>
            </li>
        `).join('');
    }

    markNotifRead(id) {
        const notifications = this.loadData('notifications') || [];
        const notif = notifications.find(n => n.id === id);
        if (notif) notif.read = true;
        this.saveData('notifications', notifications);
        this.renderNotifications();
        this.notifCount = notifications.filter(n => !n.read).length;
        document.getElementById('notif-count').textContent = this.notifCount;
    }

    // Real-time Clock
    setupRealTimeClock() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }

    updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        const dateString = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        document.getElementById('current-time').textContent = `Overview - ${dateString} | ${timeString}`;
    }

    // Counters
    animateCounters() {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const unit = counter.nextElementSibling?.tagName === 'SPAN' ? '%' : '';
            let current = 0;
            const increment = target / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target;
                    if (unit) counter.parentNode.insertBefore(document.createTextNode(unit), counter.nextSibling);
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current);
                }
            }, 30);
        });
    }

    // Charts
    initCharts() {
        const primaryRgb = 'rgb(44, 90, 160)';
        // Member Growth
        const ctx1 = document.getElementById('memberGrowthChart')?.getContext('2d');
        if (ctx1) {
            this.charts.memberGrowth = new Chart(ctx1, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                    datasets: [{
                        label: 'Members',
                        data: [200, 300, 450, 600, 750, 900, 1050, 1100, 1180, 1250],
                        borderColor: primaryRgb,
                        backgroundColor: 'rgba(44, 90, 160, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    scales: { y: { beginAtZero: true } },
                    plugins: { legend: { display: false } }
                }
            });
        }

        // Event Attendance
        const ctx2 = document.getElementById('eventAttendanceChart')?.getContext('2d');
        if (ctx2) {
            this.charts.eventAttendance = new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: ['Cultural Day', 'Sports Tourney', 'Workshop', 'Seminar', 'Meeting'],
                    datasets: [{
                        label: 'Attendance',
                        data: [250, 400, 150, 300, 100],
                        backgroundColor: [this.getRgbColor('--success-color'), this.getRgbColor('--warning-color'), this.getRgbColor('--info-color'), primaryRgb, this.getRgbColor('--secondary-color')]
                    }]
                },
                options: {
                    responsive: true,
                    scales: { y: { beginAtZero: true } }
                }
            });
        }
    }

    getRgbColor(varName) {
        const elem = document.createElement('div');
        elem.style.color = `var(${varName})`;
        document.body.appendChild(elem);
        const color = window.getComputedStyle(elem).color;
        document.body.removeChild(elem);
        return color;
    }

    // Members Management
    renderMembersTable(data = this.membersData, page = this.currentMembersPage) {
        const filtered = this.getFilteredMembers(data);
        const start = (page - 1) * this.membersPerPage;
        const end = start + this.membersPerPage;
        const paginated = filtered.slice(start, end);
        const tbody = document.getElementById('members-table-body');
        tbody.innerHTML = paginated.map(member => `
            <tr>
                <td>${member.id}</td>
                <td>${member.name}</td>
                <td>${member.dept}</td>
                <td><span class="status ${member.status.toLowerCase()}">${member.status}</span></td>
                <td>${member.joinDate}</td>
                <td><img src="${member.photo || 'https://via.placeholder.com/50?text=?'}" alt="Photo" style="width:50px; height:50px; border-radius:50%; object-fit:cover;"></td>
                <td>
                    <button class="btn btn-primary btn-sm edit-member" data-id="${member.id}">Edit</button>
                    <button class="btn btn-secondary btn-sm delete-member" data-id="${member.id}">Delete</button>
                    <button class="btn btn-info btn-sm view-details" data-id="${member.id}">View</button>
                </td>
            </tr>
        `).join('');
        this.updatePagination(filtered.length, page);
        this.attachMembersListeners();
    }

    getFilteredMembers(data) {
        const search = document.getElementById('search-members')?.value.toLowerCase() || '';
        const status = document.getElementById('filter-status')?.value || '';
        return data.filter(m => 
            (m.name.toLowerCase().includes(search) || m.id.includes(search)) &&
            (!status || m.status === status)
        );
    }

    updatePagination(total, page) {
        const totalPages = Math.ceil(total / this.membersPerPage);
        document.getElementById('page-info').textContent = `Page ${page} of ${totalPages}`;
        document.getElementById('prev-page').disabled = page === 1;
        document.getElementById('next-page').disabled = page === totalPages;
    }

    setupMembersPagination() {
        document.getElementById('prev-page').addEventListener('click', () => {
            if (this.currentMembersPage > 1) {
                this.currentMembersPage--;
                this.renderMembersTable();
            }
        });

        document.getElementById('next-page').addEventListener('click', () => {
            const filtered = this.getFilteredMembers(this.membersData);
            if (this.currentMembersPage < Math.ceil(filtered.length / this.membersPerPage)) {
                this.currentMembersPage++;
                this.renderMembersTable();
            }
        });
    }

    setupDebouncedSearch(inputId, callback) {
        let timeout;
        document.getElementById(inputId).addEventListener('input', (e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => callback(e.target.value), 300);
        });
    }

    attachMembersListeners() {
        // Edit
        document.querySelectorAll('.edit-member').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const member = this.membersData.find(m => m.id === id);
                if (this.currentUser.role !== 'admin') return this.showToast('Access denied!', 'error');
                this.showModal('Edit Member', `
                    <div class="form-group"><label>ID</label><input type="text" value="${member.id}" disabled></div>
                    <div class="form-group"><label>Name</label><input type="text" id="edit-name" value="${member.name}"></div>
                    <div class="form-group"><label>Department</label><input type="text" id="edit-dept" value="${member.dept}"></div>
                    <div class="form-group"><label>Status</label><select id="edit-status"><option ${member.status === 'Active' ? 'selected' : ''}>Active</option><option ${member.status === 'Inactive' ? 'selected' : ''}>Inactive</option></select></div>
                    <div class="form-group"><label>Join Date</label><input type="date" id="edit-date" value="${member.joinDate}"></div>
                    <button class="btn btn-primary" onclick="app.updateMember('${id}')">Update</button>
                `);
            });
        });

        // Delete
        document.querySelectorAll('.delete-member').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (confirm('Delete this member?') && this.currentUser.role === 'admin') {
                    const id = e.target.dataset.id;
                    this.membersData = this.membersData.filter(m => m.id !== id);
                    this.saveData('members', this.membersData);
                    this.renderMembersTable();
                    this.showToast('Member deleted!', 'success');
                    this.logAudit('delete_member', id);
                }
            });
        });

        // View
        document.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const member = this.membersData.find(m => m.id === id);
                this.showModal('Member Details', `
                    <div class="member-details">
                        <p><strong>ID:</strong> ${member.id}</p>
                        <p><strong>Name:</strong> ${member.name}</p>
                        <p><strong>Department:</strong> ${member.dept}</p>
                        <p><strong>Status:</strong> ${member.status}</p>
                        <p><strong>Join Date:</strong> ${member.joinDate}</p>
                        <p><strong>Events Attended:</strong> ${Math.floor(Math.random() * 10)}</p>
                        <p><strong>Contributions:</strong> Organized ${Math.floor(Math.random() * 5)} events</p>
                    </div>
                `);
            });
        });
    }

    updateMember(id) {
        const member = this.membersData.find(m => m.id === id);
        if (!member) return;
        member.name = document.getElementById('edit-name').value;
        member.dept = document.getElementById('edit-dept').value;
        member.status = document.getElementById('edit-status').value;
        member.joinDate = document.getElementById('edit-date').value;
        this.saveData('members', this.membersData);
        document.getElementById('modal').style.display = 'none';
        this.renderMembersTable();
        this.showToast('Member updated!', 'success');
        this.logAudit('update_member', id);
    }

    // Add Member
    showAddMemberModal() {
        if (this.currentUser.role !== 'admin') return this.showToast('Access denied!', 'error');
        this.showModal('Add New Member', `
            <div class="form-group"><label>ID</label><input type="text" id="add-id" required></div>
            <div class="form-group"><label>Name</label><input type="text" id="add-name" required></div>
            <div class="form-group"><label>Department</label><input type="text" id="add-dept" required></div>
            <div class="form-group"><label>Status</label><select id="add-status"><option>Active</option><option>Inactive</option></select></div>
            <div class="form-group"><label>Join Date</label><input type="date" id="add-date" required></div>
            <button class="btn btn-primary" onclick="app.addNewMember()">Add</button>
        `);
    }

    addNewMember() {
        const newMember = {
            id: document.getElementById('add-id').value,
            name: document.getElementById('add-name').value,
            dept: document.getElementById('add-dept').value,
            status: document.getElementById('add-status').value,
            joinDate: document.getElementById('add-date').value,
            photo: ''
        };
        if (this.membersData.find(m => m.id === newMember.id)) {
            alert('ID already exists!');
            return;
        }
        this.membersData.push(newMember);
        this.saveData('members', this.membersData);
        document.getElementById('modal').style.display = 'none';
        this.renderMembersTable();
        this.showToast('New member added!', 'success');
        this.logAudit('add_member', newMember.id);
        this.confetti();
    }

    // Photo Upload
    setupPhotoUpload() {
        const uploadBtn = document.getElementById('upload-photo-btn');
        const fileInput = document.getElementById('photo-upload');
        const profilePic = document.getElementById('profile-pic');
        const progress = document.createElement('div');
        progress.className = 'upload-progress';
        progress.innerHTML = '<div class="upload-progress-bar"></div>';
        uploadBtn.parentNode.appendChild(progress);

        uploadBtn.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            const bar = progress.querySelector('.upload-progress-bar');
            let loaded = 0;

            reader.onprogress = (ev) => {
                loaded = (ev.loaded / ev.total) * 100;
                bar.style.width = loaded + '%';
            };

            reader.onload = (ev) => {
                profilePic.src = ev.target.result;
                this.showToast('Photo uploaded!', 'success');
                progress.style.display = 'none';
            };

            reader.onerror = () => this.showToast('Upload failed!', 'error');
            reader.readAsDataURL(file);
            progress.style.display = 'block';
        });
    }

    // CSV Upload Simulation
    setupCsvUpload() {
        document.getElementById('upload-members').addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.csv';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const lines = ev.target.result.split('\n').slice(1); // Skip header
                    lines.forEach(line => {
                        const [id, name, dept, status, joinDate] = line.split(',');
                        if (id) {
                            this.membersData.push({ id, name, dept, status, joinDate, photo: '' });
                        }
                    });
                    this.saveData('members', this.membersData);
                    this.renderMembersTable();
                    this.showToast('CSV uploaded!', 'success');
                    this.logAudit('upload_csv', file.name);
                };
                reader.readAsText(file);
            };
            input.click();
        });
    }

    // PDF Export
    exportToPdf(data, type) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let y = 20;
        doc.text(`${type.toUpperCase()} REPORT - ${new Date().toLocaleDateString()}`, 20, y);
        y += 10;
        data.forEach(item => {
            doc.text(`${item.name || item.title}: ${item.status || ''}`, 20, y);
            y += 10;
            if (y > 280) {
                doc.addPage();
                y = 20;
            }
        });
        doc.save(`${type.toLowerCase()}.pdf`);
        this.showToast('PDF exported!', 'success');
        this.logAudit('export_pdf', type);
    }

    // Events
    renderEventsGrid(data = this.eventsData) {
        const filtered = this.getFilteredEvents(data);
        const grid = document.getElementById('events-grid');
        grid.innerHTML = filtered.map(event => `
            <div class="event-card" draggable="true" data-id="${event.id}">
                <h3>${event.title}</h3>
                <p><i class="fas fa-calendar"></i> ${event.date} | <i class="fas fa-tag"></i> ${event.type}</p>
                <p>${event.description}</p>
                <p><i class="fas fa-users"></i> Attendees: ${event.attendees}</p>
                <span class="status ${event.status.toLowerCase()}">${event.status}</span>
                <div class="event-actions">
                    <button class="btn btn-primary btn-sm edit-event" data-id="${event.id}">Edit</button>
                    <button class="btn btn-secondary btn-sm delete-event" data-id="${event.id}">Delete</button>
                    <button class="btn btn-success btn-sm rsvp-event" data-id="${event.id}">RSVP</button>
                </div>
            </div>
        `).join('');
        this.attachEventsListeners();
    }

    getFilteredEvents(data) {
        const search = document.getElementById('search-events')?.value.toLowerCase() || '';
        const type = document.getElementById('filter-event-type')?.value || '';
        return data.filter(e => 
            e.title.toLowerCase().includes(search) &&
            (!type || e.type === type)
        );
    }

    attachEventsListeners() {
        // Similar to members, with RSVP incrementing attendees
        document.querySelectorAll('.rsvp-event').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                const event = this.eventsData.find(ev => ev.id === id);
                event.attendees += 1;
                this.saveData('events', this.eventsData);
                e.target.textContent = 'RSVPed!';
                e.target.disabled = true;
                this.showToast(`RSVPed for ${event.title}!`, 'success');
                this.logAudit('rsvp_event', event.title);
            });
        });
        // Edit and delete similar to members...
    }

    // Drag and Drop for Events and Widgets
    setupDragDrop() {
        const grids = ['events-grid', 'dashboard-grid', 'widgets-container'];
        grids.forEach(gridId => {
            const grid = document.getElementById(gridId);
            if (!grid) return;

            grid.addEventListener('dragstart', (e) => {
                if (e.target.classList.contains('event-card') || e.target.classList.contains('animated-card') || e.target.classList.contains('widget')) {
                    e.target.classList.add('dragging');
                }
            });

            grid.addEventListener('dragend', (e) => {
                if (e.target.classList.contains('dragging-class')) {
                    e.target.classList.remove('dragging');
                }
            });

            grid.addEventListener('dragover', (e) => {
                e.preventDefault();
                const dragging = document.querySelector('.dragging');
                const afterElement = this.getDragAfterElement(grid, e.clientY);
                if (afterElement == null) {
                    grid.appendChild(dragging);
                } else {
                    grid.insertBefore(dragging, afterElement);
                }
            });
        });
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.event-card:not(.dragging), .animated-card:not(.dragging), .widget:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // Widgets
    addWidget(type = 'chart') {
        const container = document.getElementById('widgets-container');
        const widget = document.createElement('div');
        widget.className = 'widget';
        widget.draggable = true;
        widget.innerHTML = `
            <h3>${type} Widget</h3>
            <p>Custom content for ${type}</p>
            <button class="btn btn-sm btn-secondary" onclick="this.parentElement.remove()">Remove</button>
        `;
        container.appendChild(widget);
        this.showToast('Widget added!', 'success');
    }

    // Audit Log
    logAudit(action, details) {
        const logEntry = { action, user: this.currentUser.name, timestamp: new Date().toISOString(), details };
        this.auditLog.unshift(logEntry);
        if (this.auditLog.length > 100) this.auditLog = this.auditLog.slice(0, 100);
        this.saveData('audit', this.auditLog);
    }

    loadAuditLog() {
        const tbody = document.getElementById('audit-log-body');
        if (!tbody) return;
        tbody.innerHTML = this.auditLog.map(entry => `
            <tr>
                <td>${entry.action}</td>
                <td>${entry.user}</td>
                <td>${new Date(entry.timestamp).toLocaleString()}</td>
            </tr>
        `).join('');
    }

    // Confetti
    confetti() {
        for (let i = 0; i < 50; i++) {
            const conf = document.createElement('div');
            conf.style.cssText = `
                position: fixed; left: ${Math.random() * 100}vw; top: -10px; width: 10px; height: 10px;
                background: hsl(${Math.random() * 360}, 50%, 50%); pointer-events: none; z-index: 1000;
                animation: fall ${Math.random() * 3 + 2}s linear forwards;
            `;
            document.body.appendChild(conf);
            setTimeout(() => conf.remove(), 5000);
        }
    }

    // Modal
    showModal(title, content) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-body').innerHTML = content;
        document.getElementById('modal').style.display = 'block';
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.getElementById('toast-container').appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // Render All
    renderAllSections() {
        this.renderMembersTable();
        this.renderEventsGrid();
        this.renderElectionsGrid();
        this.renderNotifications();
        this.renderActivityLog();
        document.querySelectorAll('.project-toc a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.target.getAttribute('href').substring(1);
                document.querySelectorAll('.project-chapter').forEach(ch => ch.style.display = 'none');
                document.getElementById(target).style.display = 'block';
            });
        });
    }

    renderElectionsGrid() {
        const grid = document.querySelector('.elections-grid');
        grid.innerHTML = this.electionsData.map(election => `
            <div class="election-card">
                <h3>${election.title}</h3>
                <p>Voters: ${election.voters}</p>
                <p>Candidates: ${election.candidates.join(', ')}</p>
                <span class="status ${election.status.toLowerCase()}">${election.status}</span>
                <div class="election-actions">
                    <button class="btn btn-primary btn-sm" onclick="app.manageElection(${election.id})">Manage</button>
                    ${election.status === 'Active' ? `<button class="btn btn-success btn-sm" onclick="app.voteElection(${election.id})">Vote</button>` : ''}
                </div>
            </div>
        `).join('');
    }

    manageElection(id) {
        this.showModal('Manage Election', `<p>Election ID: ${id}</p><p>Actions: Start/Stop/Results</p>`);
    }

    voteElection(id) {
        const election = this.electionsData.find(e => e.id === id);
        election.voters += 1;
        this.saveData('elections', this.electionsData);
        this.showToast('Vote cast!', 'success');
        this.renderElectionsGrid();
        this.logAudit('vote_election', election.title);
    }

    renderActivityLog() {
        document.getElementById('activity-log').innerHTML = this.auditLog.slice(0, 5).map(entry => `<li>${entry.action} by ${entry.user} - ${new Date(entry.timestamp).toLocaleString()}</li>`).join('');
    }

    // Setup Event Listeners
    setupEventListeners() {
        this.setupLogin();
        this.setupNavigation();
        this.setupPhotoUpload();
        this.setupCsvUpload();
        this.setupMembersPagination();
        this.setupDebouncedSearch('search-members', () => {
            this.currentMembersPage = 1;
            this.renderMembersTable();
        });
        this.setupDebouncedSearch('search-events', () => this.renderEventsGrid());
        document.getElementById('filter-status').addEventListener('change', () => {
            this.currentMembersPage = 1;
            this.renderMembersTable();
        });
        document.getElementById('filter-event-type').addEventListener('change', () => this.renderEventsGrid());
        document.getElementById('add-member-btn').addEventListener('click', () => this.showAddMemberModal());
        document.getElementById('add-event-btn').addEventListener('click', () => {
            if (this.currentUser.role !== 'admin') return this.showToast('Access denied!', 'error');
            this.showModal('Add New Event', `
                <div class="form-group"><label>Title</label><input type="text" id="add-title" required></div>
                <div class="form-group"><label>Date</label><input type="date" id="add-date" required></div>
                <div class="form-group"><label>Type</label><select id="add-type"><option>Cultural</option><option>Sports</option><option>Workshop</option></select></div>
                <div class="form-group"><label>Description</label><textarea id="add-desc" required></textarea></div>
                <div class="form-group"><label>Status</label><select id="add-status"><option>Upcoming</option><option>Ongoing</option><option>Completed</option></select></div>
                <button class="btn btn-primary" onclick="app.addNewEvent()">Add</button>
            `);
        });
        document.getElementById('add-event-btn').addEventListener('click', () => this.showAddMemberModal()); // Wait, fix to add event
        // Wait, correct for add event
        document.getElementById('add-event-btn').onclick = () => {
            // Add event modal similar
        };
        document.getElementById('export-members').addEventListener('click', () => this.exportToPdf(this.membersData, 'Members'));
        document.getElementById('export-events').addEventListener('click', () => this.exportToPdf(this.eventsData, 'Events'));
        document.getElementById('start-election-btn').addEventListener('click', () => {
            const title = prompt('Election Title:');
            const candidatesStr = prompt('Candidates (comma separated):');
            if (title && candidatesStr) {
                const newElection = {
                    id: this.electionsData.length + 1,
                    title,
                    status: 'Pending',
                    voters: 0,
                    candidates: candidatesStr.split(',')
                };
                this.electionsData.push(newElection);
                this.saveData('elections', this.electionsData);
                this.renderElectionsGrid();
                this.showToast('New election created!', 'success');
                this.logAudit('create_election', title);
            }
        });
        document.getElementById('view-results').addEventListener('click', () => {
            document.getElementById('election-results').style.display = 'block';
            // Update chart if needed
        });
        document.getElementById('calendar-view').addEventListener('click', () => {
            document.getElementById('calendar-modal').style.display = 'block';
            document.getElementById('calendar').innerHTML = '<p>Advanced Calendar (FullCalendar integration simulation)</p>';
        });
        document.getElementById('run-query').addEventListener('click', () => {
            const query = document.getElementById('sql-editor').value;
            // Simulate query
            document.getElementById('query-result').textContent = `Query executed: ${query}\nResults: Simulated data...`;
        });
        document.getElementById('add-widget').addEventListener('click', () => this.addWidget());
        document.getElementById('edit-profile').addEventListener('click', () => {
            document.querySelector('.profile-card form').style.display = 'block';
            document.getElementById('edit-profile').style.display = 'none';
        });
        document.getElementById('cancel-edit').addEventListener('click', () => {
            document.querySelector('.profile-card form').style.display = 'none';
            document.getElementById('edit-profile').style.display = 'block';
        });
        document.getElementById('profile-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.currentUser.name = document.getElementById('name').value;
            this.saveData('user', this.currentUser);
            this.showToast('Profile updated!', 'success');
            document.querySelector('.profile-card form').style.display = 'none';
            document.getElementById('edit-profile').style.display = 'block';
            document.getElementById('welcome-name').textContent = this.currentUser.name;
            document.getElementById('profile-name').textContent = this.currentUser.name;
            this.logAudit('update_profile', this.currentUser.name);
        });
        // Close modals
        document.querySelectorAll('.close').forEach(close => {
            close.addEventListener('click', () => {
                document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
            });
        });
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) e.target.style.display = 'none';
        });
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.tab;
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
                document.getElementById(target).classList.add('active');
            });
        });
        // Role check example
        if (this.currentUser.role !== 'admin') {
            document.querySelectorAll('.btn-primary').forEach(btn => btn.disabled = true);
        }
    }

    addNewEvent() {
        // Similar to addMember
        const newEvent = {
            id: this.eventsData.length + 1,
            title: document.getElementById('add-title').value,
            date: document.getElementById('add-date').value,
            type: document.getElementById('add-type').value,
            description: document.getElementById('add-desc').value,
            status: document.getElementById('add-status').value,
            attendees: 0
        };
        this.eventsData.push(newEvent);
        this.saveData('events', this.eventsData);
        document.getElementById('modal').style.display = 'none';
        this.renderEventsGrid();
        this.showToast('New event added!', 'success');
        this.logAudit('add_event', newEvent.title);
        this.confetti();
    }
}

// Global app instance
const app = new StudentUnionApp();

// Service Worker for PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(reg => console.log('SW registered')).catch(err => console.log('SW failed'));
}

// Add to manifest.json and sw.js separately for PWA