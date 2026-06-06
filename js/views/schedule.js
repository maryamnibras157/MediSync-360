// MediSync 360 - Appointment Booking & Queue Management Board

export const scheduleView = {
  wizardState: {
    step: 1,
    patientId: null,
    patientName: null,
    department: null,
    doctorId: null,
    doctorName: null,
    date: "2026-06-06",
    time: null,
    notes: "",
    patientSearch: ""
  },

  render(container, state, actions) {
    const today = "2026-06-06";
    const todayAppts = state.appointments.filter(a => a.date === today);
    
    // Columns for the Kanban Queue Board
    const lobby = todayAppts.filter(a => a.status === "Scheduled");
    const activeQueue = todayAppts.filter(a => a.status === "Checked-In" || a.status === "Consulting");
    const discharged = todayAppts.filter(a => a.status === "Completed" || a.status === "Cancelled");
    
    // Calculate waiting metrics
    const avgWait = activeQueue.length * 12; // 12 mins per patient average

    let html = `
      <div class="page-fade-in">
        <h2 class="page-heading">Appointments & Live Queue</h2>
        <p class="page-subheading">Orchestrate patient scheduling, receptionist workflows, and clinic lobby speed indexes.</p>
        
        <!-- Stats Widgets -->
        <div class="grid-container cols-4">
          <div class="card">
            <div class="card-title">Checked-In Today</div>
            <div class="card-value">${todayAppts.filter(a => a.status !== "Scheduled").length}</div>
            <div class="card-desc">Lobby footprint index</div>
          </div>
          <div class="card card-glow-teal">
            <div class="card-title">Estimated Wait Time</div>
            <div class="card-value">${avgWait} min</div>
            <div class="card-desc"><span class="badge badge-teal">Live calculation</span></div>
          </div>
          <div class="card">
            <div class="card-title">Consulted Done</div>
            <div class="card-value">${todayAppts.filter(a => a.status === "Completed").length}</div>
            <div class="card-desc">Closed clinical reviews</div>
          </div>
          <div class="card">
            <div class="card-title">Total Daily Target</div>
            <div class="card-value">${todayAppts.length}</div>
            <div class="card-desc">Scheduled slot occupancy</div>
          </div>
        </div>

        <div class="grid-container cols-3-1">
          <!-- Left side: Live Kanban Board -->
          <div style="display:flex; flex-direction:column; gap:24px;">
            <div class="card">
              <h3 class="card-title">Live Lobby Queue Board</h3>
              <p class="text-muted" style="font-size:11px; margin-bottom:16px;">Move patients through intake, consultation, and discharge workflows.</p>
              
              <div class="queue-board">
                <!-- Column 1: Lobby Intake -->
                <div class="queue-column">
                  <div class="queue-column-header">
                    <span>Lobby Check-In</span>
                    <span class="badge badge-blue">${lobby.length}</span>
                  </div>
                  <div class="queue-card-list">
                    ${lobby.length === 0 ? '<div style="text-align:center; padding: 20px 0; font-size:11px; color:var(--text-muted);">No patients pending check-in.</div>' : ''}
                    ${lobby.map(apt => `
                      <div class="queue-card">
                        <div class="queue-card-header">
                          <span>${apt.patientName}</span>
                          <span style="font-size:10px;" class="text-muted">${apt.time}</span>
                        </div>
                        <div class="queue-card-doctor">${apt.doctorName} (${apt.notes})</div>
                        <button class="btn btn-primary btn-sm btn-block btn-checkin-q" data-id="${apt.id}" style="width:100%;">Intake Check-In</button>
                      </div>
                    `).join('')}
                  </div>
                </div>
                
                <!-- Column 2: In Consultation -->
                <div class="queue-column" style="background: rgba(20, 184, 166, 0.02); border-color: rgba(20, 184, 166, 0.15);">
                  <div class="queue-column-header" style="color:var(--color-primary);">
                    <span>In Treatment</span>
                    <span class="badge badge-teal">${activeQueue.length}</span>
                  </div>
                  <div class="queue-card-list">
                    ${activeQueue.length === 0 ? '<div style="text-align:center; padding: 20px 0; font-size:11px; color:var(--text-muted);">Queue empty.</div>' : ''}
                    ${activeQueue.map(apt => `
                      <div class="queue-card" style="border-left: 3px solid ${apt.status === 'Consulting' ? 'var(--color-success)' : 'var(--color-warning)'}">
                        <div class="queue-card-header">
                          <span>${apt.patientName}</span>
                          <span class="badge ${apt.status === 'Consulting' ? 'badge-green' : 'badge-orange'}" style="font-size:8px; padding:2px 4px;">${apt.status}</span>
                        </div>
                        <div class="queue-card-doctor">${apt.doctorName}</div>
                        <div style="display:flex; gap:6px; margin-top:8px;">
                          ${apt.status === 'Checked-In' ? `
                            <button class="btn btn-primary btn-sm btn-consult-q" data-id="${apt.id}" style="flex:1; padding: 4px 0; font-size:10px;">Consult</button>
                          ` : `
                            <button class="btn btn-secondary btn-sm btn-complete-q" data-id="${apt.id}" style="flex:1; padding: 4px 0; font-size:10px;">Discharge</button>
                          `}
                          <button class="btn btn-danger btn-sm btn-cancel-q" data-id="${apt.id}" style="padding: 4px 8px; font-size:10px;">×</button>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
                
                <!-- Column 3: Discharged -->
                <div class="queue-column">
                  <div class="queue-column-header">
                    <span>Discharged</span>
                    <span class="badge badge-green">${discharged.length}</span>
                  </div>
                  <div class="queue-card-list">
                    ${discharged.length === 0 ? '<div style="text-align:center; padding: 20px 0; font-size:11px; color:var(--text-muted);">No records discharged.</div>' : ''}
                    ${discharged.map(apt => `
                      <div class="queue-card" style="opacity:0.75;">
                        <div class="queue-card-header">
                          <span>${apt.patientName}</span>
                          <span class="badge ${apt.status === 'Completed' ? 'badge-green' : 'badge-red'}" style="font-size:8px; padding:2px 4px;">${apt.status}</span>
                        </div>
                        <div class="queue-card-doctor">${apt.doctorName}</div>
                        <div style="font-size:10px; color:var(--text-muted); margin-top:4px; font-style:italic;">"${apt.notes}"</div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Right side: Booking Wizard -->
          ${this.renderWizardCard(state)}
        </div>
      </div>
    `;

    container.innerHTML = html;
    this.attachListeners(container, state, actions);
  },

  renderWizardCard(state) {
    const step = this.wizardState.step;
    
    return `
      <div class="card">
        <h3 class="card-title">Appointment Wizard</h3>
        <p class="text-muted" style="font-size:11px; margin-bottom:18px;">Book clinical slots in 6 easy steps.</p>
        
        <!-- Progress Indicator -->
        <div class="wizard-progress">
          <div class="wizard-progress-bar" style="width: ${((step - 1) / 5) * 100}%;"></div>
          <div class="wizard-step-indicator ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}" title="Select Patient">1</div>
          <div class="wizard-step-indicator ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}" title="Department">2</div>
          <div class="wizard-step-indicator ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}" title="Doctor">3</div>
          <div class="wizard-step-indicator ${step >= 4 ? 'active' : ''} ${step > 4 ? 'completed' : ''}" title="Date">4</div>
          <div class="wizard-step-indicator ${step >= 5 ? 'active' : ''} ${step > 5 ? 'completed' : ''}" title="Time Slot">5</div>
          <div class="wizard-step-indicator ${step >= 6 ? 'active' : ''}" title="Confirm">6</div>
        </div>

        <!-- Wizard Panels -->
        
        <!-- STEP 1: Select Patient -->
        <div class="wizard-panel ${step === 1 ? 'active' : ''}">
          <div class="form-group" style="margin-bottom:0;">
            <label style="margin-bottom:8px; font-weight:700;">Step 1: Select Patient File</label>
            <div class="header-search" style="width:100%; margin-bottom:12px; padding:6px 12px; background:rgba(255,255,255,0.03);">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" id="wiz-patient-search" value="${this.wizardState.patientSearch}" placeholder="Type patient name..." style="font-size:12px; margin-left:6px;">
            </div>
            
            <div class="selectable-list">
              ${state.patients.filter(p => !p.archived && p.name.toLowerCase().includes(this.wizardState.patientSearch.toLowerCase())).map(p => `
                <div class="selectable-item wiz-patient-item ${this.wizardState.patientId === p.id ? 'selected' : ''}" data-id="${p.id}" data-name="${p.name}">
                  <strong>${p.name}</strong>
                  <span class="text-muted" style="font-size:11px;">${p.condition}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- STEP 2: Select Department -->
        <div class="wizard-panel ${step === 2 ? 'active' : ''}">
          <div class="form-group" style="margin-bottom:0;">
            <label style="margin-bottom:10px; font-weight:700;">Step 2: Select Admitted Department</label>
            <div class="selectable-list">
              ${["Cardiology", "Internal Medicine", "Neurology", "General Surgery", "Nephrology"].map(dept => `
                <div class="selectable-item wiz-dept-item ${this.wizardState.department === dept ? 'selected' : ''}" data-value="${dept}">
                  <strong>${dept}</strong>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
              `).join('')}
            </div>
          </div>
          <div style="display:flex; justify-content:space-between; margin-top:20px;">
            <button class="btn btn-secondary btn-sm wiz-prev-btn">&larr; Back</button>
          </div>
        </div>

        <!-- STEP 3: Select Doctor -->
        <div class="wizard-panel ${step === 3 ? 'active' : ''}">
          <div class="form-group" style="margin-bottom:0;">
            <label style="margin-bottom:10px; font-weight:700;">Step 3: Select Physician</label>
            <div class="selectable-list">
              ${state.doctors.filter(d => d.department === this.wizardState.department && d.status !== 'Offline').map(d => `
                <div class="selectable-item wiz-doctor-item ${this.wizardState.doctorId === d.id ? 'selected' : ''}" data-id="${d.id}" data-name="${d.name}">
                  <div>
                    <strong>${d.name}</strong>
                    <div style="font-size:10px; color:var(--text-muted); margin-top:2px;">${d.specialty} | Fee: $${d.consultationFee}</div>
                  </div>
                  <span class="badge ${d.status === 'Available' ? 'badge-green' : d.status === 'Consulting' ? 'badge-blue' : 'badge-orange'}" style="font-size:9px;">${d.status}</span>
                </div>
              `).join('')}
              ${state.doctors.filter(d => d.department === this.wizardState.department && d.status !== 'Offline').length === 0 ? `
                <div style="text-align:center; padding:20px; color:var(--text-muted); font-size:12px;">No active doctors available in this department.</div>
              ` : ''}
            </div>
          </div>
          <div style="display:flex; justify-content:space-between; margin-top:20px;">
            <button class="btn btn-secondary btn-sm wiz-prev-btn">&larr; Back</button>
          </div>
        </div>

        <!-- STEP 4: Select Date -->
        <div class="wizard-panel ${step === 4 ? 'active' : ''}">
          <div class="form-group" style="margin-bottom:0;">
            <label for="wiz-appt-date" style="margin-bottom:10px; font-weight:700;">Step 4: Select Appointment Date</label>
            <input type="date" class="form-control" id="wiz-appt-date" value="${this.wizardState.date}">
          </div>
          <div style="display:flex; justify-content:space-between; margin-top:20px;">
            <button class="btn btn-secondary btn-sm wiz-prev-btn">&larr; Back</button>
            <button class="btn btn-primary btn-sm" id="wiz-next-date-btn">Available Slots &rarr;</button>
          </div>
        </div>

        <!-- STEP 5: Select Available Time Slot -->
        <div class="wizard-panel ${step === 5 ? 'active' : ''}">
          <div class="form-group" style="margin-bottom:0;">
            <label style="margin-bottom:8px; font-weight:700;">Step 5: Select Time Slot</label>
            <p style="font-size:11px; color:var(--text-secondary); margin-bottom:12px;">Generating slots for ${this.wizardState.doctorName} on ${this.wizardState.date}:</p>
            <div class="slots-grid" id="wiz-slots-container">
              <!-- Dynamically rendered slots -->
              ${this.generateSlotsHtml(state)}
            </div>
          </div>
          <div style="display:flex; justify-content:space-between; margin-top:20px;">
            <button class="btn btn-secondary btn-sm wiz-prev-btn">&larr; Back</button>
          </div>
        </div>

        <!-- STEP 6: Confirm Booking -->
        <div class="wizard-panel ${step === 6 ? 'active' : ''}">
          <div class="form-group" style="margin-bottom:0;">
            <label style="margin-bottom:12px; font-weight:700;">Step 6: Review & Confirm</label>
            <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-color); border-radius:8px; padding:16px; font-size:12.5px; display:flex; flex-direction:column; gap:10px; line-height:1.4;">
              <div><span class="text-muted" style="width:110px; display:inline-block;">Patient File:</span> <strong>${this.wizardState.patientName}</strong></div>
              <div><span class="text-muted" style="width:110px; display:inline-block;">Department:</span> <strong>${this.wizardState.department}</strong></div>
              <div><span class="text-muted" style="width:110px; display:inline-block;">Physician:</span> <strong>${this.wizardState.doctorName}</strong></div>
              <div><span class="text-muted" style="width:110px; display:inline-block;">Date / Time:</span> <strong>${this.wizardState.date} | ${this.wizardState.time}</strong></div>
              <div style="border-top:1px solid var(--border-color); padding-top:10px; margin-top:4px;">
                <label for="wiz-notes" style="font-size:11px; text-transform:uppercase; color:var(--text-muted); font-weight:700; display:block; margin-bottom:6px;">Visit Notes / Reason</label>
                <input type="text" class="form-control" id="wiz-notes" value="${this.wizardState.notes}" placeholder="e.g. Regular diagnostic follow-up" style="width:100%;">
              </div>
            </div>
          </div>
          <div style="display:flex; justify-content:space-between; margin-top:20px;">
            <button class="btn btn-secondary btn-sm wiz-prev-btn">&larr; Back</button>
            <button class="btn btn-primary btn-sm" id="wiz-submit-booking-btn">Confirm Slot Booking</button>
          </div>
        </div>
      </div>
    `;
  },

  generateSlotsHtml(state) {
    // Standard schedule slots
    const standardSlots = ["09:00 AM", "10:30 AM", "11:45 AM", "01:30 PM", "02:45 PM", "04:00 PM", "05:15 PM"];
    
    // Filter doctor booked appointments on that specific date
    const bookedSlots = state.appointments
      .filter(a => a.doctorId === this.wizardState.doctorId && a.date === this.wizardState.date && a.status !== "Cancelled")
      .map(a => a.time);

    return standardSlots.map(slot => {
      const isBooked = bookedSlots.includes(slot);
      const isSelected = this.wizardState.time === slot;
      return `
        <button class="slot-btn ${isBooked ? 'disabled' : ''} ${isSelected ? 'selected' : ''}" 
                data-value="${slot}" 
                ${isBooked ? 'disabled' : ''}>
          ${slot}
        </button>
      `;
    }).join('');
  },

  attachListeners(container, state, actions) {
    // Check-in action from queue card
    const checkinBtns = container.querySelectorAll(".btn-checkin-q");
    checkinBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        const appt = actions.updateAppointmentStatus(id, "Checked-In");
        actions.addAuditLog("Patient Check-in", `Appointment ${id}`, `${appt.patientName} checked-in at front desk.`);
        actions.addNotification("Queue Intake", `${appt.patientName} entered active waiting queue.`);
        this.render(container, state, actions);
      });
    });

    // Start Consultation action
    const consultBtns = container.querySelectorAll(".btn-consult-q");
    consultBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        const appt = actions.updateAppointmentStatus(id, "Consulting");
        actions.addAuditLog("Consultation Started", `Appointment ${id}`, `${appt.patientName} began check-up with ${appt.doctorName}`);
        actions.addNotification("Consultation Begun", `${appt.patientName} is now consulting with ${appt.doctorName}.`);
        this.render(container, state, actions);
      });
    });

    // Complete Consultation (Discharge) action
    const completeBtns = container.querySelectorAll(".btn-complete-q");
    completeBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        const appt = actions.updateAppointmentStatus(id, "Completed");
        
        // System Integration: recalculate continuity score automatically
        const patient = state.patients.find(p => p.id === appt.patientId);
        if (patient) {
          patient.metrics.attendance = Math.min(100, patient.metrics.attendance + 10);
          patient.metrics.followups = Math.min(100, patient.metrics.followups + 15);
          
          import("../engine.js").then(({ engine }) => {
            patient.continuityScore = engine.calculateContinuityScore(patient.metrics);
            patient.riskLevel = engine.evaluateRiskLevel(patient.continuityScore, patient.riskFactors);
            actions.updatePatientMetrics(patient.id, patient.metrics);
          });
        }
        
        actions.addAuditLog("Consultation Finalized", `Appointment ${id}`, `Discharged ${appt.patientName} following physician checkout`);
        actions.addNotification("Outpatient Discharged", `${appt.patientName} successfully completed their visit.`);
        
        // Auto-generate invoice
        const randomInvoiceId = "inv-" + Math.floor(Math.random() * 1000);
        const newInvoice = {
          id: randomInvoiceId,
          patientName: appt.patientName,
          date: "2026-06-06",
          description: `Outpatient consultation with ${appt.doctorName} (${appt.notes})`,
          amount: 150.00,
          status: "Unpaid"
        };
        state.invoices.push(newInvoice);
        localStorage.setItem("ms360_invoices", JSON.stringify(state.invoices));
        actions.addAuditLog("Invoice Generated", `Invoice #${randomInvoiceId}`, `Created billing fee of $150.00 for ${appt.patientName}`);
        
        this.render(container, state, actions);
      });
    });

    // Cancel / Missed appointment
    const cancelBtns = container.querySelectorAll(".btn-cancel-q");
    cancelBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        const appt = actions.updateAppointmentStatus(id, "Cancelled");
        
        // System Integration: Patient misses appointment -> risk score recalculates automatically!
        const patient = state.patients.find(p => p.id === appt.patientId);
        if (patient) {
          patient.metrics.attendance = Math.max(0, patient.metrics.attendance - 15);
          patient.metrics.followups = Math.max(0, patient.metrics.followups - 10);
          
          // Add missed checkup risk factor
          const missedFactor = `Missed scheduled clinic slot on ${appt.date} with ${appt.doctorName}`;
          if (!patient.riskFactors.includes(missedFactor)) {
            patient.riskFactors.push(missedFactor);
          }
          
          import("../engine.js").then(({ engine }) => {
            patient.continuityScore = engine.calculateContinuityScore(patient.metrics);
            patient.riskLevel = engine.evaluateRiskLevel(patient.continuityScore, patient.riskFactors);
            actions.updatePatientMetrics(patient.id, patient.metrics);
            actions.addAuditLog("Risk Profile Overrun", `Patient ${patient.name}`, `Flagged compliance decline. Continuity Score drops to ${patient.continuityScore}%`);
          });
        }

        actions.addAuditLog("Appointment Cancelled", `Appointment ${id}`, `Cancelled visit for ${appt.patientName}`);
        actions.addNotification("Appointment Cancelled", `Visit slot for ${appt.patientName} was cancelled.`);
        this.render(container, state, actions);
      });
    });

    // WIZARD INTERACTIVE ACTIONS
    
    // Step 1: Patient Search Input Filter
    const searchInput = container.querySelector("#wiz-patient-search");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.wizardState.patientSearch = e.target.value;
        this.render(container, state, actions);
        // Retain focus
        const refocused = container.querySelector("#wiz-patient-search");
        if (refocused) {
          refocused.focus();
          refocused.setSelectionRange(refocused.value.length, refocused.value.length);
        }
      });
    }

    // Step 1: Patient Selection Click
    const patientItems = container.querySelectorAll(".wiz-patient-item");
    patientItems.forEach(item => {
      item.addEventListener("click", (e) => {
        const id = item.getAttribute("data-id");
        const name = item.getAttribute("data-name");
        this.wizardState.patientId = id;
        this.wizardState.patientName = name;
        this.wizardState.step = 2; // Move to step 2
        this.render(container, state, actions);
      });
    });

    // Step 2: Department Selection Click
    const deptItems = container.querySelectorAll(".wiz-dept-item");
    deptItems.forEach(item => {
      item.addEventListener("click", (e) => {
        const value = item.getAttribute("data-value");
        this.wizardState.department = value;
        this.wizardState.step = 3; // Move to step 3
        this.render(container, state, actions);
      });
    });

    // Step 3: Doctor Selection Click
    const doctorItems = container.querySelectorAll(".wiz-doctor-item");
    doctorItems.forEach(item => {
      item.addEventListener("click", (e) => {
        const id = item.getAttribute("data-id");
        const name = item.getAttribute("data-name");
        this.wizardState.doctorId = id;
        this.wizardState.doctorName = name;
        this.wizardState.step = 4; // Move to step 4
        this.render(container, state, actions);
      });
    });

    // Step 4: Date Selection Input Next
    const dateNextBtn = container.querySelector("#wiz-next-date-btn");
    if (dateNextBtn) {
      dateNextBtn.addEventListener("click", () => {
        const dateInput = container.querySelector("#wiz-appt-date").value;
        if (!dateInput) {
          alert("Error: Please select a valid appointment date.");
          return;
        }
        this.wizardState.date = dateInput;
        this.wizardState.step = 5; // Move to step 5
        this.render(container, state, actions);
      });
    }

    // Step 5: Time Slot Selection Click
    const slotBtns = container.querySelectorAll(".slot-btn:not(.disabled)");
    slotBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const value = btn.getAttribute("data-value");
        this.wizardState.time = value;
        this.wizardState.step = 6; // Move to step 6
        this.render(container, state, actions);
      });
    });

    // Step 6: Confirmation Submission
    const submitBtn = container.querySelector("#wiz-submit-booking-btn");
    if (submitBtn) {
      submitBtn.addEventListener("click", () => {
        const notesInput = container.querySelector("#wiz-notes").value.trim();
        this.wizardState.notes = notesInput || "Routine Review Consultation";

        // Add the appointment in the database
        actions.addAppointment({
          patientId: this.wizardState.patientId,
          patientName: this.wizardState.patientName,
          doctorId: this.wizardState.doctorId,
          doctorName: this.wizardState.doctorName,
          date: this.wizardState.date,
          time: this.wizardState.time,
          status: "Scheduled",
          notes: this.wizardState.notes
        });

        // System Integration: MMV timeline updates automatically on appointment added
        const patient = state.patients.find(p => p.id === this.wizardState.patientId);
        if (patient) {
          patient.history.unshift({
            id: "h-" + Math.floor(Math.random() * 10000),
            date: this.wizardState.date,
            type: "vitals", // maps to scheduled visit
            title: `Appointment Scheduled`,
            body: `Consultation session booked with ${this.wizardState.doctorName} in ${this.wizardState.department} for reason: "${this.wizardState.notes}"`,
            doc: this.wizardState.doctorName
          });
          
          // Re-evaluate Continuity parameters
          patient.metrics.attendance = Math.min(100, patient.metrics.attendance + 5);
          import("../engine.js").then(({ engine }) => {
            patient.continuityScore = engine.calculateContinuityScore(patient.metrics);
            patient.riskLevel = engine.evaluateRiskLevel(patient.continuityScore, patient.riskFactors);
            actions.updatePatientMetrics(patient.id, patient.metrics);
          });
        }

        // Add Audit Trail & Notification logs
        actions.addAuditLog(
          "Schedule Slot Booked", 
          `Patient ${this.wizardState.patientName}`, 
          `Scheduled review with ${this.wizardState.doctorName} on ${this.wizardState.date} at ${this.wizardState.time}`
        );
        actions.addNotification(
          "Appointment Scheduled", 
          `Booked appointment for ${this.wizardState.patientName} with ${this.wizardState.doctorName} on ${this.wizardState.date} at ${this.wizardState.time}`
        );

        // Reset wizard state back to Step 1
        this.wizardState = {
          step: 1,
          patientId: null,
          patientName: null,
          department: null,
          doctorId: null,
          doctorName: null,
          date: "2026-06-06",
          time: null,
          notes: "",
          patientSearch: ""
        };

        // Re-render
        this.render(container, state, actions);
      });
    }

    // Back Buttons (Previous)
    const prevBtns = container.querySelectorAll(".wiz-prev-btn");
    prevBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        if (this.wizardState.step > 1) {
          this.wizardState.step--;
          this.render(container, state, actions);
        }
      });
    });
  }
};
