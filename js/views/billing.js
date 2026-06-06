// MediSync 360 - Billing & Payments View

export const billingView = {
  render(container, state, actions) {
    const invoices = state.invoices;
    
    // Calculations
    const totalPaid = invoices.filter(i => i.status === "Paid").reduce((acc, curr) => acc + curr.amount, 0);
    const totalOutstanding = invoices.filter(i => i.status === "Unpaid").reduce((acc, curr) => acc + curr.amount, 0);

    let html = `
      <div class="page-fade-in">
        <h2 class="page-heading">Billing & Financial Claims</h2>
        <p class="page-subheading">Manage out-of-pocket invoice settlement and transaction logs.</p>
        
        <!-- Summary Cards -->
        <div class="grid-container cols-3" style="margin-bottom: 24px;">
          <div class="card card-glow-teal">
            <div class="card-title">Settled Invoices <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="12" y1="4" x2="12" y2="20"/><line x1="2" y1="12" x2="22" y2="12"/></svg></div>
            <div class="card-value">$${totalPaid.toFixed(2)}</div>
            <div class="card-desc">Total processed payments</div>
          </div>
          <div class="card card-glow-blue" style="border-left: 4px solid var(--color-warning);">
            <div class="card-title">Outstanding Balance <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></div>
            <div class="card-value" style="color: var(--color-warning);">$${totalOutstanding.toFixed(2)}</div>
            <div class="card-desc">Pending out-of-pocket settlement</div>
          </div>
          <div class="card">
            <div class="card-title">Billing Completion Index <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
            <div class="card-value">${invoices.length > 0 ? Math.round((invoices.filter(i => i.status === 'Paid').length / invoices.length) * 100) : 0}%</div>
            <div class="card-desc">Paid versus generated invoices</div>
          </div>
        </div>

        <!-- Ledger Table -->
        <div class="card">
          <h3 class="card-title">Hospital Invoice Ledger</h3>
          <div class="table-wrapper" style="margin-top: 16px;">
            <table class="custom-table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Date</th>
                  <th>Patient File</th>
                  <th>Description</th>
                  <th>Claim Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${invoices.map(inv => `
                  <tr>
                    <td><strong>#${inv.id}</strong></td>
                    <td>${inv.date}</td>
                    <td><strong>${inv.patientName}</strong></td>
                    <td class="text-secondary">${inv.description}</td>
                    <td><strong>$${inv.amount.toFixed(2)}</strong></td>
                    <td>
                      <span class="badge ${inv.status === 'Paid' ? 'badge-green' : 'badge-orange'}">
                        ${inv.status}
                      </span>
                    </td>
                    <td>
                      ${inv.status === 'Unpaid' ? `
                        <button class="btn btn-primary btn-sm btn-pay-inv" data-id="${inv.id}">Pay Invoice</button>
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
      </div>
    `;

    container.innerHTML = html;
    this.attachListeners(container, state, actions);
  },

  attachListeners(container, state, actions) {
    const payBtns = container.querySelectorAll(".btn-pay-inv");
    payBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        const inv = actions.payInvoice(id);
        
        actions.addAuditLog("Payment Settled", `Invoice #${id}`, `SaaS Portal payment of $${inv.amount.toFixed(2)} received for ${inv.patientName}.`);
        actions.addNotification("Invoice Settled", `Invoice #${id} was marked as Paid successfully.`);
        
        // Refresh view
        this.render(container, state, actions);
      });
    });
  }
};
