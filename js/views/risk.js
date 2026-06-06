// MediSync 360 - Follow-Up Risk Tracker View

export const riskView = {
  render(container, state, actions) {
    // Sort patients so High and Medium risk are at the top
    const sortedPatients = [...state.patients].sort((a, b) => {
      const riskWeight = { "High": 3, "Medium": 2, "Low": 1 };
      return riskWeight[b.riskLevel] - riskWeight[a.riskLevel];
    });

    let html = `
      <div class="page-fade-in">
        <h2 class="page-heading">Follow-Up Risk Tracker</h2>
        <p class="page-subheading">Intelligent predictive indexing to flag and re-engage patients at risk of treatment abandonment.</p>
        
        <!-- Risk Overview Widgets -->
        <div class="grid-container cols-3" style="margin-bottom: 24px;">
          <div class="card card-glow-blue" style="border-left: 4px solid var(--color-danger);">
            <div class="card-title">High Risk Patients</div>
            <div class="card-value">${state.patients.filter(p => p.riskLevel === 'High').length}</div>
            <div class="card-desc">Require immediate intervention</div>
          </div>
          <div class="card" style="border-left: 4px solid var(--color-warning);">
            <div class="card-title">Medium Risk Patients</div>
            <div class="card-value">${state.patients.filter(p => p.riskLevel === 'Medium').length}</div>
            <div class="card-desc">Monitored for compliance decline</div>
          </div>
          <div class="card" style="border-left: 4px solid var(--color-success);">
            <div class="card-title">Low Risk Patients</div>
            <div class="card-value">${state.patients.filter(p => p.riskLevel === 'Low').length}</div>
            <div class="card-desc">Adhering to treatment parameters</div>
          </div>
        </div>

        <!-- Patients Risk Ledger -->
        <div class="card">
          <h3 class="card-title">Clinical Risk Assessment Ledger</h3>
          <div style="margin-top: 16px; display: flex; flex-direction: column; gap: 18px;">
            ${sortedPatients.map(p => {
              let riskBadge = "badge-green";
              let borderStyle = "border-color: var(--border-color);";
              if (p.riskLevel === "High") {
                riskBadge = "badge-red";
                borderStyle = "border-left: 4px solid var(--color-danger); border-color: rgba(239, 68, 68, 0.15);";
              } else if (p.riskLevel === "Medium") {
                riskBadge = "badge-orange";
                borderStyle = "border-left: 4px solid var(--color-warning); border-color: rgba(245, 158, 11, 0.15);";
              }
              
              return `
                <div class="card" style="${borderStyle} padding: 18px 24px; background: rgba(255, 255, 255, 0.01);">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px;">
                    <div>
                      <div style="display:flex; align-items:center; gap:10px;">
                        <h4 style="font-size:16px; font-weight:700;">${p.name}</h4>
                        <span class="badge ${riskBadge}">${p.riskLevel} Risk</span>
                        <span class="text-secondary" style="font-size:12px;">Age ${p.age} • ${p.condition}</span>
                      </div>
                      
                      <!-- Risk Factors -->
                      <div class="risk-factor-list" style="margin-top:12px;">
                        ${p.riskFactors.length === 0 ? `
                          <div style="font-size:12px; color:var(--color-success); display:flex; align-items:center; gap:6px;">
                            ✓ No active risk warning triggers detected. Patient is compliant.
                          </div>
                        ` : p.riskFactors.map(factor => `
                          <div class="risk-factor-item">${factor}</div>
                        `).join('')}
                      </div>
                    </div>
                    
                    <!-- Scoring & Intervention UI -->
                    <div style="display:flex; flex-direction:column; align-items:flex-end; gap:8px;">
                      <div style="font-size:12px; color:var(--text-secondary);">
                        Continuity Score: <strong style="color:var(--text-primary); font-size:14px;">${p.continuityScore}%</strong>
                      </div>
                      
                      <div style="display:flex; gap:8px; margin-top:4px;">
                        <button class="btn btn-secondary btn-sm btn-view-patient-vault" data-id="${p.id}">View Vault</button>
                        ${p.riskLevel !== 'Low' ? `
                          <select class="role-select select-intervention btn-sm" data-id="${p.id}" style="width: auto; padding: 4px 10px;">
                            <option value="" disabled selected>Trigger Intervention</option>
                            <option value="sms">Send SMS Reminder</option>
                            <option value="call">Call Care Coordinator</option>
                            <option value="caregiver">Escalate to Caregiver</option>
                            <option value="home">Dispatch Home Health Visit</option>
                          </select>
                        ` : `
                          <span class="badge badge-teal" style="font-size:10px;">✓ Maintenance Mode</span>
                        `}
                      </div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
    this.attachListeners(container, state, actions);
  },

  attachListeners(container, state, actions) {
    // View Vault
    const viewVaultBtns = container.querySelectorAll(".btn-view-patient-vault");
    viewVaultBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        actions.changePatient(id);
        actions.navigate("MemoryVault");
      });
    });

    // Select Intervention
    const selects = container.querySelectorAll(".select-intervention");
    selects.forEach(select => {
      select.addEventListener("change", (e) => {
        const patientId = e.target.getAttribute("data-id");
        const actionType = e.target.value;
        const patient = state.patients.find(p => p.id === patientId);
        
        if (!patient) return;
        
        let actionLabel = "";
        let metricBoost = 0;
        
        switch (actionType) {
          case "sms":
            actionLabel = "SMS Treatment Compliance Campaign";
            metricBoost = 5;
            break;
          case "call":
            actionLabel = "Cardiology/Endocrinology Nurse Call Outreach";
            metricBoost = 10;
            break;
          case "caregiver":
            actionLabel = "Caregiver Escalation Check-in";
            metricBoost = 8;
            break;
          case "home":
            actionLabel = "Mobile Home Health Visit Dispatch";
            metricBoost = 20;
            break;
        }

        // Simulate intervention success: boost compliance metrics, recalculate score, clear random risk factor if score climbs
        patient.metrics.medication = Math.min(100, patient.metrics.medication + metricBoost);
        patient.metrics.followups = Math.min(100, patient.metrics.followups + metricBoost);
        patient.metrics.attendance = Math.min(100, patient.metrics.attendance + (metricBoost / 2));
        
        import("../engine.js").then(({ engine }) => {
          patient.continuityScore = engine.calculateContinuityScore(patient.metrics);
          
          // If score improves past threshold, start clearing risk factors
          if (patient.continuityScore > 65 && patient.riskFactors.length > 0) {
            patient.riskFactors.pop();
          }
          if (patient.continuityScore > 80) {
            patient.riskFactors = [];
          }
          
          patient.riskLevel = engine.evaluateRiskLevel(patient.continuityScore, patient.riskFactors);
          
          actions.updatePatientMetrics(patient.id, patient.metrics);
          actions.addAuditLog("Intervention Triggered", `Patient ${patient.name}`, `Dispatched: ${actionLabel}`);
          actions.addNotification("Intervention Deployed", `${actionLabel} triggered for ${patient.name}. Continuity score boosted.`);
          
          // Re-render
          this.render(container, state, actions);
        });
      });
    });
  }
};
