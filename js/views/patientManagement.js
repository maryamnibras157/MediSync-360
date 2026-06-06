// MediSync 360 - Patient Management Module

export const patientManagementView = {
  viewState: {
    selectedPatientId: null, // If set, show profile page instead of roster
    filterDept: "all",
    filterRisk: "all",
    searchQuery: "",
    sortBy: "name",
    modalOpen: null, // "add" or "edit"
    editingPatientId: null
  },

  render(container, state, actions) {
    // Check if we are viewing a specific patient profile
    if (this.viewState.selectedPatientId) {
      this.renderProfile(container, state, actions);
      return;
    }

    // Filter active (non-archived) patients
    let patients = state.patients.filter(p => !p.archived);

    // Search query
    if (this.viewState.searchQuery) {
      const q = this.viewState.searchQuery.toLowerCase();
      patients = patients.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.id.toLowerCase().includes(q) ||
        (p.phone && p.phone.includes(q))
      );
    }

    // Department filter
    if (this.viewState.filterDept !== "all") {
      patients = patients.filter(p => p.department === this.viewState.filterDept);
    }

    // Risk level filter
    if (this.viewState.filterRisk !== "all") {
      patients = patients.filter(p => p.riskLevel === this.viewState.filterRisk);
    }

    // Sorting
    patients.sort((a, b) => {
      if (this.viewState.sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (this.viewState.sortBy === "age") {
        return a.age - b.age;
      } else if (this.viewState.sortBy === "score") {
        return b.continuityScore - a.continuityScore;
      } else if (this.viewState.sortBy === "risk") {
        const riskWeight = { "High": 3, "Medium": 2, "Low": 1 };
        return riskWeight[b.riskLevel] - riskWeight[a.riskLevel];
      }
      return 0;
    });

    let html = `
      <div class="page-fade-in">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 4px;">
          <h2 class="page-heading">Patient Registry & Management</h2>
          <button class="btn btn-primary btn-sm" id="btn-open-add-patient-modal">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
            Add New Patient
          </button>
        </div>
        <p class="page-subheading">Monitor hospital admissions, archive records, and run diagnostics directories.</p>

        <!-- Filters Bar -->
        <div class="filter-bar">
          <div class="filter-group">
            <select id="filter-patient-dept" class="role-select" style="width:160px; padding: 6px 10px; font-size:12px;">
              <option value="all" ${this.viewState.filterDept === 'all' ? 'selected' : ''}>All Departments</option>
              <option value="Cardiology" ${this.viewState.filterDept === 'Cardiology' ? 'selected' : ''}>Cardiology</option>
              <option value="Internal Medicine" ${this.viewState.filterDept === 'Internal Medicine' ? 'selected' : ''}>Internal Medicine</option>
              <option value="Neurology" ${this.viewState.filterDept === 'Neurology' ? 'selected' : ''}>Neurology</option>
              <option value="General Surgery" ${this.viewState.filterDept === 'General Surgery' ? 'selected' : ''}>General Surgery</option>
              <option value="Nephrology" ${this.viewState.filterDept === 'Nephrology' ? 'selected' : ''}>Nephrology</option>
            </select>

            <select id="filter-patient-risk" class="role-select" style="width:140px; padding: 6px 10px; font-size:12px;">
              <option value="all" ${this.viewState.filterRisk === 'all' ? 'selected' : ''}>All Risk Levels</option>
              <option value="Low" ${this.viewState.filterRisk === 'Low' ? 'selected' : ''}>Low Risk</option>
              <option value="Medium" ${this.viewState.filterRisk === 'Medium' ? 'selected' : ''}>Medium Risk</option>
              <option value="High" ${this.viewState.filterRisk === 'High' ? 'selected' : ''}>High Risk</option>
            </select>

            <select id="sort-patient" class="role-select" style="width:140px; padding: 6px 10px; font-size:12px;">
              <option value="name" ${this.viewState.sortBy === 'name' ? 'selected' : ''}>Sort by Name</option>
              <option value="age" ${this.viewState.sortBy === 'age' ? 'selected' : ''}>Sort by Age</option>
              <option value="score" ${this.viewState.sortBy === 'score' ? 'selected' : ''}>Sort by Score</option>
              <option value="risk" ${this.viewState.sortBy === 'risk' ? 'selected' : ''}>Sort by Risk</option>
            </select>
          </div>

          <div class="header-search" style="width: 250px; padding: 6px 12px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" id="patient-search-input" value="${this.viewState.searchQuery}" placeholder="Search ID, Name, Contact..." style="font-size: 12px; margin-left: 6px;">
          </div>
        </div>

        <!-- Patients Ledger -->
        <div class="card">
          <div class="table-wrapper">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Name</th>
                  <th>Age / Gender</th>
                  <th>Contact Number</th>
                  <th>Department</th>
                  <th>Continuity Score</th>
                  <th>Risk Level</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${patients.length === 0 ? `
                  <tr>
                    <td colspan="8" class="text-muted" style="text-align:center; padding: 40px 0;">
                      No patients found matching the selected criteria.
                    </td>
                  </tr>
                ` : patients.map(p => {
                  let riskBadge = "badge-green";
                  if (p.riskLevel === "High") riskBadge = "badge-red";
                  else if (p.riskLevel === "Medium") riskBadge = "badge-orange";
                  
                  return `
                    <tr>
                      <td><code>${p.id}</code></td>
                      <td><strong>${p.name}</strong></td>
                      <td>${p.age} yrs / ${p.gender}</td>
                      <td>${p.phone || 'N/A'}</td>
                      <td><span class="badge badge-teal">${p.department || 'Cardiology'}</span></td>
                      <td>
                        <strong style="font-size:14px; color:${p.continuityScore > 75 ? 'var(--color-success)' : p.continuityScore > 50 ? 'var(--color-warning)' : 'var(--color-danger)'}">${p.continuityScore}%</strong>
                      </td>
                      <td><span class="badge ${riskBadge}">${p.riskLevel}</span></td>
                      <td>
                        <div style="display:flex; gap:6px;">
                          <button class="btn btn-secondary btn-sm btn-pat-profile" data-id="${p.id}" style="padding:4px 8px;">View Profile</button>
                          <button class="btn btn-secondary btn-sm btn-pat-edit" data-id="${p.id}" style="padding:4px 8px;">Edit</button>
                          <button class="btn btn-danger btn-sm btn-pat-archive" data-id="${p.id}" style="padding:4px 8px;">Archive</button>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Add/Edit Patient Overlay Modal -->
      ${this.renderModal(state)}
    `;

    container.innerHTML = html;
    this.attachListeners(container, state, actions);
  },

  renderModal(state) {
    if (!this.viewState.modalOpen) return '';

    const isEdit = this.viewState.modalOpen === "edit";
    let p = {
      name: "", dob: "", gender: "Male", bloodGroup: "O+", phone: "", email: "", address: "",
      allergies: "", chronicConditions: "", currentMedications: "",
      caregiverName: "", caregiverRelation: "", caregiverPhone: ""
    };

    if (isEdit && this.viewState.editingPatientId) {
      const existing = state.patients.find(pt => pt.id === this.viewState.editingPatientId);
      if (existing) {
        p = {
          name: existing.name || "",
          dob: existing.dob || "",
          gender: existing.gender || "Male",
          bloodGroup: existing.bloodGroup || "O+",
          phone: existing.phone || "",
          email: existing.email || "",
          address: existing.address || "",
          allergies: existing.allergies || "",
          chronicConditions: existing.condition || "",
          currentMedications: existing.currentMedications || "",
          caregiverName: existing.caregiver ? existing.caregiver.name : "",
          caregiverRelation: existing.caregiver ? existing.caregiver.relation : "",
          caregiverPhone: existing.caregiver ? existing.caregiver.phone : ""
        };
      }
    }

    return `
      <div class="modal-overlay open" id="patient-modal-overlay">
        <div class="modal-container">
          <div class="modal-header">
            <h3>${isEdit ? "Edit Patient Details" : "Register New Patient Record"}</h3>
            <button class="modal-close" id="btn-close-patient-modal">&times;</button>
          </div>
          <form id="patient-registration-form">
            
            <div class="form-section-title">Personal Information</div>
            <div class="form-row">
              <div class="form-group">
                <label for="form-p-name">Full Name *</label>
                <input type="text" class="form-control" id="form-p-name" value="${p.name}" placeholder="e.g. Sarah Jenkins" required>
              </div>
              <div class="form-group">
                <label for="form-p-dob">Date of Birth *</label>
                <input type="date" class="form-control" id="form-p-dob" value="${p.dob}" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="form-p-gender">Gender *</label>
                <select class="form-control" id="form-p-gender" required>
                  <option value="Male" ${p.gender === 'Male' ? 'selected' : ''}>Male</option>
                  <option value="Female" ${p.gender === 'Female' ? 'selected' : ''}>Female</option>
                  <option value="Other" ${p.gender === 'Other' ? 'selected' : ''}>Other</option>
                </select>
              </div>
              <div class="form-group">
                <label for="form-p-blood">Blood Group *</label>
                <select class="form-control" id="form-p-blood" required>
                  <option value="A+" ${p.bloodGroup === 'A+' ? 'selected' : ''}>A+</option>
                  <option value="A-" ${p.bloodGroup === 'A-' ? 'selected' : ''}>A-</option>
                  <option value="B+" ${p.bloodGroup === 'B+' ? 'selected' : ''}>B+</option>
                  <option value="B-" ${p.bloodGroup === 'B-' ? 'selected' : ''}>B-</option>
                  <option value="AB+" ${p.bloodGroup === 'AB+' ? 'selected' : ''}>AB+</option>
                  <option value="AB-" ${p.bloodGroup === 'AB-' ? 'selected' : ''}>AB-</option>
                  <option value="O+" ${p.bloodGroup === 'O+' ? 'selected' : ''}>O+</option>
                  <option value="O-" ${p.bloodGroup === 'O-' ? 'selected' : ''}>O-</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="form-p-phone">Mobile Number *</label>
                <input type="tel" class="form-control" id="form-p-phone" value="${p.phone}" placeholder="e.g. +1 (555) 019-9988" required>
              </div>
              <div class="form-group">
                <label for="form-p-email">Email Address *</label>
                <input type="email" class="form-control" id="form-p-email" value="${p.email}" placeholder="e.g. patient@email.com" required>
              </div>
            </div>
            <div class="form-group">
              <label for="form-p-address">Residential Address</label>
              <input type="text" class="form-control" id="form-p-address" value="${p.address}" placeholder="Street, Apt #, City, State">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="form-p-dept">Primary Department *</label>
                <select class="form-control" id="form-p-dept" required>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Internal Medicine">Internal Medicine</option>
                  <option value="Neurology">Neurology</option>
                  <option value="General Surgery">General Surgery</option>
                  <option value="Nephrology">Nephrology</option>
                </select>
              </div>
            </div>

            <div class="form-section-title">Medical Information</div>
            <div class="form-group">
              <label for="form-p-allergies">Allergies</label>
              <input type="text" class="form-control" id="form-p-allergies" value="${p.allergies}" placeholder="e.g. Penicillin, Peanuts (N/A if none)">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="form-p-chronic">Chronic Conditions</label>
                <input type="text" class="form-control" id="form-p-chronic" value="${p.chronicConditions}" placeholder="e.g. Asthma, Hypertension">
              </div>
              <div class="form-group">
                <label for="form-p-meds">Current Medications</label>
                <input type="text" class="form-control" id="form-p-meds" value="${p.currentMedications}" placeholder="e.g. Metformin 500mg BID">
              </div>
            </div>

            <div class="form-section-title">Emergency Contact Details</div>
            <div class="form-row">
              <div class="form-group">
                <label for="form-p-cname">Emergency Contact Name</label>
                <input type="text" class="form-control" id="form-p-cname" value="${p.caregiverName}" placeholder="e.g. Jane Jenkins">
              </div>
              <div class="form-group">
                <label for="form-p-crel">Relationship</label>
                <input type="text" class="form-control" id="form-p-crel" value="${p.caregiverRelation}" placeholder="e.g. Spouse, Parent, Child">
              </div>
            </div>
            <div class="form-group">
              <label for="form-p-cphone">Emergency Contact Number</label>
              <input type="tel" class="form-control" id="form-p-cphone" value="${p.caregiverPhone}" placeholder="e.g. +1 (555) 019-9900">
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary btn-sm" id="btn-cancel-patient-modal">Cancel</button>
              <button type="submit" class="btn btn-primary btn-sm">${isEdit ? "Save Changes" : "Register Patient"}</button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  renderProfile(container, state, actions) {
    const patient = state.patients.find(p => p.id === this.viewState.selectedPatientId);
    if (!patient) {
      this.viewState.selectedPatientId = null;
      this.render(container, state, actions);
      return;
    }

    const activeTab = this.viewState.profileTab || "overview";
    const patientAppts = state.appointments.filter(a => a.patientId === patient.id);
    const upcomingAppts = patientAppts.filter(a => a.status === "Scheduled" || a.status === "Checked-In" || a.status === "Consulting");
    const previousAppts = patientAppts.filter(a => a.status === "Completed" || a.status === "Cancelled");
    
    // Audit logs for patient
    const patientLogs = state.auditLogs.filter(log => 
      log.target.includes(patient.name) || log.details.includes(patient.name) || log.details.includes(patient.id)
    );

    let html = `
      <div class="page-fade-in">
        <div style="margin-bottom:20px; display:flex; gap:12px; align-items:center;">
          <button class="btn btn-secondary btn-sm" id="btn-back-to-registry">
            &larr; Back to Registry
          </button>
          <h2 class="page-heading" style="margin-bottom:0;">Patient Clinical Profile File</h2>
        </div>

        <div class="profile-layout">
          <!-- Left Sidebar Details -->
          <div style="display:flex; flex-direction:column; gap:20px;">
            <div class="card profile-sidebar-card">
              <div class="patient-avatar" style="width:80px; height:80px; font-size:32px; margin-bottom:12px;">
                ${patient.name[0]}
              </div>
              <h3 style="font-size:18px; font-weight:700;">${patient.name}</h3>
              <p class="text-muted" style="font-size:12px;">ID: <code>${patient.id}</code></p>
              <span class="badge badge-teal" style="margin-top:6px; font-size:11px;">${patient.department || 'Cardiology'}</span>
              
              <div style="width:100%; border-top:1px solid var(--border-color); margin-top:20px; padding-top:20px; text-align:left; display:flex; flex-direction:column; gap:12px; font-size:12px;">
                <div class="meta-detail-item">
                  <span class="meta-detail-label">Status Risk Level</span>
                  <span class="badge ${patient.riskLevel === 'High' ? 'badge-red' : patient.riskLevel === 'Medium' ? 'badge-orange' : 'badge-green'}" style="width:fit-content; margin-top:2px;">
                    ${patient.riskLevel} Risk
                  </span>
                </div>
                <div class="meta-detail-item">
                  <span class="meta-detail-label">Blood Group</span>
                  <span class="meta-detail-value">${patient.bloodGroup || 'O+'}</span>
                </div>
                <div class="meta-detail-item">
                  <span class="meta-detail-label">Allergies</span>
                  <span class="meta-detail-value" style="color:var(--color-danger);">${patient.allergies || 'None Reported'}</span>
                </div>
              </div>
            </div>

            <!-- Radial Progress Continuity -->
            <div class="card" style="text-align:center;">
              <h4 class="card-title" style="justify-content:center;">Continuity Rating</h4>
              <div class="radial-progress-container">
                <div class="radial-progress" style="width:120px; height:120px;">
                  <svg style="transform: rotate(-90deg); width:120px; height:120px;">
                    <circle class="radial-bg" cx="60" cy="60" r="50" stroke-width="8" />
                    <circle class="radial-fill" cx="60" cy="60" r="50" stroke-width="8" style="stroke-dasharray: 314; stroke-dashoffset: ${314 - (314 * patient.continuityScore) / 100}" />
                  </svg>
                  <div class="radial-text">
                    <span class="radial-score" style="font-size:24px;">${patient.continuityScore}</span>
                    <span class="radial-label" style="font-size:8px;">Continuity</span>
                  </div>
                </div>
              </div>
              <p class="text-muted" style="font-size:11px; margin-top:10px;">Proprietary engagement factor.</p>
            </div>
          </div>

          <!-- Right Content Area -->
          <div class="card">
            <!-- Tabs Menu -->
            <div class="profile-tab-menu">
              <button class="profile-tab-btn ${activeTab === 'overview' ? 'active' : ''}" data-tab="overview">Overview</button>
              <button class="profile-tab-btn ${activeTab === 'vault' ? 'active' : ''}" data-tab="vault">Medical Memory Vault</button>
              <button class="profile-tab-btn ${activeTab === 'appointments' ? 'active' : ''}" data-tab="appointments">Appointments</button>
              <button class="profile-tab-btn ${activeTab === 'risk' ? 'active' : ''}" data-tab="risk">Follow-Up Risk</button>
              <button class="profile-tab-btn ${activeTab === 'caregiver' ? 'active' : ''}" data-tab="caregiver">Family & Caregiver</button>
              <button class="profile-tab-btn ${activeTab === 'audit' ? 'active' : ''}" data-tab="audit">Audit History</button>
            </div>

            <!-- Tab Panels -->
            
            <!-- OVERVIEW PANEL -->
            <div class="profile-tab-panel ${activeTab === 'overview' ? 'active' : ''}">
              <h3 style="font-size:16px; margin-bottom:16px;">General Profile Record</h3>
              <div class="meta-detail-grid" style="margin-bottom:24px;">
                <div class="meta-detail-item">
                  <span class="meta-detail-label">Full Name</span>
                  <span class="meta-detail-value">${patient.name}</span>
                </div>
                <div class="meta-detail-item">
                  <span class="meta-detail-label">Date of Birth</span>
                  <span class="meta-detail-value">${patient.dob || 'N/A'}</span>
                </div>
                <div class="meta-detail-item">
                  <span class="meta-detail-label">Age / Gender</span>
                  <span class="meta-detail-value">${patient.age} years / ${patient.gender}</span>
                </div>
                <div class="meta-detail-item">
                  <span class="meta-detail-label">Mobile Number</span>
                  <span class="meta-detail-value">${patient.phone || 'N/A'}</span>
                </div>
                <div class="meta-detail-item">
                  <span class="meta-detail-label">Email Address</span>
                  <span class="meta-detail-value">${patient.email || 'N/A'}</span>
                </div>
                <div class="meta-detail-item">
                  <span class="meta-detail-label">Address</span>
                  <span class="meta-detail-value">${patient.address || 'N/A'}</span>
                </div>
              </div>

              <h3 style="font-size:16px; margin-bottom:16px;">Vitals Baseline</h3>
              <div style="display:grid; grid-template-columns: repeat(5, 1fr); gap:12px; text-align:center;">
                <div style="background:rgba(255,255,255,0.02); padding:10px; border-radius:6px; border:1px solid var(--border-color);">
                  <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase;">BP</div>
                  <strong style="font-size:14px; display:block; margin-top:4px;">${patient.vitals.bp}</strong>
                </div>
                <div style="background:rgba(255,255,255,0.02); padding:10px; border-radius:6px; border:1px solid var(--border-color);">
                  <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase;">HR</div>
                  <strong style="font-size:14px; display:block; margin-top:4px;">${patient.vitals.hr}</strong>
                </div>
                <div style="background:rgba(255,255,255,0.02); padding:10px; border-radius:6px; border:1px solid var(--border-color);">
                  <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase;">Temp</div>
                  <strong style="font-size:14px; display:block; margin-top:4px;">${patient.vitals.temp}</strong>
                </div>
                <div style="background:rgba(255,255,255,0.02); padding:10px; border-radius:6px; border:1px solid var(--border-color);">
                  <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase;">RR</div>
                  <strong style="font-size:14px; display:block; margin-top:4px;">${patient.vitals.rr}</strong>
                </div>
                <div style="background:rgba(255,255,255,0.02); padding:10px; border-radius:6px; border:1px solid var(--border-color);">
                  <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase;">Weight</div>
                  <strong style="font-size:14px; display:block; margin-top:4px;">${patient.vitals.weight}</strong>
                </div>
              </div>
            </div>

            <!-- MEMORY VAULT PANEL -->
            <div class="profile-tab-panel ${activeTab === 'vault' ? 'active' : ''}">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                <h3 style="font-size:16px; margin:0;">Chronological Clinical Timeline</h3>
                <button class="btn btn-secondary btn-sm" id="btn-profile-jump-vault">Complete Clinical Vault Panel &rarr;</button>
              </div>
              
              <div class="timeline" style="padding-left:28px; max-height: 380px; overflow-y:auto;">
                ${patient.history.length === 0 ? `
                  <p class="text-muted" style="text-align:center; padding: 30px 0;">No diagnostic or prescription logs recorded yet.</p>
                ` : patient.history.map(h => {
                  let badge = "badge-teal";
                  if (h.type === "prescriptions") badge = "badge-orange";
                  else if (h.type === "labs") badge = "badge-blue";
                  else if (h.type === "vitals") badge = "badge-green";
                  else if (h.type === "diagnoses") badge = "badge-red";
                  
                  return `
                    <div class="timeline-item" style="margin-bottom:16px;">
                      <div class="timeline-dot ${h.type}" style="left:-25px; width:18px; height:18px; font-size:9px;">
                        ${h.type === 'prescriptions' ? 'P' : h.type === 'labs' ? 'L' : h.type === 'vitals' ? 'V' : 'D'}
                      </div>
                      <div class="timeline-content" style="padding:12px 14px;">
                        <div class="timeline-header" style="margin-bottom:6px;">
                          <div>
                            <span class="badge ${badge}" style="font-size:8px; padding:2px 4px; text-transform:uppercase;">${h.type}</span>
                            <div style="font-size:13px; font-weight:600; margin-top:2px;">${h.title}</div>
                          </div>
                          <span style="font-size:10px;" class="text-muted">${h.date}</span>
                        </div>
                        <p style="font-size:11.5px; color:var(--text-secondary); line-height:1.4;">${h.body}</p>
                        <div style="margin-top:6px; font-size:10px; color:var(--text-muted);">Recorded by: ${h.doc}</div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- APPOINTMENTS PANEL -->
            <div class="profile-tab-panel ${activeTab === 'appointments' ? 'active' : ''}">
              <h3 style="font-size:16px; margin-bottom:12px;">Upcoming Scheduled Reviews</h3>
              <div class="table-wrapper" style="margin-bottom:24px;">
                <table class="custom-table" style="font-size:12px;">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Physician</th>
                      <th>Reason</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${upcomingAppts.length === 0 ? `<tr><td colspan="5" class="text-muted" style="text-align:center;">No upcoming appointments scheduled.</td></tr>` : ''}
                    ${upcomingAppts.map(apt => `
                      <tr>
                        <td><strong>${apt.date}</strong></td>
                        <td>${apt.time}</td>
                        <td>${apt.doctorName}</td>
                        <td class="text-secondary">${apt.notes}</td>
                        <td><span class="badge badge-blue">${apt.status}</span></td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>

              <h3 style="font-size:16px; margin-bottom:12px;">Previous Operational History</h3>
              <div class="table-wrapper">
                <table class="custom-table" style="font-size:12px;">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Physician</th>
                      <th>Reason</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${previousAppts.length === 0 ? `<tr><td colspan="4" class="text-muted" style="text-align:center;">No past appointment logs.</td></tr>` : ''}
                    ${previousAppts.map(apt => `
                      <tr>
                        <td>${apt.date}</td>
                        <td>${apt.doctorName}</td>
                        <td class="text-secondary">${apt.notes}</td>
                        <td><span class="badge ${apt.status === 'Completed' ? 'badge-green' : 'badge-red'}">${apt.status}</span></td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- RISK TRACKER PANEL -->
            <div class="profile-tab-panel ${activeTab === 'risk' ? 'active' : ''}">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                <h3 style="font-size:16px; margin:0;">Adherence Relapse Warnings</h3>
                <span class="badge ${patient.riskLevel === 'High' ? 'badge-red' : patient.riskLevel === 'Medium' ? 'badge-orange' : 'badge-green'}">
                  ${patient.riskLevel} Risk
                </span>
              </div>
              
              <div style="background:rgba(255,255,255,0.01); border:1px solid var(--border-color); border-radius:8px; padding:16px; margin-bottom:20px;">
                <h4 style="font-size:13px; font-weight:600; color:var(--text-secondary); margin-bottom:12px;">Warning Flags Identified:</h4>
                <ul class="risk-factor-list" style="margin-top:0; padding-left: 10px;">
                  ${patient.riskFactors.length === 0 ? `
                    <li style="color:var(--color-success); font-size:12px;">✓ Patient currently meets all target parameters. Compliance clean.</li>
                  ` : patient.riskFactors.map(factor => `
                    <li class="risk-factor-item">${factor}</li>
                  `).join('')}
                </ul>
              </div>

              <h4 style="font-size:13px; font-weight:600; margin-bottom:8px;">Compliance Pillars breakdown:</h4>
              <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:12px; font-size:12px; margin-bottom:20px;">
                <div>
                  <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                    <span>Intake Attendance</span> <strong>${patient.metrics.attendance}%</strong>
                  </div>
                  <div style="background:rgba(255,255,255,0.05); height:4px; border-radius:2px; overflow:hidden;">
                    <div style="background:var(--color-primary); width:${patient.metrics.attendance}%; height:100%;"></div>
                  </div>
                </div>
                <div>
                  <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                    <span>Medication Compliance</span> <strong>${patient.metrics.medication}%</strong>
                  </div>
                  <div style="background:rgba(255,255,255,0.05); height:4px; border-radius:2px; overflow:hidden;">
                    <div style="background:var(--color-secondary); width:${patient.metrics.medication}%; height:100%;"></div>
                  </div>
                </div>
                <div>
                  <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                    <span>Follow-Up Checkups</span> <strong>${patient.metrics.followups}%</strong>
                  </div>
                  <div style="background:rgba(255,255,255,0.05); height:4px; border-radius:2px; overflow:hidden;">
                    <div style="background:var(--color-success); width:${patient.metrics.followups}%; height:100%;"></div>
                  </div>
                </div>
                <div>
                  <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                    <span>Report Logs submitted</span> <strong>${patient.metrics.reports}%</strong>
                  </div>
                  <div style="background:rgba(255,255,255,0.05); height:4px; border-radius:2px; overflow:hidden;">
                    <div style="background:var(--color-warning); width:${patient.metrics.reports}%; height:100%;"></div>
                  </div>
                </div>
              </div>

              <button class="btn btn-secondary btn-sm" id="btn-profile-jump-risk">Launch Compliance outreach center &rarr;</button>
            </div>

            <!-- FAMILY HUB PANEL -->
            <div class="profile-tab-panel ${activeTab === 'caregiver' ? 'active' : ''}">
              <h3 style="font-size:16px; margin-bottom:16px;">Family Connections & Coordinated Caregivers</h3>
              ${patient.caregiver ? `
                <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-color); border-radius:8px; padding:16px; display:flex; flex-direction:column; gap:12px; font-size:13px;">
                  <div class="meta-detail-item">
                    <span class="meta-detail-label">Caregiver Name</span>
                    <span class="meta-detail-value">${patient.caregiver.name}</span>
                  </div>
                  <div class="meta-detail-item">
                    <span class="meta-detail-label">Relationship to Patient</span>
                    <span class="meta-detail-value">${patient.caregiver.relation}</span>
                  </div>
                  <div class="meta-detail-item">
                    <span class="meta-detail-label">Contact Mobile Number</span>
                    <span class="meta-detail-value">${patient.caregiver.phone}</span>
                  </div>
                </div>
                <button class="btn btn-secondary btn-sm" id="btn-profile-jump-family" style="margin-top:16px;">Family Caregiver Dashboard &rarr;</button>
              ` : `
                <div style="text-align:center; padding: 30px 0; color:var(--text-muted); border:1px dashed var(--border-color); border-radius:8px;">
                  <p style="font-size:13px; margin-bottom:12px;">No active family connection profiles are mapped to this patient file.</p>
                  <button class="btn btn-secondary btn-sm btn-pat-edit" data-id="${patient.id}">Link Caregiver Profile</button>
                </div>
              `}
            </div>

            <!-- AUDIT HISTORY PANEL -->
            <div class="profile-tab-panel ${activeTab === 'audit' ? 'active' : ''}">
              <h3 style="font-size:16px; margin-bottom:12px;">Patient File Access History Log</h3>
              <div class="table-wrapper">
                <table class="custom-table" style="font-size:11px;">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>User ID</th>
                      <th>Security Role</th>
                      <th>Action type</th>
                      <th>Audit Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${patientLogs.length === 0 ? `<tr><td colspan="5" class="text-muted" style="text-align:center;">No direct audit traces found for this file.</td></tr>` : ''}
                    ${patientLogs.slice(0, 10).map(log => `
                      <tr>
                        <td><code>${log.timestamp}</code></td>
                        <td><strong>${log.actor}</strong></td>
                        <td><span class="badge badge-teal" style="font-size:8px; padding:2px 4px;">${log.role}</span></td>
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
    // Return to directory list
    const backBtn = container.querySelector("#btn-back-to-registry");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        this.viewState.selectedPatientId = null;
        this.render(container, state, actions);
      });
    }

    // Tab buttons click inside Profile
    const tabBtns = container.querySelectorAll(".profile-tab-btn");
    tabBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const tab = e.target.getAttribute("data-tab");
        this.viewState.profileTab = tab;
        this.render(container, state, actions);
      });
    });

    // Profile page jumps
    const jumpVault = container.querySelector("#btn-profile-jump-vault");
    if (jumpVault) {
      jumpVault.addEventListener("click", () => {
        actions.navigate("MemoryVault");
      });
    }
    const jumpRisk = container.querySelector("#btn-profile-jump-risk");
    if (jumpRisk) {
      jumpRisk.addEventListener("click", () => {
        actions.navigate("RiskTracker");
      });
    }
    const jumpFamily = container.querySelector("#btn-profile-jump-family");
    if (jumpFamily) {
      jumpFamily.addEventListener("click", () => {
        actions.navigate("FamilyHub");
      });
    }

    // Open Add Patient modal
    const openAddBtn = container.querySelector("#btn-open-add-patient-modal");
    if (openAddBtn) {
      openAddBtn.addEventListener("click", () => {
        this.viewState.modalOpen = "add";
        this.render(container, state, actions);
      });
    }

    // Close Modal button
    const closeBtn = container.querySelector("#btn-close-patient-modal");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        this.viewState.modalOpen = null;
        this.viewState.editingPatientId = null;
        this.render(container, state, actions);
      });
    }

    const cancelBtn = container.querySelector("#btn-cancel-patient-modal");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        this.viewState.modalOpen = null;
        this.viewState.editingPatientId = null;
        this.render(container, state, actions);
      });
    }

    // View Profile trigger
    const profileBtns = container.querySelectorAll(".btn-pat-profile");
    profileBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        this.viewState.selectedPatientId = id;
        this.viewState.profileTab = "overview";
        actions.changePatient(id);
        this.render(container, state, actions);
      });
    });

    // Edit Patient trigger
    const editBtns = container.querySelectorAll(".btn-pat-edit");
    editBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        this.viewState.modalOpen = "edit";
        this.viewState.editingPatientId = id;
        this.render(container, state, actions);
      });
    });

    // Archive Patient (Soft delete) trigger
    const archiveBtns = container.querySelectorAll(".btn-pat-archive");
    archiveBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        const patient = state.patients.find(pt => pt.id === id);
        if (patient) {
          if (confirm(`Are you sure you want to soft-archive patient file for ${patient.name}?`)) {
            actions.archivePatient(id);
            actions.addAuditLog("Patient Archived", `Patient ${patient.name}`, `Soft-deleted patient registry index for ID: ${id}`);
            actions.addNotification("Patient File Archived", `Patient ${patient.name} soft-archived. Record remains for security.`);
            
            // If viewing this patient, reset selection
            if (this.viewState.selectedPatientId === id) {
              this.viewState.selectedPatientId = null;
            }
            
            this.render(container, state, actions);
          }
        }
      });
    });

    // Filters changes
    const filterDept = container.querySelector("#filter-patient-dept");
    if (filterDept) {
      filterDept.addEventListener("change", (e) => {
        this.viewState.filterDept = e.target.value;
        this.render(container, state, actions);
      });
    }

    const filterRisk = container.querySelector("#filter-patient-risk");
    if (filterRisk) {
      filterRisk.addEventListener("change", (e) => {
        this.viewState.filterRisk = e.target.value;
        this.render(container, state, actions);
      });
    }

    const sortPatient = container.querySelector("#sort-patient");
    if (sortPatient) {
      sortPatient.addEventListener("change", (e) => {
        this.viewState.sortBy = e.target.value;
        this.render(container, state, actions);
      });
    }

    // Roster search input
    const searchInput = container.querySelector("#patient-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.viewState.searchQuery = e.target.value;
        this.render(container, state, actions);
        const refocused = container.querySelector("#patient-search-input");
        if (refocused) {
          refocused.focus();
          refocused.setSelectionRange(refocused.value.length, refocused.value.length);
        }
      });
    }

    // Modal submit (Add/Edit Patient)
    const patientForm = container.querySelector("#patient-registration-form");
    if (patientForm) {
      patientForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = container.querySelector("#form-p-name").value.trim();
        const dob = container.querySelector("#form-p-dob").value;
        const gender = container.querySelector("#form-p-gender").value;
        const bloodGroup = container.querySelector("#form-p-blood").value;
        const phone = container.querySelector("#form-p-phone").value.trim();
        const email = container.querySelector("#form-p-email").value.trim().toLowerCase();
        const address = container.querySelector("#form-p-address").value.trim();
        const department = container.querySelector("#form-p-dept").value;
        const allergies = container.querySelector("#form-p-allergies").value.trim();
        const chronicConditions = container.querySelector("#form-p-chronic").value.trim();
        const currentMedications = container.querySelector("#form-p-meds").value.trim();
        const caregiverName = container.querySelector("#form-p-cname").value.trim();
        const caregiverRelation = container.querySelector("#form-p-crel").value.trim();
        const caregiverPhone = container.querySelector("#form-p-cphone").value.trim();

        // Calculate Age from dob
        let age = 30; // Default
        if (dob) {
          const dobDate = new Date(dob);
          const diff = Date.now() - dobDate.getTime();
          const ageDate = new Date(diff);
          age = Math.abs(ageDate.getUTCFullYear() - 1970);
        }

        // Email uniqueness duplicate check
        const isEdit = this.viewState.modalOpen === "edit";
        const duplicate = state.patients.find(pt => 
          pt.email.toLowerCase() === email && 
          (!isEdit || pt.id !== this.viewState.editingPatientId)
        );

        if (duplicate) {
          alert(`Conflict: A patient file with email ${email} is already registered.`);
          return;
        }

        const caregiverObj = caregiverName ? {
          name: caregiverName,
          relation: caregiverRelation,
          phone: caregiverPhone
        } : null;

        if (isEdit) {
          // Edit existing patient
          const patientId = this.viewState.editingPatientId;
          const patientObj = state.patients.find(pt => pt.id === patientId);
          if (patientObj) {
            patientObj.name = name;
            patientObj.dob = dob;
            patientObj.age = age;
            patientObj.gender = gender;
            patientObj.bloodGroup = bloodGroup;
            patientObj.phone = phone;
            patientObj.email = email;
            patientObj.address = address;
            patientObj.department = department;
            patientObj.condition = chronicConditions || patientObj.condition;
            patientObj.allergies = allergies;
            patientObj.currentMedications = currentMedications;
            patientObj.caregiver = caregiverObj;

            actions.updatePatient(patientObj);
            actions.addAuditLog("Patient Modified", `Patient ${name}`, `Updated clinical details and metrics logs for patient ID: ${patientId}`);
            actions.addNotification("Patient File Modified", `Patient details for ${name} saved successfully.`);
          }
        } else {
          // Add new patient (Automatic initialization)
          const newId = "pat-" + Math.floor(Math.random() * 10000);
          
          // Initial compliance ratings & risk profiles
          const continuityScore = 70;
          const metrics = { attendance: 70, medication: 70, followups: 70, reports: 70 };
          const riskFactors = [];
          const riskLevel = "Medium"; // score 70 maps to Medium

          const newPatient = {
            id: newId,
            name,
            dob,
            age,
            gender,
            bloodGroup,
            phone,
            email,
            address,
            department,
            condition: chronicConditions || "General Health Intake",
            allergies,
            currentMedications,
            vitals: { bp: "120/80", hr: 72, temp: "98.6°F", rr: 16, weight: "150 lbs" },
            continuityScore,
            metrics,
            riskLevel,
            riskFactors,
            caregiver: caregiverObj,
            history: [] // Empty Medical Memory Vault
          };

          actions.addPatient(newPatient);
          actions.addAuditLog("Patient Created", `Patient ${name}`, `Registered new patient record with ID: ${newId} assigned to ${department}`);
          actions.addNotification("New Patient Admitted", `Registered patient profile for ${name}. Continuity profile created.`);
        }

        // Close modal and refresh view
        this.viewState.modalOpen = null;
        this.viewState.editingPatientId = null;
        this.render(container, state, actions);
      });
    }
  }
};
