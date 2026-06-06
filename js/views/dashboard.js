// MediSync 360 - Dashboard Views (7-Role Specific)

export const dashboardView = {
  render(container, state, actions) {
    const role = state.currentRole;
    
    let html = `<div class="page-fade-in">`;
    
    // Page Header
    html += `
      <h2 class="page-heading">Command Center</h2>
      <p class="page-subheading">Welcome back, viewing portal as <strong>${role}</strong>.</p>
    `;

    // Render based on role
    switch (role) {
      case "Super Administrator":
        html += this.renderSuperAdmin(state, actions);
        break;
      case "Hospital Administrator":
        html += this.renderHospitalAdmin(state, actions);
        break;
      case "Doctor":
        html += this.renderDoctor(state, actions);
        break;
      case "Nurse":
        html += this.renderNurse(state, actions);
        break;
      case "Receptionist":
        html += this.renderReceptionist(state, actions);
        break;
      case "Patient":
        html += this.renderPatient(state, actions);
        break;
      case "Family Caregiver":
        html += this.renderFamilyCaregiver(state, actions);
        break;
      default:
        html += `<p>Error: Invalid role configuration.</p>`;
    }
    
    html += `</div>`;
    container.innerHTML = html;
    
    // Attach event listeners for dashboard interactive elements
    this.attachListeners(container, state, actions);
  },

  renderSuperAdmin(state, actions) {
    return `
      <!-- Stats Cards -->
      <div class="grid-container cols-4">
        <div class="card card-glow-teal">
          <div class="card-title">Hospital Networks <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M3 7v1a3 3 0 0 0 6 0V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3Z"/><path d="M19 21V10a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v11"/><path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"/><path d="M14 4h4a2 2 0 0 1 2 2v2a3 3 0 0 1-6 0V4Z"/></svg></div>
          <div class="card-value">12</div>
          <div class="card-desc"><span class="trend trend-up">↑ 100%</span> global uptime</div>
        </div>
        <div class="card card-glow-blue">
          <div class="card-title">Total Active Users <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
          <div class="card-value">4,892</div>
          <div class="card-desc"><span class="trend trend-up">↑ 8.4%</span> since last month</div>
        </div>
        <div class="card">
          <div class="card-title">System Load <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
          <div class="card-value">22%</div>
          <div class="card-desc">CPU and API load optimal</div>
        </div>
        <div class="card">
          <div class="card-title">Database Status <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></svg></div>
          <div class="card-value">Syncing</div>
          <div class="card-desc"><span class="badge badge-green">Healthy</span> 0 errors flagged</div>
        </div>
      </div>

      <div class="grid-container cols-3-1">
        <div class="card">
          <h3 class="card-title">Global Platform Security & Audit Trace</h3>
          <div class="table-wrapper" style="margin-top: 16px;">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Actor</th>
                  <th>Action</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                ${state.auditLogs.slice(0, 5).map(log => `
                  <tr>
                    <td>${log.timestamp}</td>
                    <td><strong>${log.actor}</strong> <span class="badge ${log.role === 'Doctor' ? 'badge-teal' : log.role === 'Receptionist' ? 'badge-blue' : 'badge-green'}">${log.role}</span></td>
                    <td>${log.action}</td>
                    <td class="text-muted">${log.details}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="card">
          <h3 class="card-title">Quick Settings</h3>
          <div style="margin-top: 20px; display: flex; flex-direction: column; gap: 12px;">
            <button class="btn btn-secondary btn-sm" id="btn-trigger-backup">Trigger Database Backup</button>
            <button class="btn btn-secondary btn-sm" id="btn-sync-hl7">Sync FHIR/HL7 Feeds</button>
            <button class="btn btn-secondary btn-sm" id="btn-clear-demo">Reset Demo Database</button>
          </div>
        </div>
      </div>
    `;
  },

  renderHospitalAdmin(state, actions) {
    const avgWait = state.appointments.filter(a => a.status === 'Checked-In').length * 15;
    return `
      <!-- Stats Cards -->
      <div class="grid-container cols-4">
        <div class="card card-glow-teal">
          <div class="card-title">Bed Occupancy <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><circle cx="6" cy="12" r="2"/></svg></div>
          <div class="card-value">74%</div>
          <div class="card-desc">78 of 105 beds occupied</div>
        </div>
        <div class="card card-glow-blue">
          <div class="card-title">Avg Wait Time <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
          <div class="card-value">${avgWait} min</div>
          <div class="card-desc"><span class="trend trend-up">↓ 12%</span> wait index today</div>
        </div>
        <div class="card">
          <div class="card-title">Daily Appointments <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
          <div class="card-value">${state.appointments.length}</div>
          <div class="card-desc">Scheduled for operations</div>
        </div>
        <div class="card">
          <div class="card-title">Clinician Utilization <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg></div>
          <div class="card-value">84%</div>
          <div class="card-desc">High doctor efficiency index</div>
        </div>
      </div>

      <div class="grid-container cols-2">
        <div class="card">
          <h3 class="card-title">Department Operations</h3>
          <div style="margin-top: 16px; display: flex; flex-direction: column; gap: 14px;">
            <div>
              <div style="display:flex; justify-content:space-between; margin-bottom: 6px; font-size:12px;">
                <span>Cardiology</span>
                <strong>92% (High Capacity)</strong>
              </div>
              <div style="background: rgba(255,255,255,0.05); height: 8px; border-radius: 4px; overflow:hidden;">
                <div style="background: var(--color-danger); width: 92%; height:100%;"></div>
              </div>
            </div>
            <div>
              <div style="display:flex; justify-content:space-between; margin-bottom: 6px; font-size:12px;">
                <span>Internal Medicine</span>
                <strong>72% (Normal)</strong>
              </div>
              <div style="background: rgba(255,255,255,0.05); height: 8px; border-radius: 4px; overflow:hidden;">
                <div style="background: var(--color-primary); width: 72%; height:100%;"></div>
              </div>
            </div>
            <div>
              <div style="display:flex; justify-content:space-between; margin-bottom: 6px; font-size:12px;">
                <span>General Surgery</span>
                <strong>55% (Normal)</strong>
              </div>
              <div style="background: rgba(255,255,255,0.05); height: 8px; border-radius: 4px; overflow:hidden;">
                <div style="background: var(--color-secondary); width: 55%; height:100%;"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card">
          <h3 class="card-title">Staff Availability Dashboard</h3>
          <div class="table-wrapper" style="margin-top: 16px;">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Specialty</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${state.doctors.map(doc => `
                  <tr>
                    <td><strong>${doc.name}</strong></td>
                    <td class="text-secondary">${doc.specialty}</td>
                    <td>
                      <select class="role-select select-doc-status btn-sm" data-id="${doc.id}" style="width: auto; padding: 4px 8px;">
                        <option value="Active" ${doc.status === 'Active' ? 'selected' : ''}>Active</option>
                        <option value="Consulting" ${doc.status === 'Consulting' ? 'selected' : ''}>Consulting</option>
                        <option value="On Break" ${doc.status === 'On Break' ? 'selected' : ''}>On Break</option>
                        <option value="Offline" ${doc.status === 'Offline' ? 'selected' : ''}>Offline</option>
                      </select>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  renderDoctor(state, actions) {
    const selectedPatient = state.patients.find(p => p.id === state.selectedPatientId) || state.patients[0];
    const doctorAppointments = state.appointments.filter(a => a.status !== 'Completed' && a.status !== 'Cancelled');
    
    return `
      <div class="grid-container cols-3-1">
        <!-- Main Column -->
        <div style="display: flex; flex-direction: column; gap: 24px;">
          <!-- Patient Selector -->
          <div class="card">
            <h3 class="card-title">Active Consultation Portal</h3>
            <div style="margin-top: 14px; display: flex; align-items: center; gap: 16px;">
              <span style="font-size: 13px; color: var(--text-secondary);">Select patient to view clinical timeline or add records:</span>
              <select class="role-select" id="doctor-patient-selector" style="width: 260px;">
                ${state.patients.map(p => `
                  <option value="${p.id}" ${p.id === selectedPatient.id ? 'selected' : ''}>${p.name} (${p.condition})</option>
                `).join('')}
              </select>
              <button class="btn btn-primary btn-sm" id="btn-view-vault">Open Memory Vault</button>
            </div>
          </div>
          
          <!-- Quick Diagnostics Form -->
          <div class="card">
            <h3 class="card-title">Add Diagnostic Record to Memory Vault</h3>
            <form id="consultation-form" style="margin-top: 16px; display: flex; flex-direction: column; gap: 16px;">
              <div class="cols-2 grid-container" style="margin-bottom:0;">
                <div class="form-group">
                  <label for="consult-type">Record Category</label>
                  <select class="form-control" id="consult-type" required>
                    <option value="diagnoses">Diagnosis / Clinical Notes</option>
                    <option value="prescriptions">Prescription</option>
                    <option value="labs">Lab / Test Result</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="consult-title">Record Title / Treatment Name</label>
                  <input type="text" class="form-control" id="consult-title" placeholder="e.g. Lisinopril 10mg orally daily" required>
                </div>
              </div>
              <div class="form-group">
                <label for="consult-body">Clinical Notes & Observations</label>
                <textarea class="form-control" id="consult-body" rows="4" placeholder="Type diagnostic findings, patient complaints, instructions..." required style="resize:none;"></textarea>
              </div>
              <div style="display: flex; justify-content: flex-end;">
                <button type="submit" class="btn btn-primary">Save to Memory Vault</button>
              </div>
            </form>
          </div>
        </div>
        
        <!-- Sidebar Column -->
        <div style="display: flex; flex-direction: column; gap: 24px;">
          <!-- Patient Summary Card -->
          <div class="card">
            <h3 class="card-title">Patient Profile</h3>
            <div class="patient-profile-header" style="margin-top: 16px; border:none; padding-bottom: 0;">
              <div class="patient-avatar">${selectedPatient.name[0]}</div>
              <div class="patient-meta-details">
                <h3>${selectedPatient.name}</h3>
                <p>${selectedPatient.gender}, ${selectedPatient.age} yrs</p>
                <p style="color:var(--color-primary); font-weight:600; margin-top:2px;">${selectedPatient.condition}</p>
              </div>
            </div>
            <div style="border-top:1px solid var(--border-color); padding-top: 16px; margin-top: 12px; display: flex; flex-direction: column; gap: 8px; font-size:12px;">
              <div style="display:flex; justify-content:space-between;">
                <span class="text-muted">BP:</span>
                <strong>${selectedPatient.vitals.bp} mmHg</strong>
              </div>
              <div style="display:flex; justify-content:space-between;">
                <span class="text-muted">Pulse Rate:</span>
                <strong>${selectedPatient.vitals.hr} bpm</strong>
              </div>
              <div style="display:flex; justify-content:space-between;">
                <span class="text-muted">Weight:</span>
                <strong>${selectedPatient.vitals.weight}</strong>
              </div>
              <div style="display:flex; justify-content:space-between; margin-top: 8px;">
                <span class="text-muted">Continuity Score:</span>
                <span class="badge ${selectedPatient.continuityScore > 75 ? 'badge-green' : selectedPatient.continuityScore > 50 ? 'badge-orange' : 'badge-red'}">${selectedPatient.continuityScore}/100</span>
              </div>
            </div>
          </div>
          
          <!-- Doctor Schedule -->
          <div class="card">
            <h3 class="card-title">Schedule Highlights</h3>
            <div style="margin-top: 12px; display:flex; flex-direction:column; gap: 10px;">
              ${doctorAppointments.length === 0 ? '<p class="text-muted" style="font-size:12px;">No active appointments left today.</p>' : ''}
              ${doctorAppointments.slice(0, 3).map(a => `
                <div style="background: rgba(255,255,255,0.02); padding: 10px; border-radius:6px; border:1px solid var(--border-color);">
                  <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:600;">
                    <span>${a.patientName}</span>
                    <span class="text-muted">${a.time}</span>
                  </div>
                  <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">${a.notes}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderNurse(state, actions) {
    const selectedPatient = state.patients.find(p => p.id === state.selectedPatientId) || state.patients[0];
    return `
      <div class="grid-container cols-2-3">
        <!-- Vitals Form Card -->
        <div class="card">
          <h3 class="card-title">Log Patient Vitals</h3>
          <div style="margin-top: 14px; margin-bottom: 20px;">
            <label style="font-size:11px; text-transform:uppercase; color:var(--text-muted); font-weight:700; margin-bottom:8px; display:block;">Select Patient</label>
            <select class="role-select" id="nurse-patient-selector">
              ${state.patients.map(p => `
                <option value="${p.id}" ${p.id === selectedPatient.id ? 'selected' : ''}>${p.name} (${p.condition})</option>
              `).join('')}
            </select>
          </div>
          
          <form id="vitals-form" style="display: flex; flex-direction: column; gap: 14px;">
            <div class="form-group">
              <label for="vital-bp">Blood Pressure (mmHg)</label>
              <input type="text" class="form-control" id="vital-bp" value="${selectedPatient.vitals.bp}" placeholder="e.g. 120/80" required>
            </div>
            <div class="form-group">
              <label for="vital-hr">Heart Rate (bpm)</label>
              <input type="number" class="form-control" id="vital-hr" value="${selectedPatient.vitals.hr}" placeholder="e.g. 72" required>
            </div>
            <div class="form-group">
              <label for="vital-temp">Temperature (°F)</label>
              <input type="text" class="form-control" id="vital-temp" value="${selectedPatient.vitals.temp}" placeholder="e.g. 98.6" required>
            </div>
            <div class="form-group">
              <label for="vital-rr">Respiratory Rate (breaths/min)</label>
              <input type="number" class="form-control" id="vital-rr" value="${selectedPatient.vitals.rr}" placeholder="e.g. 16" required>
            </div>
            <div class="form-group">
              <label for="vital-weight">Weight (lbs)</label>
              <input type="text" class="form-control" id="vital-weight" value="${selectedPatient.vitals.weight}" placeholder="e.g. 150 lbs" required>
            </div>
            <button type="submit" class="btn btn-primary">Submit & Log Vitals</button>
          </form>
        </div>
        
        <!-- Patient Clinical History Snapshot -->
        <div class="card">
          <h3 class="card-title">Memory Vault Timeline Snapshot</h3>
          <div style="margin-top: 16px;">
            <div class="patient-profile-header">
              <div class="patient-avatar">${selectedPatient.name[0]}</div>
              <div class="patient-meta-details">
                <h3>${selectedPatient.name}</h3>
                <p>${selectedPatient.gender}, ${selectedPatient.age} years old | <strong>Continuity Score: ${selectedPatient.continuityScore}%</strong></p>
                <p style="color:var(--color-primary); font-weight:600; margin-top:2px;">Current Condition: ${selectedPatient.condition}</p>
              </div>
            </div>
            
            <div class="timeline" style="margin-top: 20px;">
              ${selectedPatient.history.slice(0, 3).map(h => `
                <div class="timeline-item">
                  <div class="timeline-dot ${h.type}">
                    ${h.type === 'prescriptions' ? 'P' : h.type === 'labs' ? 'L' : h.type === 'vitals' ? 'V' : 'D'}
                  </div>
                  <div class="timeline-content" style="padding: 12px 16px;">
                    <div class="timeline-header">
                      <div class="timeline-title" style="font-size:13px;">${h.title}</div>
                      <div class="timeline-date">${h.date}</div>
                    </div>
                    <div class="timeline-body" style="font-size:12px;">${h.body}</div>
                  </div>
                </div>
              `).join('')}
            </div>
            <div style="text-align: center; margin-top: 12px;">
              <button class="btn btn-secondary btn-sm" id="btn-nurse-open-vault">View Complete Clinical Vault</button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderReceptionist(state, actions) {
    const todayAppts = state.appointments.filter(a => a.date === '2026-06-06');
    const checkedIn = todayAppts.filter(a => a.status === 'Checked-In');
    const scheduled = todayAppts.filter(a => a.status === 'Scheduled');
    const completed = todayAppts.filter(a => a.status === 'Completed');
    
    return `
      <!-- Stats Cards -->
      <div class="grid-container cols-4">
        <div class="card">
          <div class="card-title">Scheduled Today</div>
          <div class="card-value">${todayAppts.length}</div>
          <div class="card-desc">Scheduled patient reviews</div>
        </div>
        <div class="card card-glow-teal">
          <div class="card-title">Checked-In Queue</div>
          <div class="card-value">${checkedIn.length}</div>
          <div class="card-desc">Waiting in lobby</div>
        </div>
        <div class="card card-glow-blue">
          <div class="card-title">Average Wait</div>
          <div class="card-value">${checkedIn.length * 12} min</div>
          <div class="card-desc">Calculated wait index</div>
        </div>
        <div class="card">
          <div class="card-title">Consulted Done</div>
          <div class="card-value">${completed.length}</div>
          <div class="card-desc">Completed consults today</div>
        </div>
      </div>

      <div class="grid-container cols-3-1">
        <!-- Appointments Checklist and Action Board -->
        <div class="card">
          <h3 class="card-title">Today's Appointment Log & Quick Actions</h3>
          <div class="table-wrapper" style="margin-top:16px;">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Patient</th>
                  <th>Assigned Physician</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${todayAppts.map(apt => `
                  <tr>
                    <td><strong>${apt.time}</strong></td>
                    <td>${apt.patientName}</td>
                    <td>${apt.doctorName}</td>
                    <td>
                      <span class="badge ${apt.status === 'Completed' ? 'badge-green' : apt.status === 'Checked-In' ? 'badge-orange' : 'badge-blue'}">
                        ${apt.status}
                      </span>
                    </td>
                    <td>
                      ${apt.status === 'Scheduled' ? `
                        <button class="btn btn-primary btn-sm btn-checkin" data-id="${apt.id}">Check In</button>
                      ` : apt.status === 'Checked-In' ? `
                        <button class="btn btn-secondary btn-sm btn-complete" data-id="${apt.id}">Mark Done</button>
                      ` : `
                        <span class="text-muted" style="font-size:11px;">Completed</span>
                      `}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Queue Operations Panel -->
        <div class="card">
          <h3 class="card-title">Reception Panel</h3>
          <div style="margin-top: 20px; display:flex; flex-direction:column; gap:12px;">
            <button class="btn btn-primary" id="btn-receptionist-book">Book New Appointment</button>
            <button class="btn btn-secondary" id="btn-view-queue-board">Launch Live Queue Board</button>
          </div>
        </div>
      </div>
    `;
  },

  renderPatient(state, actions) {
    const patient = state.patients.find(p => p.id === state.selectedPatientId) || state.patients[0];
    const patientAppts = state.appointments.filter(a => a.patientId === patient.id);
    const unpaidBills = state.invoices.filter(i => i.patientName === patient.name && i.status === 'Unpaid');
    
    return `
      <!-- Selector for Demo purposes -->
      <div class="card" style="margin-bottom: 24px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span>Demoing Patient Account. Switch user:</span>
          <select class="role-select" id="patient-user-selector" style="width: 240px;">
            ${state.patients.map(p => `
              <option value="${p.id}" ${p.id === patient.id ? 'selected' : ''}>${p.name}</option>
            `).join('')}
          </select>
        </div>
      </div>

      <div class="grid-container cols-3-1">
        <!-- Left Column -->
        <div style="display:flex; flex-direction:column; gap:24px;">
          <!-- Patient Summary & Healthcare Score -->
          <div class="grid-container cols-2" style="margin-bottom:0;">
            <div class="card card-glow-teal" style="display:flex; align-items:center; gap:20px;">
              <div class="radial-progress-container" style="flex-shrink:0;">
                <div class="radial-progress">
                  <svg>
                    <defs>
                      <linearGradient id="gradient-teal-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="var(--color-primary)" />
                        <stop offset="100%" stop-color="var(--color-secondary)" />
                      </linearGradient>
                    </defs>
                    <circle class="radial-bg" cx="70" cy="70" r="60" />
                    <circle class="radial-fill" cx="70" cy="70" r="60" style="stroke-dashoffset: ${377 - (377 * patient.continuityScore) / 100}" />
                  </svg>
                  <div class="radial-text">
                    <span class="radial-score">${patient.continuityScore}</span>
                    <span class="radial-label">Continuity</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 style="font-size:16px; margin-bottom: 6px;">Your Healthcare Continuity Score</h3>
                <p class="text-secondary" style="font-size:12px;">This proprietary score measures your treatment adherence. Keeping it above 75 ensures high medical recovery safety!</p>
              </div>
            </div>
            
            <div class="card">
              <h3 class="card-title">Treatment Compliance Progress</h3>
              <div style="margin-top:10px; display:flex; flex-direction:column; gap:10px; font-size:12px;">
                <div>
                  <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                    <span>Appointment Attendance</span>
                    <strong>${patient.metrics.attendance}%</strong>
                  </div>
                  <div style="background:rgba(255,255,255,0.05); height:6px; border-radius:3px; overflow:hidden;">
                    <div style="background:var(--color-primary); width:${patient.metrics.attendance}%; height:100%;"></div>
                  </div>
                </div>
                <div>
                  <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                    <span>Medication Compliance</span>
                    <strong>${patient.metrics.medication}%</strong>
                  </div>
                  <div style="background:rgba(255,255,255,0.05); height:6px; border-radius:3px; overflow:hidden;">
                    <div style="background:var(--color-secondary); width:${patient.metrics.medication}%; height:100%;"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Upcoming Appointments -->
          <div class="card">
            <h3 class="card-title">My Healthcare Schedule</h3>
            <div class="table-wrapper" style="margin-top:14px;">
              <table class="custom-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Physician</th>
                    <th>Purpose</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${patientAppts.length === 0 ? `<tr><td colspan="5" class="text-muted">No appointments scheduled.</td></tr>` : ''}
                  ${patientAppts.map(apt => `
                    <tr>
                      <td><strong>${apt.date}</strong></td>
                      <td>${apt.time}</td>
                      <td>${apt.doctorName}</td>
                      <td>${apt.notes}</td>
                      <td>
                        <span class="badge ${apt.status === 'Completed' ? 'badge-green' : apt.status === 'Checked-In' ? 'badge-orange' : 'badge-blue'}">
                          ${apt.status}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            <div style="margin-top:16px;">
              <button class="btn btn-primary btn-sm" id="btn-patient-book">Book Appointment</button>
            </div>
          </div>
        </div>
        
        <!-- Right Column -->
        <div style="display:flex; flex-direction:column; gap:24px;">
          <!-- Medication Checklist -->
          <div class="card">
            <h3 class="card-title">Daily Dose Adherence</h3>
            <p class="text-muted" style="font-size:11px; margin-bottom:12px;">Toggle checklist to record medication compliance.</p>
            <div style="display:flex; flex-direction:column; gap:10px;">
              <label class="badge" style="background:rgba(255,255,255,0.02); display:flex; justify-content:space-between; align-items:center; width:100%; text-align:left; border:1px solid var(--border-color); padding: 8px 12px;">
                <span style="font-size:12px; font-weight:500;">Morning Dose - Active Medications</span>
                <input type="checkbox" checked style="cursor:pointer;" id="check-dose-morning">
              </label>
              <label class="badge" style="background:rgba(255,255,255,0.02); display:flex; justify-content:space-between; align-items:center; width:100%; text-align:left; border:1px solid var(--border-color); padding: 8px 12px;">
                <span style="font-size:12px; font-weight:500;">Evening Dose - Recovery Log</span>
                <input type="checkbox" style="cursor:pointer;" id="check-dose-evening">
              </label>
            </div>
            <button class="btn btn-secondary btn-sm" style="width:100%; margin-top:14px;" id="btn-submit-med-adherence">Save Adherence Data</button>
          </div>
          
          <!-- Outstanding billing -->
          <div class="card">
            <h3 class="card-title">Billing & Invoices</h3>
            <div style="margin-top:12px; display:flex; flex-direction:column; gap:8px;">
              ${unpaidBills.length === 0 ? `
                <div style="font-size:13px; color:var(--color-success); font-weight:600; display:flex; align-items:center; gap:6px;">
                  ✓ All accounts paid. No balance.
                </div>
              ` : `
                <div style="font-size:12px; color:var(--text-secondary);">You have ${unpaidBills.length} outstanding invoices:</div>
                ${unpaidBills.map(b => `
                  <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.02); padding:10px; border-radius:6px; border:1px solid var(--border-color);">
                    <div>
                      <div style="font-size:12px; font-weight:600;">$${b.amount.toFixed(2)}</div>
                      <div style="font-size:10px; color:var(--text-muted);">${b.description}</div>
                    </div>
                    <button class="btn btn-primary btn-sm btn-pay-dash" data-id="${b.id}">Pay</button>
                  </div>
                `).join('')}
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderFamilyCaregiver(state, actions) {
    const dependentId = state.selectedDependentId || state.patients.find(p => p.caregiver !== null).id;
    const dependent = state.patients.find(p => p.id === dependentId);
    const caregiverPatients = state.patients.filter(p => p.caregiver && p.caregiver.name === "Sarah Smith" || p.caregiver && p.caregiver.name === "Maximus Aurelius" || p.caregiver && p.caregiver.name === "Albert Chen");
    
    // Fallback if caregiver patient matches are null in current filter
    const activeCaregiverName = dependent.caregiver ? dependent.caregiver.name : "Caregiver";
    const dependents = state.patients.filter(p => p.caregiver !== null);
    
    return `
      <!-- Family Health Hub Wrapper -->
      <div class="card" style="margin-bottom: 24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
          <div>
            <h3 style="font-size:16px; font-weight:700;">Family Health Hub Dashboard</h3>
            <p style="font-size:12px; color:var(--text-secondary); margin-top:2px;">Logged in as: <strong>${activeCaregiverName}</strong> (Authorized Caregiver)</p>
          </div>
          <div style="display:flex; align-items:center; gap:12px;">
            <span>Select Dependent:</span>
            <select class="role-select" id="caregiver-dependent-selector" style="width: 220px;">
              ${dependents.map(d => `
                <option value="${d.id}" ${d.id === dependent.id ? 'selected' : ''}>${d.name} (${d.caregiver.relation})</option>
              `).join('')}
            </select>
          </div>
        </div>
      </div>

      <div class="grid-container cols-2">
        <!-- Dependent Health Status -->
        <div class="card card-glow-teal">
          <h3 class="card-title">Dependent Summary: ${dependent.name}</h3>
          
          <div class="patient-profile-header" style="margin-top:20px; border:none; padding-bottom:0;">
            <div class="patient-avatar">${dependent.name[0]}</div>
            <div class="patient-meta-details">
              <h3>${dependent.name}</h3>
              <p>Condition: <strong>${dependent.condition}</strong></p>
              <p style="margin-top:4px;">Continuity score: <span class="badge ${dependent.continuityScore > 75 ? 'badge-green' : dependent.continuityScore > 50 ? 'badge-orange' : 'badge-red'}">${dependent.continuityScore}%</span></p>
            </div>
          </div>
          
          <div style="border-top:1px solid var(--border-color); padding-top:16px; margin-top:16px; display:grid; grid-template-columns: repeat(2, 1fr); gap:16px; font-size:12px;">
            <div>
              <div class="text-muted" style="margin-bottom:2px;">Blood Pressure</div>
              <strong>${dependent.vitals.bp} mmHg</strong>
            </div>
            <div>
              <div class="text-muted" style="margin-bottom:2px;">Heart Rate</div>
              <strong>${dependent.vitals.hr} bpm</strong>
            </div>
            <div>
              <div class="text-muted" style="margin-bottom:2px;">Respiratory Rate</div>
              <strong>${dependent.vitals.rr} breaths/min</strong>
            </div>
            <div>
              <div class="text-muted" style="margin-bottom:2px;">Temperature</div>
              <strong>${dependent.vitals.temp}</strong>
            </div>
          </div>
        </div>
        
        <!-- Dependent Timeline & Quick Compliance Actions -->
        <div class="card">
          <h3 class="card-title">Recent Clinical Logs for ${dependent.name}</h3>
          <div class="timeline" style="margin-top:20px; max-height: 220px; overflow-y:auto; padding-left: 28px;">
            ${dependent.history.slice(0, 2).map(h => `
              <div class="timeline-item" style="margin-bottom:16px;">
                <div class="timeline-dot ${h.type}" style="left:-25px; width:18px; height:18px; font-size:9px;">
                  ${h.type === 'prescriptions' ? 'P' : h.type === 'labs' ? 'L' : 'D'}
                </div>
                <div class="timeline-content" style="padding:10px 14px;">
                  <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:600;">
                    <span>${h.title}</span>
                    <span class="text-muted">${h.date}</span>
                  </div>
                  <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">${h.body}</div>
                </div>
              </div>
            `).join('')}
          </div>
          <div style="text-align:right; margin-top:12px;">
            <button class="btn btn-secondary btn-sm" id="btn-family-open-vault">View Dependent Memory Vault</button>
          </div>
        </div>
      </div>
    `;
  },

  attachListeners(container, state, actions) {
    // Admin Doc status update listener
    const docStatusSelects = container.querySelectorAll(".select-doc-status");
    docStatusSelects.forEach(select => {
      select.addEventListener("change", (e) => {
        const docId = e.target.getAttribute("data-id");
        const status = e.target.value;
        actions.updateDoctorStatus(docId, status);
        actions.addAuditLog("Update Status", `Doctor ${docId}`, `Set status to ${status}`);
        actions.addNotification("Doctor Status Changed", `Doctor status updated to ${status}.`);
      });
    });

    // Doctor view patient selector
    const docPatientSelector = container.querySelector("#doctor-patient-selector");
    if (docPatientSelector) {
      docPatientSelector.addEventListener("change", (e) => {
        actions.changePatient(e.target.value);
      });
    }

    // Nurse view patient selector
    const nursePatientSelector = container.querySelector("#nurse-patient-selector");
    if (nursePatientSelector) {
      nursePatientSelector.addEventListener("change", (e) => {
        actions.changePatient(e.target.value);
      });
    }

    // Patient selector for demo
    const patientUserSelector = container.querySelector("#patient-user-selector");
    if (patientUserSelector) {
      patientUserSelector.addEventListener("change", (e) => {
        actions.changePatient(e.target.value);
      });
    }

    // Caregiver dependent selector
    const caregiverDependentSelector = container.querySelector("#caregiver-dependent-selector");
    if (caregiverDependentSelector) {
      caregiverDependentSelector.addEventListener("change", (e) => {
        actions.changeDependent(e.target.value);
      });
    }

    // Doctor Consultation Form submit
    const consultForm = container.querySelector("#consultation-form");
    if (consultForm) {
      consultForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const type = container.querySelector("#consult-type").value;
        const title = container.querySelector("#consult-title").value;
        const body = container.querySelector("#consult-body").value;
        
        const activePatient = state.patients.find(p => p.id === state.selectedPatientId) || state.patients[0];
        
        // Append clinical record to patient history
        const newRecord = {
          id: "h-" + Math.floor(Math.random() * 10000),
          date: new Date().toISOString().split('T')[0],
          type,
          title,
          body,
          doc: "Dr. Miranda Bailey" // Assumed logged in doctor for simplicity
        };
        
        activePatient.history.unshift(newRecord);
        
        // Boost metrics for consultation & prescription logs
        if (type === 'prescriptions') {
          activePatient.metrics.medication = Math.min(100, activePatient.metrics.medication + 10);
        } else if (type === 'labs') {
          activePatient.metrics.reports = Math.min(100, activePatient.metrics.reports + 15);
        }
        
        // Re-evaluate Continuity Score & Risk
        import("../engine.js").then(({ engine }) => {
          activePatient.continuityScore = engine.calculateContinuityScore(activePatient.metrics);
          activePatient.riskLevel = engine.evaluateRiskLevel(activePatient.continuityScore, activePatient.riskFactors);
          
          actions.updatePatientMetrics(activePatient.id, activePatient.metrics);
          actions.addAuditLog("Consultation Logged", `Patient ${activePatient.name}`, `Added ${type}: "${title}"`);
          actions.addNotification("Vault Record Saved", `Successfully added new diagnostic record for ${activePatient.name}.`);
          
          // Refresh view
          this.render(container, state, actions);
        });
      });
    }

    // Nurse Vitals Form submit
    const vitalsForm = container.querySelector("#vitals-form");
    if (vitalsForm) {
      vitalsForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const bp = container.querySelector("#vital-bp").value;
        const hr = parseInt(container.querySelector("#vital-hr").value);
        const temp = container.querySelector("#vital-temp").value;
        const rr = parseInt(container.querySelector("#vital-rr").value);
        const weight = container.querySelector("#vital-weight").value;
        
        const activePatient = state.patients.find(p => p.id === state.selectedPatientId) || state.patients[0];
        
        // Save new vitals
        activePatient.vitals = { bp, hr, temp, rr, weight };
        
        // Add vitals record to history
        const newRecord = {
          id: "h-" + Math.floor(Math.random() * 10000),
          date: new Date().toISOString().split('T')[0],
          type: "vitals",
          title: "Vital Signs Logged",
          body: `Blood Pressure: ${bp} mmHg, Heart Rate: ${hr} bpm, Temperature: ${temp}°F, Respiratory Rate: ${rr} breaths/min, Weight: ${weight}.`,
          doc: "Nurse Clara Barton"
        };
        
        activePatient.history.unshift(newRecord);
        
        // Improve report submission metric
        activePatient.metrics.reports = Math.min(100, activePatient.metrics.reports + 10);
        
        import("../engine.js").then(({ engine }) => {
          activePatient.continuityScore = engine.calculateContinuityScore(activePatient.metrics);
          activePatient.riskLevel = engine.evaluateRiskLevel(activePatient.continuityScore, activePatient.riskFactors);
          
          actions.updatePatientMetrics(activePatient.id, activePatient.metrics);
          actions.addAuditLog("Vitals Logged", `Patient ${activePatient.name}`, `Logged new vitals (BP: ${bp})`);
          actions.addNotification("Patient Vitals Updated", `Vitals for ${activePatient.name} logged successfully.`);
          
          // Refresh
          this.render(container, state, actions);
        });
      });
    }

    // Check-in & Complete button handlers for Receptionist
    const checkinBtns = container.querySelectorAll(".btn-checkin");
    checkinBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        const appt = actions.updateAppointmentStatus(id, "Checked-In");
        actions.addAuditLog("Patient Check-in", `Appointment ${id}`, `Patient ${appt.patientName} checked-in`);
        actions.addNotification("Queue Updated", `${appt.patientName} checked in and added to active queue.`);
        this.render(container, state, actions);
      });
    });

    const completeBtns = container.querySelectorAll(".btn-complete");
    completeBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        const appt = actions.updateAppointmentStatus(id, "Completed");
        actions.addAuditLog("Consultation Completed", `Appointment ${id}`, `Consultation for ${appt.patientName} marked complete`);
        actions.addNotification("Consultation Completed", `Doctor finalized consult for ${appt.patientName}.`);
        this.render(container, state, actions);
      });
    });

    // Pay buttons
    const payBtns = container.querySelectorAll(".btn-pay-dash");
    payBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        const inv = actions.payInvoice(id);
        actions.addAuditLog("Invoice Settled", `Invoice #${id}`, `Paid $${inv.amount.toFixed(2)}`);
        actions.addNotification("Invoice Paid", `Successfully paid invoice #${id}.`);
        this.render(container, state, actions);
      });
    });

    // Navigation buttons
    const viewVaultBtn = container.querySelector("#btn-view-vault");
    if (viewVaultBtn) {
      viewVaultBtn.addEventListener("click", () => actions.navigate("MemoryVault"));
    }
    const nurseVaultBtn = container.querySelector("#btn-nurse-open-vault");
    if (nurseVaultBtn) {
      nurseVaultBtn.addEventListener("click", () => actions.navigate("MemoryVault"));
    }
    const familyVaultBtn = container.querySelector("#btn-family-open-vault");
    if (familyVaultBtn) {
      familyVaultBtn.addEventListener("click", () => {
        // Set selected patient to the dependent
        const dependentId = state.selectedDependentId || state.patients.find(p => p.caregiver !== null).id;
        actions.changePatient(dependentId);
        actions.navigate("MemoryVault");
      });
    }

    const receptionBookBtn = container.querySelector("#btn-receptionist-book");
    if (receptionBookBtn) {
      receptionBookBtn.addEventListener("click", () => actions.navigate("Appointments"));
    }
    const viewQueueBtn = container.querySelector("#btn-view-queue-board");
    if (viewQueueBtn) {
      viewQueueBtn.addEventListener("click", () => actions.navigate("Appointments"));
    }
    
    const patientBookBtn = container.querySelector("#btn-patient-book");
    if (patientBookBtn) {
      patientBookBtn.addEventListener("click", () => actions.navigate("Appointments"));
    }
    
    // Backup triggers
    const triggerBackupBtn = container.querySelector("#btn-trigger-backup");
    if (triggerBackupBtn) {
      triggerBackupBtn.addEventListener("click", () => {
        alert("Platform backup triggered successfully! All patient profiles, vault records, and compliance indexes compressed to DB-Store.");
      });
    }
    const syncHl7Btn = container.querySelector("#btn-sync-hl7");
    if (syncHl7Btn) {
      syncHl7Btn.addEventListener("click", () => {
        alert("HL7 FHIR database sync activated. 24 external outpatient updates merged into local vault memory.");
      });
    }
    const clearDemoBtn = container.querySelector("#btn-clear-demo");
    if (clearDemoBtn) {
      clearDemoBtn.addEventListener("click", () => {
        localStorage.removeItem("ms360_initialized");
        localStorage.removeItem("ms360_patients");
        localStorage.removeItem("ms360_doctors");
        localStorage.removeItem("ms360_appointments");
        localStorage.removeItem("ms360_invoices");
        localStorage.removeItem("ms360_audit_logs");
        localStorage.removeItem("ms360_notifications");
        location.reload();
      });
    }

    // Patient Adherence checklist save
    const medAdherenceBtn = container.querySelector("#btn-submit-med-adherence");
    if (medAdherenceBtn) {
      medAdherenceBtn.addEventListener("click", () => {
        const morning = container.querySelector("#check-dose-morning").checked;
        const evening = container.querySelector("#check-dose-evening").checked;
        
        let checkedCount = 0;
        if (morning) checkedCount++;
        if (evening) checkedCount++;
        
        const adherenceInc = checkedCount * 10;
        const patient = state.patients.find(p => p.id === state.selectedPatientId) || state.patients[0];
        
        patient.metrics.medication = Math.min(100, patient.metrics.medication + adherenceInc);
        
        import("../engine.js").then(({ engine }) => {
          patient.continuityScore = engine.calculateContinuityScore(patient.metrics);
          patient.riskLevel = engine.evaluateRiskLevel(patient.continuityScore, patient.riskFactors);
          
          actions.updatePatientMetrics(patient.id, patient.metrics);
          actions.addAuditLog("Medication Logged", `Patient ${patient.name}`, `Daily dose self-logged by patient. Compliance updated.`);
          actions.addNotification("Daily Log Saved", "Your medication adherence was saved and continuity score updated.");
          this.render(container, state, actions);
        });
      });
    }
  }
};
