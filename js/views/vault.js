// MediSync 360 - Medical Memory Vault View

export const vaultView = {
  render(container, state, actions) {
    const selectedPatient = state.patients.find(p => p.id === state.selectedPatientId) || state.patients[0];
    
    // Default filter state stored on local element/dataset if needed, but we can manage local filters easily
    const activeFilter = container.dataset.filter || "all";
    const searchQuery = container.dataset.query || "";
    
    // Filter history records
    let filteredHistory = selectedPatient.history.filter(h => {
      // Type filter
      if (activeFilter !== "all" && h.type !== activeFilter) return false;
      // Search text query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return h.title.toLowerCase().includes(query) || h.body.toLowerCase().includes(query) || h.doc.toLowerCase().includes(query);
      }
      return true;
    });

    let html = `
      <div class="page-fade-in">
        <h2 class="page-heading">Medical Memory Vault</h2>
        <p class="page-subheading">Chronological clinical story of patient health records.</p>
        
        <!-- Patient Info Header -->
        <div class="card" style="margin-bottom: 24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
            <div class="patient-profile-header" style="border:none; padding-bottom:0; margin-bottom:0;">
              <div class="patient-avatar">${selectedPatient.name[0]}</div>
              <div class="patient-meta-details">
                <div style="display:flex; align-items:center; gap:12px;">
                  <h3 style="font-size:20px; margin:0;">${selectedPatient.name}</h3>
                  <span class="badge badge-teal">${selectedPatient.condition}</span>
                </div>
                <p style="margin-top:4px; font-size:13px; color:var(--text-secondary);">
                  ${selectedPatient.gender}, ${selectedPatient.age} years old | Contact: ${selectedPatient.phone}
                </p>
              </div>
            </div>
            
            <div style="display:flex; gap:24px;">
              <div style="text-align:center;">
                <div style="font-size:11px; text-transform:uppercase; color:var(--text-muted); font-weight:700; margin-bottom:4px;">Continuity Score</div>
                <span class="badge ${selectedPatient.continuityScore > 75 ? 'badge-green' : selectedPatient.continuityScore > 50 ? 'badge-orange' : 'badge-red'}" style="font-size:14px; padding: 6px 12px;">
                  ${selectedPatient.continuityScore}/100
                </span>
              </div>
              <div style="text-align:center;">
                <div style="font-size:11px; text-transform:uppercase; color:var(--text-muted); font-weight:700; margin-bottom:4px;">Select Patient File</div>
                <select class="role-select" id="vault-patient-selector" style="width: 180px; padding: 6px 10px;">
                  ${state.patients.map(p => `
                    <option value="${p.id}" ${p.id === selectedPatient.id ? 'selected' : ''}>${p.name}</option>
                  `).join('')}
                </select>
              </div>
            </div>
          </div>
          
          <!-- Core Vitals Sub-Row -->
          <div style="border-top:1px solid var(--border-color); padding-top: 16px; margin-top: 18px; display:grid; grid-template-columns: repeat(5, 1fr); gap:16px;">
            <div>
              <div style="font-size:11px; color:var(--text-muted); margin-bottom:2px;">Blood Pressure</div>
              <strong style="font-size:14px;">${selectedPatient.vitals.bp} mmHg</strong>
            </div>
            <div>
              <div style="font-size:11px; color:var(--text-muted); margin-bottom:2px;">Heart Rate</div>
              <strong style="font-size:14px;">${selectedPatient.vitals.hr} bpm</strong>
            </div>
            <div>
              <div style="font-size:11px; color:var(--text-muted); margin-bottom:2px;">Respiratory Rate</div>
              <strong style="font-size:14px;">${selectedPatient.vitals.rr} rpm</strong>
            </div>
            <div>
              <div style="font-size:11px; color:var(--text-muted); margin-bottom:2px;">Temperature</div>
              <strong style="font-size:14px;">${selectedPatient.vitals.temp}</strong>
            </div>
            <div>
              <div style="font-size:11px; color:var(--text-muted); margin-bottom:2px;">Weight</div>
              <strong style="font-size:14px;">${selectedPatient.vitals.weight}</strong>
            </div>
          </div>
        </div>
        
        <!-- Filter & Search Bar -->
        <div class="filter-bar">
          <div class="filter-group">
            <button class="filter-btn ${activeFilter === 'all' ? 'active' : ''}" data-filter="all">All Records</button>
            <button class="filter-btn ${activeFilter === 'diagnoses' ? 'active' : ''}" data-filter="diagnoses">Diagnoses</button>
            <button class="filter-btn ${activeFilter === 'prescriptions' ? 'active' : ''}" data-filter="prescriptions">Prescriptions</button>
            <button class="filter-btn ${activeFilter === 'labs' ? 'active' : ''}" data-filter="labs">Lab Results</button>
            <button class="filter-btn ${activeFilter === 'vitals' ? 'active' : ''}" data-filter="vitals">Vitals</button>
          </div>
          <div class="header-search" style="width: 260px; padding: 6px 12px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" id="vault-search-input" value="${searchQuery}" placeholder="Search clinical notes..." style="font-size: 12px; margin-left: 6px;">
          </div>
        </div>
        
        <!-- Timeline Container -->
        <div class="card">
          ${filteredHistory.length === 0 ? `
            <div style="text-align:center; padding: 40px 0; color:var(--text-muted);">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:16px; opacity:0.5;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p>No medical records match the current filter or search criteria.</p>
            </div>
          ` : `
            <div class="timeline">
              ${filteredHistory.map(h => {
                let badgeClass = "badge-teal";
                let dotIcon = "D";
                
                if (h.type === 'prescriptions') {
                  badgeClass = "badge-orange";
                  dotIcon = "💊";
                } else if (h.type === 'labs') {
                  badgeClass = "badge-blue";
                  dotIcon = "🧪";
                } else if (h.type === 'vitals') {
                  badgeClass = "badge-green";
                  dotIcon = "📊";
                } else if (h.type === 'diagnoses') {
                  badgeClass = "badge-red";
                  dotIcon = "🩺";
                }
                
                return `
                  <div class="timeline-item">
                    <div class="timeline-dot ${h.type}">
                      <span style="font-size:11px;">${dotIcon}</span>
                    </div>
                    <div class="timeline-content">
                      <div class="timeline-header">
                        <div>
                          <span class="badge ${badgeClass}" style="margin-bottom:6px; text-transform: uppercase; font-size:9px;">${h.type}</span>
                          <h4 class="timeline-title">${h.title}</h4>
                        </div>
                        <span class="timeline-date">${h.date}</span>
                      </div>
                      <p class="timeline-body">${h.body}</p>
                      <div class="timeline-footer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        <span>Recorded by: <strong>${h.doc}</strong></span>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>
      </div>
    `;

    container.innerHTML = html;
    this.attachListeners(container, state, actions);
  },

  attachListeners(container, state, actions) {
    // Patient selector
    const patientSelector = container.querySelector("#vault-patient-selector");
    if (patientSelector) {
      patientSelector.addEventListener("change", (e) => {
        actions.changePatient(e.target.value);
        // Reset local filters on patient switch
        container.dataset.filter = "all";
        container.dataset.query = "";
        this.render(container, state, actions);
      });
    }

    // Filter Buttons
    const filterBtns = container.querySelectorAll(".filter-btn");
    filterBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const filter = e.target.getAttribute("data-filter");
        container.dataset.filter = filter;
        this.render(container, state, actions);
      });
    });

    // Search bar
    const searchInput = container.querySelector("#vault-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        container.dataset.query = e.target.value;
        // Simple debouncing (optional, but vanilla is fast enough)
        this.render(container, state, actions);
        // Refocus and move cursor to end
        const refocused = container.querySelector("#vault-search-input");
        refocused.focus();
        refocused.setSelectionRange(refocused.value.length, refocused.value.length);
      });
    }
  }
};
