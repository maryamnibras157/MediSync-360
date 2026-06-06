// MediSync 360 - Analytics Center & Healthcare Continuity Engine

export const analyticsView = {
  render(container, state, actions) {
    const selectedPatient = state.patients.find(p => p.id === state.selectedPatientId) || state.patients[0];
    
    // Calculate dashboard aggregate statistics
    const avgWait = state.appointments.filter(a => a.status === "Checked-In").length * 15;
    const completedAppts = state.appointments.filter(a => a.status === "Completed");
    const completionRate = state.appointments.length > 0 ? Math.round((completedAppts.length / state.appointments.length) * 100) : 0;
    
    // Average Continuity Score in database
    const avgContinuityScore = Math.round(state.patients.reduce((sum, p) => sum + p.continuityScore, 0) / state.patients.length);

    let html = `
      <div class="page-fade-in">
        <h2 class="page-heading">Analytics Center & Continuity Engine</h2>
        <p class="page-subheading">Operational hospital bottlenecks and mathematical parameters determining care longitudinal adherence scores.</p>
        
        <!-- Tabbed Navigation between Analytics and Engine -->
        <div class="filter-bar" style="padding: 10px 20px; margin-bottom: 24px;">
          <div class="filter-group">
            <button class="filter-btn active" id="tab-btn-ops">Operations Analytics</button>
            <button class="filter-btn" id="tab-btn-engine">Healthcare Continuity Engine</button>
          </div>
        </div>

        <!-- Section 1: Operations Analytics Tab -->
        <div id="panel-ops-analytics">
          <div class="grid-container cols-2">
            <!-- SVG Line Chart: Appointment Attendance Trend -->
            <div class="card">
              <h3 class="card-title">Continuity Trend Index (Past 5 Months)</h3>
              <p class="text-muted" style="font-size:11px; margin-bottom:14px;">Average monthly continuity index score tracking client engagement.</p>
              
              <svg class="chart-svg" viewBox="0 0 500 200">
                <defs>
                  <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="var(--color-primary)" />
                    <stop offset="100%" stop-color="var(--color-secondary)" />
                  </linearGradient>
                  <linearGradient id="area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="var(--color-primary)" stop-opacity="0.25" />
                    <stop offset="100%" stop-color="var(--color-primary)" stop-opacity="0.0" />
                  </linearGradient>
                </defs>
                
                <!-- Grid Lines -->
                <line class="chart-grid" x1="50" y1="30" x2="470" y2="30" />
                <line class="chart-grid" x1="50" y1="80" x2="470" y2="80" />
                <line class="chart-grid" x1="50" y1="130" x2="470" y2="130" />
                <line class="chart-grid" x1="50" y1="180" x2="470" y2="180" />
                
                <!-- Chart Area Fill -->
                <path class="chart-area" d="M 50 180 L 50 140 L 155 120 L 260 150 L 365 105 L 470 70 L 470 180 Z" />
                
                <!-- Chart Line -->
                <path class="chart-line" d="M 50 140 Q 102.5 130 155 120 T 260 150 T 365 105 T 470 70" />
                
                <!-- Data Nodes -->
                <circle class="chart-dot" cx="50" cy="140" r="4.5" />
                <circle class="chart-dot" cx="155" cy="120" r="4.5" />
                <circle class="chart-dot" cx="260" cy="150" r="4.5" />
                <circle class="chart-dot" cx="365" cy="105" r="4.5" />
                <circle class="chart-dot" cx="470" cy="70" r="4.5" />
                
                <!-- Labels -->
                <text class="chart-axis-text" x="50" y="194">Feb</text>
                <text class="chart-axis-text" x="155" y="194">Mar</text>
                <text class="chart-axis-text" x="260" y="194">Apr</text>
                <text class="chart-axis-text" x="365" y="194">May</text>
                <text class="chart-axis-text" x="470" y="194">June</text>
                
                <text class="chart-axis-text" x="30" y="142">52</text>
                <text class="chart-axis-text" x="30" y="122">64</text>
                <text class="chart-axis-text" x="30" y="152">48</text>
                <text class="chart-axis-text" x="30" y="107">72</text>
                <text class="chart-axis-text" x="30" y="72">85</text>
              </svg>
            </div>
            
            <!-- Doctor utilization charts (Vertical Bars in SVG) -->
            <div class="card">
              <h3 class="card-title">Physician Capacity Utilization</h3>
              <p class="text-muted" style="font-size:11px; margin-bottom:14px;">Percentage of daily slots filled vs total slots available.</p>
              
              <svg class="chart-svg" viewBox="0 0 500 200">
                <!-- Grid -->
                <line class="chart-grid" x1="50" y1="180" x2="470" y2="180" />
                
                <!-- Bars (Height 180 is zero, 30 is 100%) -->
                <!-- Dr. Bailey (85%) -> Y: 180 - 150*0.85 = 52.5, Height: 127.5 -->
                <rect x="75" y="52.5" width="36" height="127.5" fill="var(--color-primary)" rx="4" style="opacity:0.85;" />
                <text class="chart-axis-text" x="93" y="44" font-weight="700">85%</text>
                
                <!-- Dr. Watson (70%) -> Y: 180 - 150*0.70 = 75, Height: 105 -->
                <rect x="165" y="75" width="36" height="105" fill="var(--color-secondary)" rx="4" style="opacity:0.85;" />
                <text class="chart-axis-text" x="183" y="66" font-weight="700">70%</text>
                
                <!-- Dr. Strange (90%) -> Y: 180 - 150*0.90 = 45, Height: 135 -->
                <rect x="255" y="45" width="36" height="135" fill="var(--color-info)" rx="4" style="opacity:0.85;" />
                <text class="chart-axis-text" x="273" y="36" font-weight="700">90%</text>
                
                <!-- Dr. Grey (50%) -> Y: 180 - 150*0.50 = 105, Height: 75 -->
                <rect x="345" y="105" width="36" height="75" fill="var(--color-success)" rx="4" style="opacity:0.85;" />
                <text class="chart-axis-text" x="363" y="96" font-weight="700">50%</text>
                
                <!-- Dr. House (0%) -> Height 0 -->
                <rect x="435" y="178" width="36" height="2" fill="var(--color-danger)" rx="1" style="opacity:0.85;" />
                <text class="chart-axis-text" x="453" y="168" font-weight="700">0%</text>
                
                <!-- Labels -->
                <text class="chart-axis-text" x="93" y="194">Bailey</text>
                <text class="chart-axis-text" x="183" y="194">Watson</text>
                <text class="chart-axis-text" x="273" y="194">Strange</text>
                <text class="chart-axis-text" x="363" y="194">Grey</text>
                <text class="chart-axis-text" x="453" y="194">House</text>
              </svg>
            </div>
          </div>

          <!-- Operations stats ledger -->
          <div class="card">
            <h3 class="card-title">Hospital Performance Metric Log</h3>
            <div style="margin-top:16px; display:grid; grid-template-columns: repeat(3, 1fr); gap:24px; text-align:center;">
              <div style="background: rgba(255,255,255,0.01); border: 1px solid var(--border-color); padding: 18px; border-radius:8px;">
                <div style="font-size:12px; color:var(--text-secondary); margin-bottom:8px;">Lobby Queue Wait Index</div>
                <div style="font-size:24px; font-weight:700; color:var(--color-primary);">${avgWait} mins</div>
                <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">Average triage to consult delay</div>
              </div>
              <div style="background: rgba(255,255,255,0.01); border: 1px solid var(--border-color); padding: 18px; border-radius:8px;">
                <div style="font-size:12px; color:var(--text-secondary); margin-bottom:8px;">Appointment Completion Rate</div>
                <div style="font-size:24px; font-weight:700; color:var(--color-secondary);">${completionRate}%</div>
                <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">Consults completed vs scheduled</div>
              </div>
              <div style="background: rgba(255,255,255,0.01); border: 1px solid var(--border-color); padding: 18px; border-radius:8px;">
                <div style="font-size:12px; color:var(--text-secondary); margin-bottom:8px;">Average Network Continuity</div>
                <div style="font-size:24px; font-weight:700; color:var(--color-success);">${avgContinuityScore}/100</div>
                <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">Global patient compliance score average</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 2: Healthcare Continuity Engine Panel -->
        <div id="panel-engine" style="display:none;">
          <div class="grid-container cols-2-3">
            <!-- Left Panel: Calculator / Sliders -->
            <div class="card card-glow-teal">
              <h3 class="card-title">Continuity Formula Simulator</h3>
              <p class="text-muted" style="font-size:11px; margin-bottom:16px;">Tweak the 4 weighted pillars to simulate score transitions.</p>
              
              <div style="margin-bottom: 20px;">
                <label style="font-size:12px; font-weight:600; color:var(--text-secondary); margin-bottom:8px; display:block;">Select Patient File</label>
                <select class="role-select" id="engine-patient-selector" style="width:100%;">
                  ${state.patients.map(p => `
                    <option value="${p.id}" ${p.id === selectedPatient.id ? 'selected' : ''}>${p.name}</option>
                  `).join('')}
                </select>
              </div>
              
              <div style="display:flex; flex-direction:column; gap:16px;">
                <!-- Slider 1 -->
                <div class="form-group">
                  <div style="display:flex; justify-content:space-between; font-size:12px;">
                    <span style="font-weight:600;">Appointment Attendance (40%)</span>
                    <span id="label-val-attendance" style="color:var(--color-primary); font-weight:700;">${selectedPatient.metrics.attendance}%</span>
                  </div>
                  <input type="range" class="form-control slider-calc" id="slider-attendance" min="0" max="100" value="${selectedPatient.metrics.attendance}" style="padding:0; height:6px;">
                </div>
                
                <!-- Slider 2 -->
                <div class="form-group">
                  <div style="display:flex; justify-content:space-between; font-size:12px;">
                    <span style="font-weight:600;">Medication Adherence (30%)</span>
                    <span id="label-val-medication" style="color:var(--color-primary); font-weight:700;">${selectedPatient.metrics.medication}%</span>
                  </div>
                  <input type="range" class="form-control slider-calc" id="slider-medication" min="0" max="100" value="${selectedPatient.metrics.medication}" style="padding:0; height:6px;">
                </div>
                
                <!-- Slider 3 -->
                <div class="form-group">
                  <div style="display:flex; justify-content:space-between; font-size:12px;">
                    <span style="font-weight:600;">Follow-Up Checkups (20%)</span>
                    <span id="label-val-followups" style="color:var(--color-primary); font-weight:700;">${selectedPatient.metrics.followups}%</span>
                  </div>
                  <input type="range" class="form-control slider-calc" id="slider-followups" min="0" max="100" value="${selectedPatient.metrics.followups}" style="padding:0; height:6px;">
                </div>
                
                <!-- Slider 4 -->
                <div class="form-group">
                  <div style="display:flex; justify-content:space-between; font-size:12px;">
                    <span style="font-weight:600;">Report Submission (10%)</span>
                    <span id="label-val-reports" style="color:var(--color-primary); font-weight:700;">${selectedPatient.metrics.reports}%</span>
                  </div>
                  <input type="range" class="form-control slider-calc" id="slider-reports" min="0" max="100" value="${selectedPatient.metrics.reports}" style="padding:0; height:6px;">
                </div>
              </div>
              
              <button class="btn btn-primary" id="btn-save-simulated-score" style="width:100%; margin-top:20px;">Save Score Configuration</button>
            </div>
            
            <!-- Right Panel: Live Visual Output -->
            <div class="card">
              <h3 class="card-title">Live Score Recalculation Engine</h3>
              
              <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding: 30px 0; border-bottom:1px solid var(--border-color); margin-bottom:20px;">
                <!-- Large Circle Score -->
                <div class="radial-progress-container">
                  <div class="radial-progress" style="width:180px; height:180px;">
                    <svg style="transform: rotate(-90deg); width:180px; height:180px;">
                      <circle class="radial-bg" cx="90" cy="90" r="75" stroke-width="12" />
                      <circle class="radial-fill" id="sim-radial-fill" cx="90" cy="90" r="75" stroke-width="12" style="stroke-dasharray: 471; stroke-dashoffset: ${471 - (471 * selectedPatient.continuityScore) / 100}" />
                    </svg>
                    <div class="radial-text">
                      <span class="radial-score" id="sim-radial-score" style="font-size:48px;">${selectedPatient.continuityScore}</span>
                      <span class="radial-label" style="font-size:12px;">Simulated Score</span>
                    </div>
                  </div>
                </div>
                
                <div style="margin-top:20px; text-align:center;">
                  <div style="font-size:14px; font-weight:600; color:var(--text-secondary);">Calculated Risk Status</div>
                  <div id="sim-risk-badge" class="badge ${selectedPatient.riskLevel === 'High' ? 'badge-red' : selectedPatient.riskLevel === 'Medium' ? 'badge-orange' : 'badge-green'}" style="font-size:16px; padding:6px 16px; margin-top:6px;">
                    ${selectedPatient.riskLevel} Risk
                  </div>
                </div>
              </div>
              
              <!-- Math Description -->
              <h4 style="font-size:13px; font-weight:600; margin-bottom:8px;">Continuity Coefficient Formula:</h4>
              <p class="text-secondary" style="font-size:12px; line-height:1.5;">
                <code>Score = (Attendance * 0.40) + (Medication * 0.30) + (FollowUps * 0.20) + (Reports * 0.10)</code>
                <br><br>
                High scores (≥75) represent high patient compliance and low treatment relapse risks. Reductions below 50 auto-flag patients as High Risk in the Hospital Registry database.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
    this.attachListeners(container, state, actions);
  },

  attachListeners(container, state, actions) {
    // Panel Tabs Toggling
    const tabOps = container.querySelector("#tab-btn-ops");
    const tabEngine = container.querySelector("#tab-btn-engine");
    const panelOps = container.querySelector("#panel-ops-analytics");
    const panelEngine = container.querySelector("#panel-engine");
    
    if (tabOps && tabEngine) {
      tabOps.addEventListener("click", () => {
        tabOps.classList.add("active");
        tabEngine.classList.remove("active");
        panelOps.style.display = "block";
        panelEngine.style.display = "none";
      });
      
      tabEngine.addEventListener("click", () => {
        tabEngine.classList.add("active");
        tabOps.classList.remove("active");
        panelOps.style.display = "none";
        panelEngine.style.display = "block";
      });
    }

    // Engine Patient Selector
    const enginePatientSelector = container.querySelector("#engine-patient-selector");
    if (enginePatientSelector) {
      enginePatientSelector.addEventListener("change", (e) => {
        actions.changePatient(e.target.value);
        this.render(container, state, actions);
        // Ensure engine panel stays active after re-render!
        container.querySelector("#tab-btn-engine").click();
      });
    }

    // Sliders math updating
    const sliders = container.querySelectorAll(".slider-calc");
    sliders.forEach(slider => {
      slider.addEventListener("input", () => {
        const attendance = parseInt(container.querySelector("#slider-attendance").value);
        const medication = parseInt(container.querySelector("#slider-medication").value);
        const followups = parseInt(container.querySelector("#slider-followups").value);
        const reports = parseInt(container.querySelector("#slider-reports").value);
        
        // Update slider value text labels
        container.querySelector("#label-val-attendance").innerText = attendance + "%";
        container.querySelector("#label-val-medication").innerText = medication + "%";
        container.querySelector("#label-val-followups").innerText = followups + "%";
        container.querySelector("#label-val-reports").innerText = reports + "%";
        
        // Calculate score
        import("../engine.js").then(({ engine }) => {
          const score = engine.calculateContinuityScore({ attendance, medication, followups, reports });
          const patient = state.patients.find(p => p.id === state.selectedPatientId) || state.patients[0];
          const risk = engine.evaluateRiskLevel(score, patient.riskFactors);
          
          // Update visual nodes in real-time!
          const scoreText = container.querySelector("#sim-radial-score");
          const radialFill = container.querySelector("#sim-radial-fill");
          const riskBadge = container.querySelector("#sim-risk-badge");
          
          if (scoreText) scoreText.innerText = score;
          if (radialFill) {
            // Stroke dasharray is 471, dashoffset: 471 - (471 * score) / 100
            radialFill.style.strokeDashoffset = 471 - (471 * score) / 100;
          }
          
          if (riskBadge) {
            riskBadge.innerText = risk + " Risk";
            riskBadge.className = `badge ${risk === 'High' ? 'badge-red' : risk === 'Medium' ? 'badge-orange' : 'badge-green'}`;
          }
        });
      });
    });

    // Save simulation
    const saveBtn = container.querySelector("#btn-save-simulated-score");
    if (saveBtn) {
      saveBtn.addEventListener("click", () => {
        const attendance = parseInt(container.querySelector("#slider-attendance").value);
        const medication = parseInt(container.querySelector("#slider-medication").value);
        const followups = parseInt(container.querySelector("#slider-followups").value);
        const reports = parseInt(container.querySelector("#slider-reports").value);
        
        const activePatient = state.patients.find(p => p.id === state.selectedPatientId) || state.patients[0];
        
        activePatient.metrics = { attendance, medication, followups, reports };
        
        import("../engine.js").then(({ engine }) => {
          activePatient.continuityScore = engine.calculateContinuityScore(activePatient.metrics);
          activePatient.riskLevel = engine.evaluateRiskLevel(activePatient.continuityScore, activePatient.riskFactors);
          
          actions.updatePatientMetrics(activePatient.id, activePatient.metrics);
          actions.addAuditLog("Recalculate Continuity", `Patient ${activePatient.name}`, `Set metrics: Att ${attendance}%, Med ${medication}%, Fol ${followups}%, Rep ${reports}%`);
          actions.addNotification("Continuity Metrics Saved", `${activePatient.name}'s proprietary continuity parameters updated successfully.`);
          
          // Re-render and trigger tab click
          this.render(container, state, actions);
          container.querySelector("#tab-btn-engine").click();
        });
      });
    }
  }
};
