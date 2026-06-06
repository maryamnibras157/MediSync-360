// MediSync 360 - Mock Database Store

const DEFAULT_PATIENTS = [
  {
    id: "pat-1",
    name: "Jane Doe",
    age: 34,
    gender: "Female",
    phone: "+1 (555) 019-2834",
    email: "jane.doe@email.com",
    condition: "Chronic Hypertension",
    department: "Cardiology",
    vitals: { bp: "122/80", hr: 72, temp: "98.6°F", rr: 16, weight: "145 lbs" },
    continuityScore: 85,
    metrics: { attendance: 90, medication: 85, followups: 80, reports: 90 },
    riskLevel: "Low",
    riskFactors: [],
    caregiver: null,
    history: [
      { id: "h-1", date: "2026-06-01", type: "diagnoses", title: "Stage 1 Hypertension", body: "Diagnosed with mild hypertension after elevated readings over three office visits. Recommended low-sodium diet and lifestyle modification.", doc: "Dr. Miranda Bailey" },
      { id: "h-2", date: "2026-06-01", type: "prescriptions", title: "Lisinopril 10mg QD", body: "Start lisinopril 10 mg orally once daily. Monitor blood pressure and renal function/potassium in 2 weeks.", doc: "Dr. Miranda Bailey" },
      { id: "h-3", date: "2026-06-02", type: "vitals", title: "Vital Signs Logged", body: "Blood Pressure: 122/80 mmHg, Heart Rate: 72 bpm, Weight: 145 lbs. Vitals within target range.", doc: "Nurse Clara Barton" },
      { id: "h-4", date: "2026-06-05", type: "labs", title: "Basic Metabolic Panel (BMP)", body: "Sodium: 139 mEq/L (Normal), Potassium: 4.2 mEq/L (Normal), Creatinine: 0.85 mg/dL (Normal). Renal clearance is excellent.", doc: "Dr. Miranda Bailey" }
    ]
  },
  {
    id: "pat-2",
    name: "Marcus Aurelius",
    age: 62,
    gender: "Male",
    phone: "+1 (555) 012-7744",
    email: "marcus.aurelius@rome.org",
    condition: "Post-CABG Recovery",
    department: "Cardiology",
    vitals: { bp: "145/95", hr: 88, temp: "99.1°F", rr: 18, weight: "192 lbs" },
    continuityScore: 42,
    metrics: { attendance: 50, medication: 40, followups: 30, reports: 50 },
    riskLevel: "High",
    riskFactors: ["Missed post-op cardiology check-up twice", "Discontinued Beta-Blockers due to fatigue", "Failure to submit weekly blood pressure logs"],
    caregiver: { name: "Maximus Aurelius", relation: "Son", phone: "+1 (555) 012-7799" },
    history: [
      { id: "h-5", date: "2026-04-15", type: "diagnoses", title: "Triple Vessel Coronary Disease", body: "Severe coronary atherosclerosis in three major vessels. Scheduled for urgent surgical revascularization.", doc: "Dr. Miranda Bailey" },
      { id: "h-6", date: "2026-04-18", type: "diagnoses", title: "Post-CABG Surgery Completed", body: "Successful coronary artery bypass grafting x3 using left internal mammary artery (LIMA) and saphenous vein grafts.", doc: "Dr. Miranda Bailey" },
      { id: "h-7", date: "2026-04-20", type: "prescriptions", title: "Metoprolol Succinate 50mg & Aspirin 81mg", body: "Metoprolol 50mg daily for cardioprotection and rate control. Aspirin 81mg daily for graft patency. Advised strict compliance.", doc: "Dr. Miranda Bailey" },
      { id: "h-8", date: "2026-05-10", type: "vitals", title: "Post-discharge Vitals Logged", body: "Blood Pressure: 135/88 mmHg, Heart Rate: 82 bpm. Patient complains of feeling sluggish.", doc: "Nurse Clara Barton" }
    ]
  },
  {
    id: "pat-3",
    name: "Aria Smith",
    age: 8,
    gender: "Female",
    phone: "+1 (555) 015-8822",
    email: "sarah.smith@email.com",
    condition: "Childhood Asthma",
    department: "Internal Medicine",
    vitals: { bp: "105/65", hr: 95, temp: "98.4°F", rr: 22, weight: "55 lbs" },
    continuityScore: 95,
    metrics: { attendance: 100, medication: 90, followups: 100, reports: 100 },
    riskLevel: "Low",
    riskFactors: [],
    caregiver: { name: "Sarah Smith", relation: "Mother", phone: "+1 (555) 015-8822" },
    history: [
      { id: "h-9", date: "2026-05-20", type: "diagnoses", title: "Moderate Persistent Asthma", body: "Child presents with recurrent wheezing, nocturnal coughing fits, and exercise-induced shortness of breath. Lung auscultation shows expiratory wheeze.", doc: "Dr. John Watson" },
      { id: "h-10", date: "2026-05-20", type: "prescriptions", title: "Flovent HFA 110mcg & Albuterol Inhaler", body: "Flovent: 1 puff twice daily as controller. Albuterol: 2 puffs every 4-6 hours as needed for rescue. Asthma Action Plan detailed for mother.", doc: "Dr. John Watson" },
      { id: "h-11", date: "2026-05-28", type: "labs", title: "Spirometry Pulmonary Function Test", body: "FEV1/FVC ratio is 78%, showing positive response to bronchodilators compared to initial pre-treatment baseline.", doc: "Dr. John Watson" }
    ]
  },
  {
    id: "pat-4",
    name: "Joseph Chen",
    age: 74,
    gender: "Male",
    phone: "+1 (555) 018-9911",
    email: "albert.chen@email.com",
    condition: "Type 2 Diabetes",
    department: "Internal Medicine",
    vitals: { bp: "128/82", hr: 68, temp: "98.0°F", rr: 14, weight: "178 lbs" },
    continuityScore: 62,
    metrics: { attendance: 75, medication: 60, followups: 50, reports: 65 },
    riskLevel: "Medium",
    riskFactors: ["Missed endocrinology appointment last month", "Inconsistent blood glucose reporting (only 2 times logged this week)"],
    caregiver: { name: "Albert Chen", relation: "Son", phone: "+1 (555) 018-9900" },
    history: [
      { id: "h-12", date: "2026-05-02", type: "diagnoses", title: "Type 2 Diabetes Mellitus", body: "Managed poorly on diet alone. HbA1c is 7.9%. Symptoms of mild peripheral neuropathy reported in lower extremities.", doc: "Dr. John Watson" },
      { id: "h-13", date: "2026-05-02", type: "prescriptions", title: "Metformin 1000mg BID & Gabapentin 300mg", body: "Metformin 1000mg twice daily with meals. Gabapentin 300mg at bedtime for neuropathic tingling. Daily foot inspections reinforced.", doc: "Dr. John Watson" },
      { id: "h-14", date: "2026-05-15", type: "labs", title: "Hemoglobin A1c (HbA1c) Panel", body: "HbA1c: 7.6% (Down from 7.9% in 2 weeks). Kidney panel shows normal EGFR (>90 mL/min). Progress is positive but slower than targeted.", doc: "Dr. John Watson" }
    ]
  },
  {
    id: "pat-5",
    name: "Emily Watson",
    age: 29,
    gender: "Female",
    phone: "+1 (555) 019-5432",
    email: "emily.watson@gmail.com",
    condition: "Obstetric Care (28 Wks)",
    department: "General Surgery",
    vitals: { bp: "115/70", hr: 78, temp: "98.6°F", rr: 16, weight: "138 lbs" },
    continuityScore: 78,
    metrics: { attendance: 80, medication: 80, followups: 70, reports: 85 },
    riskLevel: "Low",
    riskFactors: [],
    caregiver: null,
    history: [
      { id: "h-15", date: "2026-03-10", type: "diagnoses", title: "Single Live Intrauterine Pregnancy", body: "Routine prenatal care initiated. Estimated Due Date: August 28, 2026. Normal fetal anatomy scanned.", doc: "Dr. Meredith Grey" },
      { id: "h-16", date: "2026-05-12", type: "labs", title: "Gestational Diabetes Screen (GTT)", body: "1-hour 50g glucose loading test: 125 mg/dL. Well within normal limits (<140 mg/dL). No gestational diabetes diagnosed.", doc: "Dr. Meredith Grey" }
    ]
  },
  {
    id: "pat-6",
    name: "David Miller",
    age: 48,
    gender: "Male",
    phone: "+1 (555) 011-3322",
    email: "david.miller@domain.com",
    condition: "Chronic Kidney Disease",
    department: "Nephrology",
    vitals: { bp: "155/92", hr: 80, temp: "98.8°F", rr: 18, weight: "210 lbs" },
    continuityScore: 35,
    metrics: { attendance: 40, medication: 30, followups: 30, reports: 40 },
    riskLevel: "High",
    riskFactors: ["Missed nephrologist checkup on 2026-05-25", "Blood pressure persistently above 150/90", "Skipped renal panel tests"],
    caregiver: null,
    history: [
      { id: "h-17", date: "2026-04-05", type: "diagnoses", title: "CKD Stage 3a", body: "Moderate reduction in glomerular filtration rate. eGFR: 52 mL/min/1.73m². Urinalysis shows trace proteinuria. Urgently require BP management.", doc: "Dr. Stephen Strange" },
      { id: "h-18", date: "2026-04-05", type: "prescriptions", title: "Losartan 50mg QD", body: "Losartan 50mg daily. Primary goal is renal protection and target BP < 130/80 mmHg.", doc: "Dr. Stephen Strange" }
    ]
  }
];

const DEFAULT_DOCTORS = [
  { id: "doc-1", name: "Dr. Miranda Bailey", department: "Cardiology", specialty: "Cardiology", status: "Available", occupancy: 85, phone: "+1 (555) 010-1201", experience: 14, qualification: "MD, FACS", consultationFee: 180, shiftStart: "09:00 AM", shiftEnd: "05:00 PM", workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
  { id: "doc-2", name: "Dr. John Watson", department: "Internal Medicine", specialty: "Internal Medicine", status: "Available", occupancy: 70, phone: "+1 (555) 010-1202", experience: 10, qualification: "MD, FACP", consultationFee: 150, shiftStart: "08:30 AM", shiftEnd: "04:30 PM", workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
  { id: "doc-3", name: "Dr. Stephen Strange", department: "Neurology", specialty: "Neurology", status: "Consulting", occupancy: 90, phone: "+1 (555) 010-1203", experience: 15, qualification: "MD, PhD", consultationFee: 300, shiftStart: "10:00 AM", shiftEnd: "06:00 PM", workingDays: ["Monday", "Wednesday", "Friday"] },
  { id: "doc-4", name: "Dr. Meredith Grey", department: "General Surgery", specialty: "General Surgery", status: "On Break", occupancy: 50, phone: "+1 (555) 010-1204", experience: 12, qualification: "MD", consultationFee: 220, shiftStart: "07:00 AM", shiftEnd: "03:00 PM", workingDays: ["Tuesday", "Thursday", "Friday", "Saturday"] },
  { id: "doc-5", name: "Dr. Gregory House", department: "Nephrology", specialty: "Nephrology", status: "Offline", occupancy: 0, phone: "+1 (555) 010-1205", experience: 20, qualification: "MD", consultationFee: 250, shiftStart: "09:00 AM", shiftEnd: "05:00 PM", workingDays: ["Monday", "Tuesday", "Thursday", "Friday"] }
];

const DEFAULT_APPOINTMENTS = [
  { id: "apt-1", patientId: "pat-1", patientName: "Jane Doe", doctorId: "doc-1", doctorName: "Dr. Miranda Bailey", date: "2026-06-06", time: "10:00 AM", status: "Completed", notes: "Routine blood pressure checkup." },
  { id: "apt-2", patientId: "pat-3", patientName: "Aria Smith", doctorId: "doc-2", doctorName: "Dr. John Watson", date: "2026-06-06", time: "11:30 AM", status: "Completed", notes: "Asthma review, checking inhaler compliance." },
  { id: "apt-3", patientId: "pat-2", patientName: "Marcus Aurelius", doctorId: "doc-1", doctorName: "Dr. Miranda Bailey", date: "2026-06-06", time: "01:30 PM", status: "Checked-In", notes: "Delayed post-CABG checkup. High risk." },
  { id: "apt-4", patientId: "pat-4", patientName: "Joseph Chen", doctorId: "doc-2", doctorName: "Dr. John Watson", date: "2026-06-06", time: "03:00 PM", status: "Scheduled", notes: "Endocrine follow-up & HbA1c review." },
  { id: "apt-5", patientId: "pat-5", patientName: "Emily Watson", doctorId: "doc-4", doctorName: "Dr. Meredith Grey", date: "2026-06-07", time: "09:30 AM", status: "Scheduled", notes: "Routine prenatal scanning (3rd trimester)." },
  { id: "apt-6", patientId: "pat-6", patientName: "David Miller", doctorId: "doc-3", doctorName: "Dr. Stephen Strange", date: "2026-06-08", time: "11:00 AM", status: "Scheduled", notes: "CKD monitoring & medication adjustment." }
];

const DEFAULT_INVOICES = [
  { id: "inv-101", patientName: "Jane Doe", date: "2026-06-01", description: "Cardiology Consult + Lisinopril prescription", amount: 150.00, status: "Paid" },
  { id: "inv-102", patientName: "Marcus Aurelius", date: "2026-04-18", description: "Inpatient CABG Surgery & Room Boarding (4 days)", amount: 8200.00, status: "Paid" },
  { id: "inv-103", patientName: "Marcus Aurelius", date: "2026-05-10", description: "Outpatient Post-op vital log analysis", amount: 75.00, status: "Unpaid" },
  { id: "inv-104", patientName: "Aria Smith", date: "2026-05-28", description: "Pulmonary Spirometry Test", amount: 120.00, status: "Paid" },
  { id: "inv-105", patientName: "Joseph Chen", date: "2026-06-06", description: "Endocrinology Panel + Consultation fee", amount: 180.00, status: "Unpaid" }
];

const DEFAULT_AUDIT_LOGS = [
  { timestamp: "2026-06-06 09:12:43", actor: "receptionist_clara", role: "Receptionist", action: "Check-in", target: "Patient Jane Doe", details: "Checked in Jane Doe for Appointment #apt-1." },
  { timestamp: "2026-06-06 10:15:22", actor: "dr_bailey", role: "Doctor", action: "Access Health Records", target: "Patient Jane Doe", details: "Viewed Jane Doe's Medical Memory Vault and logged BP vitals." },
  { timestamp: "2026-06-06 10:45:10", actor: "dr_bailey", role: "Doctor", action: "Prescribe Treatment", target: "Patient Jane Doe", details: "Issued prescription for Lisinopril 10mg." },
  { timestamp: "2026-06-06 11:35:01", actor: "receptionist_clara", role: "Receptionist", action: "Check-in", target: "Patient Aria Smith", details: "Checked in Aria Smith for Appointment #apt-2." },
  { timestamp: "2026-06-06 13:02:15", actor: "system_engine", role: "System", action: "Risk Calculation", target: "Patient Marcus Aurelius", details: "Flagged patient Marcus Aurelius as HIGH RISK due to missed appointments (Continuity Score: 42)." },
  { timestamp: "2026-06-06 13:20:00", actor: "receptionist_clara", role: "Receptionist", action: "Check-in", target: "Patient Marcus Aurelius", details: "Checked in Marcus Aurelius for appointment with Dr. Bailey." }
];

const DEFAULT_NOTIFICATIONS = [
  { id: "not-1", title: "High-Risk Patient Checked In", desc: "Marcus Aurelius (High Risk, Score: 42) has checked in. Vitals alert: BP is high (145/95). Please prepare triage.", time: "15 mins ago", unread: true },
  { id: "not-2", title: "Upcoming Appointment Scheduled", desc: "Aria Smith booked an asthma follow-up for today at 11:30 AM.", time: "2 hours ago", unread: false },
  { id: "not-3", title: "Adherence Alert", desc: "David Miller missed his nephrology checkup schedule. System flagged patient for emergency intervention.", time: "1 day ago", unread: true }
];

// Load from local storage or set defaults
function initializeDb() {
  if (!localStorage.getItem("ms360_initialized")) {
    localStorage.setItem("ms360_patients", JSON.stringify(DEFAULT_PATIENTS));
    localStorage.setItem("ms360_doctors", JSON.stringify(DEFAULT_DOCTORS));
    localStorage.setItem("ms360_appointments", JSON.stringify(DEFAULT_APPOINTMENTS));
    localStorage.setItem("ms360_invoices", JSON.stringify(DEFAULT_INVOICES));
    localStorage.setItem("ms360_audit_logs", JSON.stringify(DEFAULT_AUDIT_LOGS));
    localStorage.setItem("ms360_notifications", JSON.stringify(DEFAULT_NOTIFICATIONS));
    localStorage.setItem("ms360_initialized", "true");
  } else {
    // Perform migrations on existing local storage data if needed
    const patients = JSON.parse(localStorage.getItem("ms360_patients"));
    let updatedPatients = false;
    patients.forEach(p => {
      if (!p.department) {
        const found = DEFAULT_PATIENTS.find(dp => dp.id === p.id);
        p.department = found ? found.department : "Cardiology";
        updatedPatients = true;
      }
    });
    if (updatedPatients) {
      localStorage.setItem("ms360_patients", JSON.stringify(patients));
    }

    const doctors = JSON.parse(localStorage.getItem("ms360_doctors"));
    let updatedDoctors = false;
    doctors.forEach(d => {
      if (!d.department || d.status === "Active") {
        const found = DEFAULT_DOCTORS.find(dd => dd.id === d.id);
        if (found) {
          d.department = found.department;
          d.experience = found.experience;
          d.qualification = found.qualification;
          d.consultationFee = found.consultationFee;
          d.shiftStart = found.shiftStart;
          d.shiftEnd = found.shiftEnd;
          d.workingDays = found.workingDays;
          d.status = found.status;
        } else {
          d.department = d.specialty;
          d.experience = 5;
          d.qualification = "MD";
          d.consultationFee = 100;
          d.shiftStart = "09:00 AM";
          d.shiftEnd = "05:00 PM";
          d.workingDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
          if (d.status === "Active") d.status = "Available";
        }
        updatedDoctors = true;
      }
    });
    if (updatedDoctors) {
      localStorage.setItem("ms360_doctors", JSON.stringify(doctors));
    }
  }
}

export const db = {
  getPatients() {
    initializeDb();
    return JSON.parse(localStorage.getItem("ms360_patients"));
  },
  
  savePatients(patients) {
    localStorage.setItem("ms360_patients", JSON.stringify(patients));
  },
  
  getDoctors() {
    initializeDb();
    return JSON.parse(localStorage.getItem("ms360_doctors"));
  },
  
  saveDoctors(doctors) {
    localStorage.setItem("ms360_doctors", JSON.stringify(doctors));
  },
  
  getAppointments() {
    initializeDb();
    return JSON.parse(localStorage.getItem("ms360_appointments"));
  },
  
  saveAppointments(appointments) {
    localStorage.setItem("ms360_appointments", JSON.stringify(appointments));
  },
  
  getInvoices() {
    initializeDb();
    return JSON.parse(localStorage.getItem("ms360_invoices"));
  },
  
  saveInvoices(invoices) {
    localStorage.setItem("ms360_invoices", JSON.stringify(invoices));
  },
  
  getAuditLogs() {
    initializeDb();
    return JSON.parse(localStorage.getItem("ms360_audit_logs"));
  },
  
  saveAuditLogs(logs) {
    localStorage.setItem("ms360_audit_logs", JSON.stringify(logs));
  },
  
  getNotifications() {
    initializeDb();
    return JSON.parse(localStorage.getItem("ms360_notifications"));
  },
  
  saveNotifications(notifs) {
    localStorage.setItem("ms360_notifications", JSON.stringify(notifs));
  },

  // State Mutators
  addAppointment(appt) {
    const appts = this.getAppointments();
    appts.push({
      id: "apt-" + Math.floor(Math.random() * 10000),
      ...appt
    });
    this.saveAppointments(appts);
  },

  updateAppointmentStatus(id, status) {
    const appts = this.getAppointments();
    const appt = appts.find(a => a.id === id);
    if (appt) {
      appt.status = status;
      this.saveAppointments(appts);
      return appt;
    }
    return null;
  },

  updateDoctorStatus(id, status) {
    const doctors = this.getDoctors();
    const doc = doctors.find(d => d.id === id);
    if (doc) {
      doc.status = status;
      // Change doctor occupancy based on status
      if (status === "Offline") doc.occupancy = 0;
      else if (status === "On Break") doc.occupancy = 30;
      else if (status === "Consulting") doc.occupancy = 95;
      else doc.occupancy = 70;
      this.saveDoctors(doctors);
      return doc;
    }
    return null;
  },

  payInvoice(id) {
    const invoices = this.getInvoices();
    const inv = invoices.find(i => i.id === id);
    if (inv) {
      inv.status = "Paid";
      this.saveInvoices(invoices);
      return inv;
    }
    return null;
  },

  addAuditLog(actor, role, action, target, details) {
    const logs = this.getAuditLogs();
    const now = new Date();
    const timestamp = now.getFullYear() + "-" + 
                      String(now.getMonth() + 1).padStart(2, '0') + "-" + 
                      String(now.getDate()).padStart(2, '0') + " " + 
                      String(now.getHours()).padStart(2, '0') + ":" + 
                      String(now.getMinutes()).padStart(2, '0') + ":" + 
                      String(now.getSeconds()).padStart(2, '0');
    logs.unshift({ timestamp, actor, role, action, target, details });
    this.saveAuditLogs(logs);
  },

  addNotification(title, desc) {
    const notifs = this.getNotifications();
    notifs.unshift({
      id: "not-" + Math.floor(Math.random() * 10000),
      title,
      desc,
      time: "Just now",
      unread: true
    });
    this.saveNotifications(notifs);
  },

  clearNotifications() {
    const notifs = this.getNotifications();
    notifs.forEach(n => n.unread = false);
    this.saveNotifications(notifs);
  },

  updatePatient(updatedPatient) {
    const patients = this.getPatients();
    const index = patients.findIndex(p => p.id === updatedPatient.id);
    if (index !== -1) {
      patients[index] = updatedPatient;
      this.savePatients(patients);
      return true;
    }
    return false;
  },

  addPatient(patient) {
    const patients = this.getPatients();
    patients.push(patient);
    this.savePatients(patients);
    return patient;
  },

  archivePatient(id) {
    const patients = this.getPatients();
    const patient = patients.find(p => p.id === id);
    if (patient) {
      patient.archived = true;
      this.savePatients(patients);
      return true;
    }
    return false;
  },

  addDoctor(doctor) {
    const doctors = this.getDoctors();
    doctors.push(doctor);
    this.saveDoctors(doctors);
    return doctor;
  },

  updateDoctor(updatedDoctor) {
    const doctors = this.getDoctors();
    const index = doctors.findIndex(d => d.id === updatedDoctor.id);
    if (index !== -1) {
      doctors[index] = updatedDoctor;
      this.saveDoctors(doctors);
      return true;
    }
    return false;
  },

  getAvailabilityRecords() {
    if (!localStorage.getItem("ms360_availability")) {
      const defaultAvailability = [
        { docId: "doc-1", slots: ["09:00 AM", "10:30 AM", "01:30 PM", "02:45 PM"] },
        { docId: "doc-2", slots: ["11:30 AM", "03:00 PM", "04:00 PM"] },
        { docId: "doc-3", slots: ["11:00 AM", "01:30 PM", "03:00 PM"] },
        { docId: "doc-4", slots: ["09:30 AM", "10:30 AM", "02:45 PM"] },
        { docId: "doc-5", slots: [] }
      ];
      localStorage.setItem("ms360_availability", JSON.stringify(defaultAvailability));
    }
    return JSON.parse(localStorage.getItem("ms360_availability"));
  },

  saveAvailabilityRecords(records) {
    localStorage.setItem("ms360_availability", JSON.stringify(records));
  }
};
