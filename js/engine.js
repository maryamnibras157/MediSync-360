// MediSync 360 - Healthcare Continuity & Operations Calculation Engine

export const engine = {
  /**
   * Calculates the overall Healthcare Continuity Score (0-100)
   * based on the custom weighted components.
   * @param {Object} metrics - { attendance: number, medication: number, followups: number, reports: number }
   * @returns {number} Score between 0 and 100
   */
  calculateContinuityScore(metrics) {
    const { attendance = 0, medication = 0, followups = 0, reports = 0 } = metrics;
    
    // Weights
    const wAttendance = 0.40;
    const wMedication = 0.30;
    const wFollowups = 0.20;
    const wReports = 0.10;
    
    const weightedScore = (attendance * wAttendance) + 
                          (medication * wMedication) + 
                          (followups * wFollowups) + 
                          (reports * wReports);
                          
    return Math.round(Math.max(0, Math.min(100, weightedScore)));
  },

  /**
   * Evaluates patient risk level based on score and secondary conditions
   * @param {number} score - Continuity Score (0-100)
   * @param {Array<string>} riskFactors - List of known risk factors
   * @returns {string} 'Low', 'Medium', or 'High'
   */
  evaluateRiskLevel(score, riskFactors = []) {
    // Immediate conditions for High risk
    if (score < 50 || riskFactors.length >= 3) {
      return "High";
    }
    
    if (score < 75 || riskFactors.length > 0) {
      return "Medium";
    }
    
    return "Low";
  },

  /**
   * Estimates waiting time in minutes for the queue based on active doctors
   * @param {Array<Object>} queue - Active checked-in queue
   * @param {Array<Object>} doctors - List of doctors and their statuses
   * @returns {number} Estimated minutes
   */
  estimateQueueWaitTime(queue, doctors) {
    const activeDoctorsCount = doctors.filter(d => d.status === "Active" || d.status === "Consulting").length;
    if (activeDoctorsCount === 0) return 120; // Default high wait if no doctors active
    
    const patientsWaiting = queue.filter(q => q.status === "Checked-In" || q.status === "Scheduled").length;
    
    // Average check-up takes 15 minutes.
    // Divided by active doctors.
    const averageMinutes = 15;
    const waitTime = Math.round((patientsWaiting * averageMinutes) / activeDoctorsCount);
    
    return Math.max(5, waitTime); // Min 5 minutes wait
  },

  /**
   * Formats a raw currency value to USD format
   */
  formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }
};
