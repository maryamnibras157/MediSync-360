// MediSync 360 - Audit & Compliance Logs View

export const logsView = {
  render(container, state, actions) {
    const activeRoleFilter = container.dataset.roleFilter || "all";
    const searchQuery = container.dataset.searchQuery || "";

    // Filter audit logs
    const filteredLogs = state.auditLogs.filter(log => {
      // Role filter
      if (activeRoleFilter !== "all" && log.role !== activeRoleFilter) return false;
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return log.actor.toLowerCase().includes(query) || 
               log.action.toLowerCase().includes(query) || 
               log.target.toLowerCase().includes(query) || 
               log.details.toLowerCase().includes(query);
      }
      return true;
    });

    let html = `
      <div class="page-fade-in">
        <h2 class="page-heading">Audit & Compliance Trace</h2>
        <p class="page-subheading">HIPAA-compliant system logs recording database accesses, prescription logs, and patient records view audits.</p>
        
        <!-- Filter Bar -->
        <div class="filter-bar">
          <div class="filter-group">
            <span style="font-size:12px; align-self:center; color:var(--text-secondary); margin-right:6px;">Role Filter:</span>
            <button class="filter-btn ${activeRoleFilter === 'all' ? 'active' : ''}" data-role="all">All Roles</button>
            <button class="filter-btn ${activeRoleFilter === 'Doctor' ? 'active' : ''}" data-role="Doctor">Doctor</button>
            <button class="filter-btn ${activeRoleFilter === 'Nurse' ? 'active' : ''}" data-role="Nurse">Nurse</button>
            <button class="filter-btn ${activeRoleFilter === 'Receptionist' ? 'active' : ''}" data-role="Receptionist">Receptionist</button>
            <button class="filter-btn ${activeRoleFilter === 'System' ? 'active' : ''}" data-role="System">System</button>
          </div>
          
          <div style="display:flex; gap:10px;">
            <div class="header-search" style="width: 240px; padding: 6px 12px;">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" id="log-search-input" value="${searchQuery}" placeholder="Search audit trails..." style="font-size:12px; margin-left:6px;">
            </div>
            <button class="btn btn-secondary btn-sm" id="btn-export-logs">Export CSV</button>
          </div>
        </div>

        <!-- Logs Table -->
        <div class="card">
          <h3 class="card-title">Security & Compliance Log Roster</h3>
          <div class="table-wrapper" style="margin-top:16px;">
            <table class="custom-table" style="font-size: 12px;">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Actor ID</th>
                  <th>Security Role</th>
                  <th>Action</th>
                  <th>Target Resource</th>
                  <th>Operational Details</th>
                </tr>
              </thead>
              <tbody>
                ${filteredLogs.length === 0 ? `<tr><td colspan="6" class="text-muted" style="text-align:center; padding:30px 0;">No audit records found.</td></tr>` : ''}
                ${filteredLogs.map(log => {
                  let roleBadge = "badge-teal";
                  if (log.role === "Nurse") roleBadge = "badge-green";
                  else if (log.role === "Receptionist") roleBadge = "badge-blue";
                  else if (log.role === "System") roleBadge = "badge-red";
                  else if (log.role === "Caregiver") roleBadge = "badge-orange";
                  
                  return `
                    <tr>
                      <td><code>${log.timestamp}</code></td>
                      <td><strong>${log.actor}</strong></td>
                      <td><span class="badge ${roleBadge}" style="font-size:9px; padding:2px 6px;">${log.role}</span></td>
                      <td><strong>${log.action}</strong></td>
                      <td>${log.target}</td>
                      <td class="text-secondary">${log.details}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
    this.attachListeners(container, state, actions);
  },

  attachListeners(container, state, actions) {
    // Role filters
    const filterBtns = container.querySelectorAll(".filter-btn");
    filterBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const role = e.target.getAttribute("data-role");
        container.dataset.roleFilter = role;
        this.render(container, state, actions);
      });
    });

    // Search bar
    const searchInput = container.querySelector("#log-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        container.dataset.searchQuery = e.target.value;
        this.render(container, state, actions);
        const refocused = container.querySelector("#log-search-input");
        refocused.focus();
        refocused.setSelectionRange(refocused.value.length, refocused.value.length);
      });
    }

    // Export Logs
    const exportBtn = container.querySelector("#btn-export-logs");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        let csvContent = "Timestamp,Actor,Role,Action,Target,Details\n";
        state.auditLogs.forEach(l => {
          csvContent += `"${l.timestamp}","${l.actor}","${l.role}","${l.action}","${l.target}","${l.details}"\n`;
        });
        
        // Dynamic file download simulation
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `medisync_360_audit_log_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        actions.addAuditLog("Export Audit Logs", "System Admin", "Exported database activity logs to CSV format");
        actions.addNotification("Logs Exported", "Audit CSV successfully compiled and downloaded.");
      });
    }
  }
};
