// MediSync 360 - Application Core Router and State Manager

import { db } from "./data.js";
import { engine } from "./engine.js";

// Import Views
import { dashboardView } from "./views/dashboard.js";
import { vaultView } from "./views/vault.js";
import { scheduleView } from "./views/schedule.js";
import { riskView } from "./views/risk.js";
import { familyView } from "./views/family.js";
import { billingView } from "./views/billing.js";
import { logsView } from "./views/logs.js";
import { analyticsView } from "./views/analytics.js";
import { patientManagementView } from "./views/patientManagement.js";
import { doctorManagementView } from "./views/doctorManagement.js";

const VIEW_MAP = {
  "Dashboard": dashboardView,
  "MemoryVault": vaultView,
  "Appointments": scheduleView,
  "PatientManagement": patientManagementView,
  "DoctorManagement": doctorManagementView,
  "RiskTracker": riskView,
  "FamilyHub": familyView,
  "Billing": billingView,
  "AuditLogs": logsView,
  "Analytics": analyticsView
};

class App {
  constructor() {
    // Application State
    this.state = {
      currentRole: localStorage.getItem("ms360_active_role") || "Hospital Administrator",
      activePage: "Dashboard",
      selectedPatientId: null,
      selectedDependentId: null,
      patients: [],
      doctors: [],
      appointments: [],
      invoices: [],
      auditLogs: [],
      notifications: []
    };

    // DOM Elements
    this.contentPane = document.getElementById("content-pane");
    this.roleSelector = document.getElementById("role-selector");
    this.roleBadge = document.getElementById("header-role-badge");
    this.notifBtn = document.getElementById("notification-btn");
    this.notifDrawer = document.getElementById("notification-drawer");
    this.notifList = document.getElementById("notification-list");
    this.notifBadge = document.getElementById("notification-badge");
    this.notifClose = document.getElementById("notification-close");
    this.navLinks = document.querySelectorAll(".nav-item a");
    
    // Core bound actions exposed to views
    this.actions = {
      changePatient: (id) => this.changePatient(id),
      changeDependent: (id) => this.changeDependent(id),
      updateDoctorStatus: (id, status) => this.updateDoctorStatus(id, status),
      addAppointment: (appt) => this.addAppointment(appt),
      updateAppointmentStatus: (id, status) => this.updateAppointmentStatus(id, status),
      payInvoice: (id) => this.payInvoice(id),
      addAuditLog: (action, target, details) => this.addAuditLog(action, target, details),
      addNotification: (title, desc) => this.addNotification(title, desc),
      updatePatientMetrics: (id, metrics) => this.updatePatientMetrics(id, metrics),
      navigate: (page) => this.navigate(page),
      addPatient: (patient) => this.addPatient(patient),
      updatePatient: (patient) => this.updatePatient(patient),
      archivePatient: (id) => this.archivePatient(id),
      addDoctor: (doctor) => this.addDoctor(doctor),
      updateDoctor: (doctor) => this.updateDoctor(doctor),
      reassignAppointment: (apptId, newDocId, newTime) => this.reassignAppointment(apptId, newDocId, newTime)
    };
  }

  init() {
    this.loadStateFromDb();
    
    // Default ID selections
    if (this.state.patients.length > 0) {
      this.state.selectedPatientId = this.state.patients[0].id;
      const dependentPatient = this.state.patients.find(p => p.caregiver !== null);
      this.state.selectedDependentId = dependentPatient ? dependentPatient.id : this.state.patients[0].id;
    }

    // Register Event Listeners
    this.bindEvents();
    
    // Initial Render
    this.navigate(this.state.activePage);
  }

  loadStateFromDb() {
    this.state.patients = db.getPatients();
    this.state.doctors = db.getDoctors();
    this.state.appointments = db.getAppointments();
    this.state.invoices = db.getInvoices();
    this.state.auditLogs = db.getAuditLogs();
    this.state.notifications = db.getNotifications();
    
    this.updateNotificationBadge();
  }

  bindEvents() {
    // Role Switcher
    if (this.roleSelector) {
      this.roleSelector.value = this.state.currentRole;
      this.roleSelector.addEventListener("change", (e) => {
        const oldRole = this.state.currentRole;
        const newRole = e.target.value;
        this.state.currentRole = newRole;
        localStorage.setItem("ms360_active_role", newRole);
        
        // Log the role change
        this.addAuditLog("Switch Portal Role", `System Session`, `Changed user access profile from ${oldRole} to ${newRole}`);
        this.addNotification("Access Level Switch", `Switched viewing perspective to ${newRole}.`);
        
        this.roleBadge.innerText = newRole;
        this.navigate(this.state.activePage);
      });
    }

    // Notification Drawer toggles
    if (this.notifBtn) {
      this.notifBtn.addEventListener("click", () => {
        this.notifDrawer.classList.toggle("open");
        if (this.notifDrawer.classList.contains("open")) {
          this.renderNotifications();
          db.clearNotifications();
          this.state.notifications.forEach(n => n.unread = false);
          this.updateNotificationBadge();
        }
      });
    }

    if (this.notifClose) {
      this.notifClose.addEventListener("click", () => {
        this.notifDrawer.classList.remove("open");
      });
    }

    // Sidebar navigation clicks
    this.navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const page = link.getAttribute("data-page");
        this.navigate(page);
      });
    });

    // Close notifications panel on clicking outside
    document.addEventListener("click", (e) => {
      if (this.notifDrawer && this.notifBtn && 
          !this.notifDrawer.contains(e.target) && 
          !this.notifBtn.contains(e.target) && 
          this.notifDrawer.classList.contains("open")) {
        this.notifDrawer.classList.remove("open");
      }
    });
  }

  // Mutators and state updates
  changePatient(id) {
    this.state.selectedPatientId = id;
  }

  changeDependent(id) {
    this.state.selectedDependentId = id;
  }

  updateDoctorStatus(id, status) {
    const doc = db.updateDoctorStatus(id, status);
    this.loadStateFromDb();
    
    // Check for affected appointments (today or upcoming)
    let affected = [];
    if (status === "Offline" || status === "Surgery" || status === "Emergency") {
      affected = this.state.appointments.filter(a => a.doctorId === id && (a.status === "Scheduled" || a.status === "Checked-In"));
    }
    return { doc, affected };
  }

  addPatient(patient) {
    const p = db.addPatient(patient);
    this.loadStateFromDb();
    return p;
  }

  updatePatient(patient) {
    const updated = db.updatePatient(patient);
    this.loadStateFromDb();
    return updated;
  }

  archivePatient(id) {
    const archived = db.archivePatient(id);
    this.loadStateFromDb();
    return archived;
  }

  addDoctor(doctor) {
    const d = db.addDoctor(doctor);
    this.loadStateFromDb();
    return d;
  }

  updateDoctor(doctor) {
    const updated = db.updateDoctor(doctor);
    this.loadStateFromDb();
    return updated;
  }

  reassignAppointment(apptId, newDocId, newTime) {
    const appts = db.getAppointments();
    const appt = appts.find(a => a.id === apptId);
    if (appt) {
      const docs = db.getDoctors();
      const newDoc = docs.find(d => d.id === newDocId);
      if (newDoc) {
        const oldDocName = appt.doctorName;
        appt.doctorId = newDocId;
        appt.doctorName = newDoc.name;
        if (newTime) {
          appt.time = newTime;
        }
        db.saveAppointments(appts);
        this.loadStateFromDb();
        
        // Log & Notify
        this.addAuditLog("Reassign Appointment", `Appointment ${apptId}`, `Reassigned patient ${appt.patientName} from ${oldDocName} to ${newDoc.name}`);
        this.addNotification("Appointment Reassigned", `Scheduled ${appt.patientName} with ${newDoc.name} on ${appt.date} at ${appt.time}`);
        return appt;
      }
    }
    return null;
  }

  addAppointment(appt) {
    db.addAppointment(appt);
    this.loadStateFromDb();
  }

  updateAppointmentStatus(id, status) {
    const updated = db.updateAppointmentStatus(id, status);
    this.loadStateFromDb();
    return updated;
  }

  payInvoice(id) {
    const paid = db.payInvoice(id);
    this.loadStateFromDb();
    return paid;
  }

  addAuditLog(action, target, details) {
    db.addAuditLog(this.state.currentRole + " User", this.state.currentRole, action, target, details);
    this.loadStateFromDb();
  }

  addNotification(title, desc) {
    db.addNotification(title, desc);
    this.loadStateFromDb();
  }

  updatePatientMetrics(id, metrics) {
    const patient = this.state.patients.find(p => p.id === id);
    if (patient) {
      patient.metrics = metrics;
      patient.continuityScore = engine.calculateContinuityScore(metrics);
      patient.riskLevel = engine.evaluateRiskLevel(patient.continuityScore, patient.riskFactors);
      db.updatePatient(patient);
      this.loadStateFromDb();
    }
  }

  updateNotificationBadge() {
    const unreadCount = this.state.notifications.filter(n => n.unread).length;
    if (unreadCount > 0) {
      this.notifBadge.style.display = "block";
    } else {
      this.notifBadge.style.display = "none";
    }
  }

  renderNotifications() {
    if (this.state.notifications.length === 0) {
      this.notifList.innerHTML = `<li style="padding:24px; text-align:center; color:var(--text-muted); font-size:12px;">No notifications yet.</li>`;
      return;
    }

    this.notifList.innerHTML = this.state.notifications.map(n => `
      <li class="notif-item ${n.unread ? 'unread' : ''}">
        <div class="notif-item-title">${n.title}</div>
        <div class="notif-item-desc">${n.desc}</div>
        <div class="notif-item-time">${n.time}</div>
      </li>
    `).join('');
  }

  navigate(page) {
    this.state.activePage = page;

    // Update active nav styling
    this.navLinks.forEach(link => {
      const parent = link.parentElement;
      if (link.getAttribute("data-page") === page) {
        parent.classList.add("active");
      } else {
        parent.classList.remove("active");
      }
    });

    // Resolve View and render
    const view = VIEW_MAP[page];
    if (view) {
      this.contentPane.dataset.filter = "all"; // Reset filters on navigation
      this.contentPane.dataset.query = "";
      view.render(this.contentPane, this.state, this.actions);
    } else {
      this.contentPane.innerHTML = `<div class="card"><h3>Page Not Found</h3><p>Route "${page}" could not be resolved.</p></div>`;
    }
  }
}

// Bootstrap on window load
window.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.init();
});
