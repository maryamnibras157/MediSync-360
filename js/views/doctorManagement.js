// MediSync 360 - Doctor Management Module

export const doctorManagementView = {
  viewState: {
    selectedDoctorId: null,
    filterDept: "all",
    filterStatus: "all",
    searchQuery: "",
    sortBy: "name",
    modalOpen: false
  },

  render(container, state, actions) {
    if (this.viewState.selectedDoctorId) {
      this.renderProfile(container, state, actions);
      return;
    }

    let doctors = [...state.doctors];

    // Search query
    if (this.viewState.searchQuery) {
      const q = this.viewState.searchQuery.toLowerCase();
      doctors = doctors.filter(d => 
        d.name.toLowerCase().includes(q) || 
        d.specialty.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q)
      );
    }

    // Department filter
    if (this.viewState.filterDept !== "all") {
      doctors = doctors.filter(d => d.department === this.viewState.filterDept);
    }

    // Status filter
    if (this.viewState.filterStatus !== "all") {
      doctors = doctors.filter(d => d.status === this.viewState.filterStatus);
    }

    // Sorting
    doctors.sort((a, b) => {
      if (this.viewState.sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (this.viewState.sortBy === "experience") {
        return b.experience - a.experience;
      } else if (this.viewState.sortBy === "patients") {
        const aCount = state.appointments.filter(apt => apt.doctorId === a.id && apt.status === 'Scheduled').length;
        const bCount = state.appointments.filter(apt => apt.doctorId === b.id && apt.status === 'Scheduled').length;
        return bCount - aCount;
      }
      return 0;
    });

    let html = `
      <div class="page-fade-in">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 4px;">
          <h2 class="page-heading">Clinician Registry</h2>
          <button class="btn btn-primary btn-sm" id="btn-open-add-doctor-modal">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
            Add New Doctor
          </button>
        </div>
        <p class="page-subheading">Manage physician credentials, active hospital roster, shift schedules and availability metrics.</p>

        <!-- Filters Bar -->
        <div class="filter-bar">
          <div class="filter-group">
            <select id="filter-doctor-dept" class="role-select" style="width:160px; padding: 6px 10px; font-size:12px;">
              <option value="all" ${this.viewState.filterDept === 'all' ? 'selected' : ''}>All Departments</option>
              <option value="Cardiology" ${this.viewState.filterDept === 'Cardiology' ? 'selected' : ''}>Cardiology</option>
              <option value="Internal Medicine" ${this.viewState.filterDept === 'Internal Medicine' ? 'selected' : ''}>Internal Medicine</option>
              <option value="Neurology" ${this.viewState.filterDept === 'Neurology' ? 'selected' : ''}>Neurology</option>
              <option value="General Surgery" ${this.viewState.filterDept === 'General Surgery' ? 'selected' : ''}>General Surgery</option>
              <option value="Nephrology" ${this.viewState.filterDept === 'Nephrology' ? 'selected' : ''}>Nephrology</option>
            </select>

            <select id="filter-doctor-status" class="role-select" style="width:140px; padding: 6px 10px; font-size:12px;">
              <option value="all" ${this.viewState.filterStatus === 'all' ? 'selected' : ''}>All Statuses</option>
              <option value="Available" ${this.viewState.filterStatus === 'Available' ? 'selected' : ''}>Available</option>
              <option value="Consulting" ${this.viewState.filterStatus === 'Consulting' ? 'selected' : ''}>Consulting</option>
              <option value="Surgery" ${this.viewState.filterStatus === 'Surgery' ? 'selected' : ''}>Surgery</option>
              <option value="Emergency" ${this.viewState.filterStatus === 'Emergency' ? 'selected' : ''}>Emergency</option>
              <option value="On Break" ${this.viewState.filterStatus === 'On Break' ? 'selected' : ''}>On Break</option>
              <option value="Offline" ${this.viewState.filterStatus === 'Offline' ? 'selected' : ''}>Offline</option>
            </select>

            <select id="sort-doctor" class="role-select" style="width:140px; padding: 6px 10px; font-size:12px;">
              <option value="name" ${this.viewState.sortBy === 'name' ? 'selected' : ''}>Sort by Name</option>
              <option value="experience" ${this.viewState.sortBy === 'experience' ? 'selected' : ''}>Sort by Experience</option>
              <option value="patients" ${this.viewState.sortBy === 'patients' ? 'selected' : ''}>Sort by Active Patients</option>
            </select>
          </div>

          <div class="header-search" style="width: 250px; padding: 6px 12px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" id="doctor-search-input" value="${this.viewState.searchQuery}" placeholder="Search Name or Specialty..." style="font-size: 12px; margin-left: 6px;">
          </div>
        </div>

        <!-- Doctors Ledger -->
        <div class="card">
          <div class="table-wrapper">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Doctor ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Specialty</th>
                  <th>Experience</th>
                  <th>Occupancy Rate</th>
                  <th>Assigned Patients</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${doctors.map(d => {
                  let statusBadge = "badge-green";
                  if (d.status === "Emergency") statusBadge = "badge-red";
                  else if (d.status === "Consulting") statusBadge = "badge-blue";
                  else if (d.status === "Surgery") statusBadge = "badge-teal";
                  else if (d.status === "On Break") statusBadge = "badge-orange";
                  else if (d.status === "Offline") statusBadge = "badge-red"; // Muted red/gray

                  const assignedCount = state.appointments.filter(apt => apt.doctorId === d.id && apt.status === 'Scheduled').length;

                  return `
                    <tr>
                      <td><code>${d.id}</code></td>
                      <td><strong>${d.name}</strong></td>
                      <td>${d.department || d.specialty}</td>
                      <td class="text-secondary">${d.specialty}</td>
                      <td>${d.experience} yrs</td>
                      <td>
                        <strong style="color:${d.occupancy > 80 ? 'var(--color-warning)' : 'var(--color-primary)'}">${d.occupancy}%</strong>
                      </td>
                      <td><strong>${assignedCount} patients</strong></td>
                      <td><span class="badge ${statusBadge}">${d.status}</span></td>
                      <td>
                        <button class="btn btn-secondary btn-sm btn-doc-profile" data-id="${d.id}" style="padding:4px 8px;">View Profile</button>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Add Doctor Modal -->
      ${this.renderModal()}
    `;

    container.innerHTML = html;
    this.attachListeners(container, state, actions);
  },

  renderModal() {
    if (!this.viewState.modalOpen) return '';

    return `
      <div class="modal-overlay open" id="doctor-modal-overlay">
        <div class="modal-container" style="width: 600px;">
          <div class="modal-header">
            <h3>Add New Physician to Roster</h3>
            <button class="modal-close" id="btn-close-doctor-modal">&times;</button>
          </div>
          <form id="doctor-registration-form">
            
            <div class="form-section-title">Professional Details</div>
            <div class="form-row">
              <div class="form-group">
                <label for="form-d-name">Full Name *</label>
                <input type="text" class="form-control" id="form-d-name" placeholder="e.g. Dr. Sarah Jenkins" required>
              </div>
              <div class="form-group">
                <label for="form-d-specialty">Specialty *</label>
                <input type="text" class="form-control" id="form-d-specialty" placeholder="e.g. Pediatric Cardiology" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="form-d-dept">Department *</label>
                <select class="form-control" id="form-d-dept" required>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Internal Medicine">Internal Medicine</option>
                  <option value="Neurology">Neurology</option>
                  <option value="General Surgery">General Surgery</option>
                  <option value="Nephrology">Nephrology</option>
                </select>
              </div>
              <div class="form-group">
                <label for="form-d-exp">Experience (Years) *</label>
                <input type="number" class="form-control" id="form-d-exp" placeholder="e.g. 10" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="form-d-qual">Qualification *</label>
                <input type="text" class="form-control" id="form-d-qual" placeholder="e.g. MD, FACC" required>
              </div>
              <div class="form-group">
                <label for="form-d-fee">Consultation Fee ($) *</label>
                <input type="number" class="form-control" id="form-d-fee" placeholder="e.g. 150" required>
              </div>
            </div>

            <div class="form-section-title">Availability & Status</div>
            <div class="form-row">
              <div class="form-group">
                <label for="form-d-start">Shift Start *</label>
                <input type="text" class="form-control" id="form-d-start" value="09:00 AM" placeholder="e.g. 09:00 AM" required>
              </div>
              <div class="form-group">
                <label for="form-d-end">Shift End *</label>
                <input type="text" class="form-control" id="form-d-end" value="05:00 PM" placeholder="e.g. 05:00 PM" required>
              </div>
            </div>
            
            <div class="form-group">
              <label>Working Days *</label>
              <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px; margin-top:4px;">
                <label style="font-size:12px; display:flex; align-items:center; gap:6px; cursor:pointer;">
                  <input type="checkbox" name="workdays" value="Monday" checked> Mon
                </label>
                <label style="font-size:12px; display:flex; align-items:center; gap:6px; cursor:pointer;">
                  <input type="checkbox" name="workdays" value="Tuesday" checked> Tue
                </label>
                <label style="font-size:12px; display:flex; align-items:center; gap:6px; cursor:pointer;">
                  <input type="checkbox" name="workdays" value="Wednesday" checked> Wed
                </label>
                <label style="font-size:12px; display:flex; align-items:center; gap:6px; cursor:pointer;">
                  <input type="checkbox" name="workdays" value="Thursday" checked> Thu
                </label>
                <label style="font-size:12px; display:flex; align-items:center; gap:6px; cursor:pointer;">
                  <input type="checkbox" name="workdays" value="Friday" checked> Fri
                </label>
                <label style="font-size:12px; display:flex; align-items:center; gap:6px; cursor:pointer;">
                  <input type="checkbox" name="workdays" value="Saturday"> Sat
                </label>
                <label style="font-size:12px; display:flex; align-items:center; gap:6px; cursor:pointer;">
                  <input type="checkbox" name="workdays" value="Sunday"> Sun
                </label>
              </div>
            </div>

            <div class="form-group">
              <label for="form-d-status">Initial Status *</label>
              <select class="form-control" id="form-d-status" required>
                <option value="Available">Available</option>
                <option value="Consulting">Consulting</option>
                <option value="Surgery">Surgery</option>
                <option value="Emergency">Emergency</option>
                <option value="On Break">On Break</option>
                <option value="Offline">Offline</option>
              </select>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary btn-sm" id="btn-cancel-doctor-modal">Cancel</button>
              <button type="submit" class="btn btn-primary btn-sm">Add Doctor</button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  renderProfile(container, state, actions) {
    const doctor = state.doctors.find(d => d.id === this.viewState.selectedDoctorId);
    if (!doctor) {
      this.viewState.selectedDoctorId = null;
      this.render(container, state, actions);
      return;
    }

    const doctorAppts = state.appointments.filter(a => a.doctorId === doctor.id);
    const upcomingAppts = doctorAppts.filter(a => a.status === "Scheduled" || a.status === "Checked-In" || a.status === "Consulting");
    
    // Find unique patients assigned
    const patientIds = [...new Set(doctorAppts.map(a => a.patientId))];
    const assignedPatients = state.patients.filter(p => patientIds.includes(p.id));

    // Audit logs for doctor
    const doctorLogs = state.auditLogs.filter(log => 
      log.actor.includes(doctor.name) || log.target.includes(doctor.name) || log.details.includes(doctor.name) || log.details.includes(doctor.id)
    );

    const activeTab = this.viewState.profileTab || "overview";

    let html = `
      <div class="page-fade-in">
        <div style="margin-bottom:20px; display:flex; gap:12px; align-items:center;">
          <button class="btn btn-secondary btn-sm" id="btn-back-to-doctors">
            &larr; Back to Directory
          </button>
          <h2 class="page-heading" style="margin-bottom:0;">Physician Credentials Profile</h2>
        </div>

        <div class="profile-layout">
          <!-- Left Sidebar Details -->
          <div style="display:flex; flex-direction:column; gap:20px;">
            <div class="card profile-sidebar-card">
              <div class="patient-avatar" style="width:80px; height:80px; font-size:32px; margin-bottom:12px; background:linear-gradient(135deg, var(--color-secondary), var(--color-info));">
                ${doctor.name.split(" ").pop()[0]}
              </div>
              <h3 style="font-size:18px; font-weight:700;">${doctor.name}</h3>
              <p class="text-muted" style="font-size:12px;">ID: <code>${doctor.id}</code></p>
              
              <div style="width:100%; border-top:1px solid var(--border-color); margin-top:20px; padding-top:20px; text-align:left; display:flex; flex-direction:column; gap:12px; font-size:12px;">
                <div class="meta-detail-item">
                  <span class="meta-detail-label">Roster Status</span>
                  <span class="badge ${doctor.status === 'Available' ? 'badge-green' : doctor.status === 'Consulting' ? 'badge-blue' : doctor.status === 'Surgery' ? 'badge-teal' : doctor.status === 'On Break' ? 'badge-orange' : 'badge-red'}" style="width:fit-content; margin-top:2px;">
                    ${doctor.status}
                  </span>
                </div>
                <div class="meta-detail-item">
                  <span class="meta-detail-label">Department</span>
                  <span class="meta-detail-value">${doctor.department || doctor.specialty}</span>
                </div>
                <div class="meta-detail-item">
                  <span class="meta-detail-label">Specialty</span>
                  <span class="meta-detail-value">${doctor.specialty}</span>
                </div>
                <div class="meta-detail-item">
                  <span class="meta-detail-label">Qualification</span>
                  <span class="meta-detail-value">${doctor.qualification || 'MD'}</span>
                </div>
                <div class="meta-detail-item">
                  <span class="meta-detail-label">Consultation Fee</span>
                  <span class="meta-detail-value">$${doctor.consultationFee || 150}</span>
                </div>
              </div>
            </div>
            
            <div class="card" style="text-align:center;">
              <h4 class="card-title" style="justify-content:center;">Capacity Occupancy</h4>
              <div style="font-size:36px; font-weight:700; color:var(--color-primary); margin-top:12px;">
                ${doctor.occupancy}%
              </div>
              <p class="text-muted" style="font-size:11px; margin-top:4px;">Average slot utilisation factor.</p>
            </div>
          </div>

          <!-- Right Content Area -->
          <div class="card">
            <!-- Tabs Menu -->
            <div class="profile-tab-menu">
              <button class="profile-tab-btn ${activeTab === 'overview' ? 'active' : ''}" data-tab="overview">Overview</button>
              <button class="profile-tab-btn ${activeTab === 'schedule' ? 'active' : ''}" data-tab="schedule">Upcoming Schedule</button>
              <button class="profile-tab-btn ${activeTab === 'patients' ? 'active' : ''}" data-tab="patients">Assigned Patients</button>
              <button class="profile-tab-btn ${activeTab === 'history' ? 'active' : ''}" data-tab="history">Activity History</button>
            </div>

            <!-- Tab Panels -->
            
            <!-- OVERVIEW PANEL -->
            <div class="profile-tab-panel ${activeTab === 'overview' ? 'active' : ''}">
              <h3 style="font-size:16px; margin-bottom:16px;">Administrative Shift Availability</h3>
              <div class="meta-detail-grid" style="margin-bottom:24px;">
                <div class="meta-detail-item">
                  <span class="meta-detail-label">Shift Hours</span>
                  <span class="meta-detail-value">${doctor.shiftStart || '09:00 AM'} - ${doctor.shiftEnd || '05:00 PM'}</span>
                </div>
                <div class="meta-detail-item">
                  <span class="meta-detail-label">Years of Experience</span>
                  <span class="meta-detail-value">${doctor.experience || 5} years</span>
                </div>
                <div class="meta-detail-item" style="grid-column: span 2;">
                  <span class="meta-detail-label">Working Scheduled Days</span>
                  <span class="meta-detail-value" style="display:flex; gap:6px; flex-wrap:wrap; margin-top:4px;">
                    ${(doctor.workingDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]).map(day => `
                      <span class="badge badge-teal" style="font-size:10px;">${day}</span>
                    `).join('')}
                  </span>
                </div>
              </div>

              <h3 style="font-size:16px; margin-bottom:16px;">Operational Metrics</h3>
              <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:16px; text-align:center;">
                <div style="background:rgba(255,255,255,0.02); padding:14px; border-radius:8px; border:1px solid var(--border-color);">
                  <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Active Cases</div>
                  <strong style="font-size:22px; display:block; margin-top:6px; color:var(--color-primary);">${assignedPatients.length}</strong>
                </div>
                <div style="background:rgba(255,255,255,0.02); padding:14px; border-radius:8px; border:1px solid var(--border-color);">
                  <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Today's Consults</div>
                  <strong style="font-size:22px; display:block; margin-top:6px; color:var(--color-secondary);">${upcomingAppts.length}</strong>
                </div>
                <div style="background:rgba(255,255,255,0.02); padding:14px; border-radius:8px; border:1px solid var(--border-color);">
                  <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Completed Cases</div>
                  <strong style="font-size:22px; display:block; margin-top:6px; color:var(--color-success);">${doctorAppts.filter(a => a.status === 'Completed').length}</strong>
                </div>
              </div>
            </div>

            <!-- SCHEDULE PANEL -->
            <div class="profile-tab-panel ${activeTab === 'schedule' ? 'active' : ''}">
              <h3 style="font-size:16px; margin-bottom:12px;">Coordinated Consultation Log</h3>
              <div class="table-wrapper">
                <table class="custom-table" style="font-size:12px;">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Patient File</th>
                      <th>Notes / Purpose</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${upcomingAppts.length === 0 ? `<tr><td colspan="4" class="text-muted" style="text-align:center;">No active upcoming reviews booked today.</td></tr>` : ''}
                    ${upcomingAppts.map(apt => `
                      <tr>
                        <td><strong>${apt.time}</strong></td>
                        <td><strong>${apt.patientName}</strong></td>
                        <td class="text-secondary">${apt.notes}</td>
                        <td><span class="badge badge-teal">${apt.status}</span></td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- ASSIGNED PATIENTS PANEL -->
            <div class="profile-tab-panel ${activeTab === 'patients' ? 'active' : ''}">
              <h3 style="font-size:16px; margin-bottom:12px;">Unique Active Clinical Files</h3>
              <div class="table-wrapper">
                <table class="custom-table" style="font-size:12px;">
                  <thead>
                    <tr>
                      <th>Patient ID</th>
                      <th>Patient Name</th>
                      <th>Age / Gender</th>
                      <th>Continuity Score</th>
                      <th>Risk Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${assignedPatients.length === 0 ? `<tr><td colspan="5" class="text-muted" style="text-align:center;">No patients assigned to this doctor.</td></tr>` : ''}
                    ${assignedPatients.map(p => {
                      let rBadge = "badge-green";
                      if (p.riskLevel === "High") rBadge = "badge-red";
                      else if (p.riskLevel === "Medium") rBadge = "badge-orange";
                      
                      return `
                        <tr>
                          <td><code>${p.id}</code></td>
                          <td><strong>${p.name}</strong></td>
                          <td>${p.age} yrs / ${p.gender}</td>
                          <td><strong style="color:var(--color-primary);">${p.continuityScore}%</strong></td>
                          <td><span class="badge ${rBadge}">${p.riskLevel}</span></td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- ACTIVITY HISTORY PANEL -->
            <div class="profile-tab-panel ${activeTab === 'history' ? 'active' : ''}">
              <h3 style="font-size:16px; margin-bottom:12px;">Administrative Activity Ledger</h3>
              <div class="table-wrapper">
                <table class="custom-table" style="font-size:11px;">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Security User</th>
                      <th>Action</th>
                      <th>Operational Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${doctorLogs.length === 0 ? `<tr><td colspan="4" class="text-muted" style="text-align:center;">No activity trails recorded for this physician ID.</td></tr>` : ''}
                    ${doctorLogs.slice(0, 10).map(log => `
                      <tr>
                        <td><code>${log.timestamp}</code></td>
                        <td><strong>${log.actor}</strong> <span class="badge badge-teal" style="font-size:8px; padding:2px 4px;">${log.role}</span></td>
                        <td><strong>${log.action}</strong></td>
                        <td class="text-secondary">${log.details}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
    this.attachListeners(container, state, actions);
  },

  attachListeners(container, state, actions) {
    const backBtn = container.querySelector("#btn-back-to-doctors");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        this.viewState.selectedDoctorId = null;
        this.render(container, state, actions);
      });
    }

    const tabBtns = container.querySelectorAll(".profile-tab-btn");
    tabBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const tab = e.target.getAttribute("data-tab");
        this.viewState.profileTab = tab;
        this.render(container, state, actions);
      });
    });

    const openAddBtn = container.querySelector("#btn-open-add-doctor-modal");
    if (openAddBtn) {
      openAddBtn.addEventListener("click", () => {
        this.viewState.modalOpen = true;
        this.render(container, state, actions);
      });
    }

    const closeBtn = container.querySelector("#btn-close-doctor-modal");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        this.viewState.modalOpen = false;
        this.render(container, state, actions);
      });
    }

    const cancelBtn = container.querySelector("#btn-cancel-doctor-modal");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        this.viewState.modalOpen = false;
        this.render(container, state, actions);
      });
    }

    const profileBtns = container.querySelectorAll(".btn-doc-profile");
    profileBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        this.viewState.selectedDoctorId = id;
        this.viewState.profileTab = "overview";
        this.render(container, state, actions);
      });
    });

    const filterDept = container.querySelector("#filter-doctor-dept");
    if (filterDept) {
      filterDept.addEventListener("change", (e) => {
        this.viewState.filterDept = e.target.value;
        this.render(container, state, actions);
      });
    }

    const filterStatus = container.querySelector("#filter-doctor-status");
    if (filterStatus) {
      filterStatus.addEventListener("change", (e) => {
        this.viewState.filterStatus = e.target.value;
        this.render(container, state, actions);
      });
    }

    const sortDoctor = container.querySelector("#sort-doctor");
    if (sortDoctor) {
      sortDoctor.addEventListener("change", (e) => {
        this.viewState.sortBy = e.target.value;
        this.render(container, state, actions);
      });
    }

    const searchInput = container.querySelector("#doctor-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.viewState.searchQuery = e.target.value;
        this.render(container, state, actions);
        const refocused = container.querySelector("#doctor-search-input");
        if (refocused) {
          refocused.focus();
          refocused.setSelectionRange(refocused.value.length, refocused.value.length);
        }
      });
    }

    // Modal submit (Add Doctor)
    const doctorForm = container.querySelector("#doctor-registration-form");
    if (doctorForm) {
      doctorForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = container.querySelector("#form-d-name").value.trim();
        const specialty = container.querySelector("#form-d-specialty").value.trim();
        const department = container.querySelector("#form-d-dept").value;
        const experience = parseInt(container.querySelector("#form-d-exp").value);
        const qualification = container.querySelector("#form-d-qual").value.trim();
        const consultationFee = parseFloat(container.querySelector("#form-d-fee").value);
        const shiftStart = container.querySelector("#form-d-start").value.trim();
        const shiftEnd = container.querySelector("#form-d-end").value.trim();
        const status = container.querySelector("#form-d-status").value;

        // Collect checked working days
        const checkedBoxes = container.querySelectorAll("input[name='workdays']:checked");
        const workingDays = Array.from(checkedBoxes).map(cb => cb.value);

        if (workingDays.length === 0) {
          alert("Error: Please select at least one working day.");
          return;
        }

        const newId = "doc-" + Math.floor(Math.random() * 10000);
        
        // Construct doctor profile
        const newDoctor = {
          id: newId,
          name,
          department,
          specialty,
          status,
          occupancy: 70, // Default initialized occupancy
          phone: "+1 (555) 010-" + Math.floor(1000 + Math.random() * 9000),
          experience,
          qualification,
          consultationFee,
          shiftStart,
          shiftEnd,
          workingDays
        };

        // Create Schedule Availability slots (e.g. standard slots inside shift start/end)
        import("../data.js").then(({ db }) => {
          const availRecords = db.getAvailabilityRecords();
          
          // Generate 4 default slots based on shift hours
          const generatedSlots = ["09:00 AM", "10:30 AM", "01:30 PM", "03:00 PM"];
          availRecords.push({ docId: newId, slots: generatedSlots });
          db.saveAvailabilityRecords(availRecords);

          actions.addDoctor(newDoctor);
          actions.addAuditLog("Doctor Added", `Doctor ${name}`, `Registered new physician credential and schedule ledger for ID: ${newId}`);
          actions.addNotification("Doctor Roster Updated", `Added ${name} to the active clinical staff.`);

          // Close modal and refresh
          this.viewState.modalOpen = false;
          this.render(container, state, actions);
        });
      });
    }
  }
};
