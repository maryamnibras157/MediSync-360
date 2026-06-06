// MediSync 360 - Family Health Hub View

export const familyView = {
  render(container, state, actions) {
    // Dependents are patients who have caregiver info populated
    const dependents = state.patients.filter(p => p.caregiver !== null);
    
    // Select default dependent if none selected
    const activeDependentId = state.selectedDependentId || (dependents[0] ? dependents[0].id : null);
    const activeDependent = state.patients.find(p => p.id === activeDependentId);
    
    if (!activeDependent) {
      container.innerHTML = `
        <div class="page-fade-in card" style="text-align:center; padding: 50px;">
          <h3>No Family Connections Found</h3>
          <p class="text-muted">Register dependents to link profiles to a single caregiver portal.</p>
        </div>
      `;
      return;
    }

    const caregiverName = activeDependent.caregiver.name;
    const relation = activeDependent.caregiver.relation;
    
    // Joint upcoming schedules for all dependents
    const dependentIds = dependents.map(d => d.id);
    const jointAppointments = state.appointments.filter(a => dependentIds.includes(a.patientId) && a.status === "Scheduled");

    let html = `
      <div class="page-fade-in">
        <h2 class="page-heading">Family Health Hub</h2>
        <p class="page-subheading">Centralized portal for designated family caregivers managing health compliance and schedules for dependents.</p>
        
        <!-- Caregiver header -->
        <div class="card" style="margin-bottom: 24px; border-left: 4px solid var(--color-secondary);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
            <div>
              <h3 style="font-size:16px; font-weight:700;">Authorized Primary Caregiver Profile</h3>
              <p style="font-size:13px; color:var(--text-secondary); margin-top:2px;">
                Name: <strong>${caregiverName}</strong> | Authorized Contact: ${activeDependent.caregiver.phone}
              </p>
            </div>
            
            <div style="display:flex; align-items:center; gap:12px;">
              <span>Select Dependent Profile:</span>
              <select class="role-select" id="hub-dependent-selector" style="width: 200px;">
                ${dependents.map(d => `
                  <option value="${d.id}" ${d.id === activeDependent.id ? 'selected' : ''}>${d.name} (${d.caregiver.relation})</option>
                `).join('')}
              </select>
            </div>
          </div>
        </div>

        <div class="grid-container cols-2-3">
          <!-- Left side: Dependent Details -->
          <div style="display:flex; flex-direction:column; gap:24px;">
            <div class="card card-glow-teal">
              <h3 class="card-title">Dependent File: ${activeDependent.name}</h3>
              
              <div class="patient-profile-header" style="margin-top:20px; border-bottom: 1px solid var(--border-color); padding-bottom:16px;">
                <div class="patient-avatar">${activeDependent.name[0]}</div>
                <div class="patient-meta-details">
                  <h3>${activeDependent.name}</h3>
                  <p>Gender: ${activeDependent.gender} | Age: ${activeDependent.age}</p>
                  <p style="color:var(--color-primary); font-weight:600; margin-top:4px;">Condition: ${activeDependent.condition}</p>
                </div>
              </div>
              
              <!-- Compliance details -->
              <div style="margin-top:16px;">
                <h4 style="font-size:13px; font-weight:600; color:var(--text-secondary); margin-bottom:12px;">Treatment Compliance Indexes</h4>
                <div style="display:flex; flex-direction:column; gap:12px;">
                  <div>
                    <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px;">
                      <span>Appointment Attendance Rate</span>
                      <strong>${activeDependent.metrics.attendance}%</strong>
                    </div>
                    <div style="background:rgba(255,255,255,0.05); height:6px; border-radius:3px; overflow:hidden;">
                      <div style="background:var(--color-primary); width:${activeDependent.metrics.attendance}%; height:100%;"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px;">
                      <span>Medication Adherence Checklist</span>
                      <strong>${activeDependent.metrics.medication}%</strong>
                    </div>
                    <div style="background:rgba(255,255,255,0.05); height:6px; border-radius:3px; overflow:hidden;">
                      <div style="background:var(--color-secondary); width:${activeDependent.metrics.medication}%; height:100%;"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Core Vitals summary -->
              <div style="border-top:1px solid var(--border-color); padding-top:16px; margin-top:18px; display:grid; grid-template-columns: repeat(2, 1fr); gap:12px; font-size:12px;">
                <div>
                  <span class="text-muted">BP:</span> <strong>${activeDependent.vitals.bp} mmHg</strong>
                </div>
                <div>
                  <span class="text-muted">Pulse:</span> <strong>${activeDependent.vitals.hr} bpm</strong>
                </div>
                <div>
                  <span class="text-muted">Temp:</span> <strong>${activeDependent.vitals.temp}</strong>
                </div>
                <div>
                  <span class="text-muted">Weight:</span> <strong>${activeDependent.vitals.weight}</strong>
                </div>
              </div>
            </div>
            
            <!-- Care Actions -->
            <div class="card">
              <h3 class="card-title">Quick Care Logs</h3>
              <p class="text-muted" style="font-size:11px; margin-bottom:12px;">Record caregiving compliance actions directly.</p>
              <div style="display:flex; flex-direction:column; gap:8px;">
                <button class="btn btn-secondary btn-sm btn-family-log" data-type="med" style="text-align:left; justify-content:flex-start;">
                  💊 Log Medication Administered
                </button>
                <button class="btn btn-secondary btn-sm btn-family-log" data-type="reports" style="text-align:left; justify-content:flex-start;">
                  📄 Upload Home Blood Glucose Log
                </button>
                <button class="btn btn-primary btn-sm btn-family-vault-link">
                  Open Complete Medical Memory Vault
                </button>
              </div>
            </div>
          </div>
          
          <!-- Right side: Coordinated Family Schedule -->
          <div class="card">
            <h3 class="card-title">Grouped Family Schedule (Upcoming Reviews)</h3>
            <p class="text-muted" style="font-size:11px; margin-bottom:14px;">Coordinated calendar list for all linked dependent appointments.</p>
            
            <div class="table-wrapper">
              <table class="custom-table">
                <thead>
                  <tr>
                    <th>Family Member</th>
                    <th>Date / Time</th>
                    <th>Physician</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  ${jointAppointments.length === 0 ? `<tr><td colspan="4" class="text-muted" style="text-align:center; padding: 20px 0;">No upcoming coordinated appointments.</td></tr>` : ''}
                  ${jointAppointments.map(apt => {
                    const relationLabel = state.patients.find(p => p.id === apt.patientId).caregiver.relation;
                    return `
                      <tr>
                        <td>
                          <strong>${apt.patientName}</strong>
                          <div style="font-size:10px; color:var(--text-muted);">${relationLabel}</div>
                        </td>
                        <td>
                          <strong>${apt.date}</strong>
                          <div style="font-size:11px; color:var(--color-primary);">${apt.time}</div>
                        </td>
                        <td>${apt.doctorName}</td>
                        <td class="text-muted">${apt.notes}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
    this.attachListeners(container, state, actions);
  },

  attachListeners(container, state, actions) {
    // Dependent Selector
    const selector = container.querySelector("#hub-dependent-selector");
    if (selector) {
      selector.addEventListener("change", (e) => {
        actions.changeDependent(e.target.value);
        this.render(container, state, actions);
      });
    }

    // Vault link click
    const vaultLinkBtn = container.querySelector(".btn-family-vault-link");
    if (vaultLinkBtn) {
      vaultLinkBtn.addEventListener("click", () => {
        const dependents = state.patients.filter(p => p.caregiver !== null);
        const activeId = state.selectedDependentId || (dependents[0] ? dependents[0].id : null);
        actions.changePatient(activeId);
        actions.navigate("MemoryVault");
      });
    }

    // Family quick log buttons
    const logBtns = container.querySelectorAll(".btn-family-log");
    logBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const logType = e.target.getAttribute("data-type");
        const dependents = state.patients.filter(p => p.caregiver !== null);
        const activeId = state.selectedDependentId || (dependents[0] ? dependents[0].id : null);
        const patient = state.patients.find(p => p.id === activeId);
        
        if (!patient) return;
        
        let actionMsg = "";
        if (logType === "med") {
          patient.metrics.medication = Math.min(100, patient.metrics.medication + 10);
          actionMsg = "Logged evening prescription administration compliance.";
          
          patient.history.unshift({
            id: "h-" + Math.floor(Math.random() * 10000),
            date: new Date().toISOString().split('T')[0],
            type: "vitals",
            title: "Caregiver Med Admin Logged",
            body: `Medication verified and administered by primary caregiver ${patient.caregiver.name} (${patient.caregiver.relation}).`,
            doc: `Caregiver Log`
          });
        } else if (logType === "reports") {
          patient.metrics.reports = Math.min(100, patient.metrics.reports + 15);
          actionMsg = "Uploaded weekly blood glucose logs.";
          
          patient.history.unshift({
            id: "h-" + Math.floor(Math.random() * 10000),
            date: new Date().toISOString().split('T')[0],
            type: "labs",
            title: "Caregiver Glucometer Data Uploaded",
            body: `Caregiver uploaded patient's blood glucose log. Average fasting reading: 114 mg/dL.`,
            doc: `Caregiver Log`
          });
        }

        import("../engine.js").then(({ engine }) => {
          patient.continuityScore = engine.calculateContinuityScore(patient.metrics);
          patient.riskLevel = engine.evaluateRiskLevel(patient.continuityScore, patient.riskFactors);
          
          actions.updatePatientMetrics(patient.id, patient.metrics);
          actions.addAuditLog("Caregiver Action", `Patient ${patient.name}`, `Caregiver logged: ${actionMsg}`);
          actions.addNotification("Dependent Log Recorded", `Successfully updated compliance logs for ${patient.name}.`);
          this.render(container, state, actions);
        });
      });
    });
  }
};
