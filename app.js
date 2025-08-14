// SOLARA Comprehensive Dashboard JavaScript

// Application data from provided JSON
const appData = {
  currentUser: {
    name: "Dr. Sarah Chen",
    role: "Research Coordinator",
    facility: "Netherlands CEA Research Site",
    avatar: "SC"
  },
  roles: [
    {id: "farmer", name: "Farmer/Operator", icon: "🌱", description: "Operational focus on resource efficiency and production optimization"},
    {id: "researcher", name: "Research Coordinator", icon: "🔬", description: "Multi-site research coordination and experimental data analysis"},
    {id: "policy", name: "Policy/Regulatory", icon: "📋", description: "Compliance monitoring and regulatory reporting"},
    {id: "investor", name: "Investor/ESG", icon: "💼", description: "Financial sustainability metrics and investment analysis"}
  ],
  environmentalData: {
    temperature: {current: 24.5, target: 24.0, unit: "°C", status: "optimal", trend: "stable"},
    humidity: {current: 65.2, target: 65.0, unit: "%", status: "optimal", trend: "stable"},
    co2: {current: 800, target: 850, unit: "ppm", status: "good", trend: "improving"},
    lightIntensity: {current: 180, target: 200, unit: "μmol/m²/s", status: "good", trend: "stable"},
    ph: {current: 6.2, target: 6.0, unit: "pH", status: "optimal", trend: "stable"},
    ec: {current: 1.8, target: 1.9, unit: "mS/cm", status: "good", trend: "stable"}
  },
  sustainabilityKPIs: {
    waterEfficiency: {value: 2.3, unit: "L/kg", benchmark: 2.8, trend: "improving", improvement: 18, status: "excellent"},
    energyIntensity: {value: 3.8, unit: "kWh/kg", benchmark: 4.2, trend: "stable", improvement: 10, status: "good"},
    carbonFootprint: {value: 1.2, unit: "kg CO₂eq/kg", benchmark: 1.6, trend: "improving", improvement: 25, status: "excellent"},
    yieldOptimization: {value: 8.5, unit: "kg/m²", benchmark: 7.2, trend: "improving", improvement: 18, status: "excellent"},
    wasteGeneration: {value: 0.05, unit: "kg/kg", benchmark: 0.08, trend: "stable", improvement: 37, status: "excellent"}
  },
  complianceStatus: {
    csrd: {score: 98, status: "compliant", lastUpdate: "2025-08-01", trend: "stable"},
    esrs: {score: 96, status: "compliant", lastUpdate: "2025-08-01", trend: "improving"},
    fsdn: {score: 94, status: "compliant", lastUpdate: "2025-07-31", trend: "improving"},
    organic: {score: 100, status: "certified", lastUpdate: "2025-07-30", trend: "stable"}
  },
  financialMetrics: {
    costPerKg: {value: 4.25, currency: "EUR", trend: "decreasing", change: -8},
    sustainabilityROI: {value: 18.5, unit: "%", trend: "improving", change: 12},
    operationalCosts: {value: 12500, currency: "EUR", period: "monthly", trend: "optimizing"},
    revenuePerM2: {value: 85, currency: "EUR", trend: "increasing", change: 15}
  },
  systemStatus: {
    iotSensors: {online: 24, offline: 1, uptime: 96, lastCheck: "17:00"},
    erpIntegration: {status: "synced", lastSync: "16:45", quality: "excellent"},
    documentProcessing: {status: "active", queue: 3, processed: 187, efficiency: 98},
    dataQuality: {score: 97, status: "excellent", issues: 2, trend: "stable"}
  },
  benchmarkingData: {
    sites: ["Morocco Living Lab", "UK Research Site", "Italy Research Site", "Netherlands Site"],
    performance: {
      waterEfficiency: [2.8, 2.4, 2.6, 2.3],
      energyIntensity: [4.5, 3.9, 4.1, 3.8],
      yieldPerSqFt: [6.8, 7.5, 7.8, 8.5],
      sustainability: [78, 89, 82, 94]
    }
  },
  reportGeneration: {
    steps: [
      {name: "Data Collection", description: "Gathering data from IoT sensors, ERP systems, and external sources", duration: 3},
      {name: "LCA Calculations", description: "Processing lifecycle assessments using OpenLCA integration", duration: 8},
      {name: "Compliance Validation", description: "Checking against CSRD, ESRS, and FSDN requirements", duration: 5},
      {name: "Report Generation", description: "Creating PDF, XML, and XBRL formatted reports", duration: 7},
      {name: "Audit Trail Creation", description: "Generating complete traceability documentation", duration: 4},
      {name: "Benchmarking Analysis", description: "Comparing performance against peer facilities", duration: 3}
    ],
    totalTime: 30,
    manualEquivalent: 2400
  }
};

// Role-based content configuration
const roleContent = {
  farmer: {
    title: "Farmer/Operator Dashboard",
    subtitle: "Operational focus on resource efficiency and production optimization",
    emphasis: ["environmental", "metrics", "system"]
  },
  researcher: {
    title: "Research Coordination Dashboard", 
    subtitle: "Multi-site research coordination and experimental data analysis",
    emphasis: ["benchmarking", "metrics", "environmental"]
  },
  policy: {
    title: "Policy & Regulatory Dashboard",
    subtitle: "Compliance monitoring and regulatory reporting",
    emphasis: ["compliance", "system", "metrics"]
  },
  investor: {
    title: "Investor & ESG Dashboard",
    subtitle: "Financial sustainability metrics and investment analysis", 
    emphasis: ["financial", "compliance", "benchmarking"]
  }
};

// Global variables
let currentRole = 'researcher';
let benchmarkChart = null;
let progressModal, resultsModal, progressFill, progressSteps, currentStepElement, timeRemainingElement;
let reportGenerationInProgress = false;
let currentGenerationTimer = null;

// Ensure initialization happens after DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

function initializeApp() {
  console.log('Initializing SOLARA Comprehensive Dashboard...');
  
  // Use a short timeout to ensure all elements are rendered
  setTimeout(() => {
    initializeElements();
    attachEventListeners();
    initializeBenchmarkChart();
    initializeRealTimeUpdates();
    updateRoleContent('researcher'); // Default role
    console.log('Dashboard initialized successfully');
  }, 250);
}

function initializeElements() {
  console.log('Finding DOM elements...');
  
  progressModal = document.getElementById('progressModal');
  resultsModal = document.getElementById('resultsModal');
  progressFill = document.getElementById('progressFill');
  progressSteps = document.getElementById('progressSteps');
  currentStepElement = document.getElementById('currentStep');
  timeRemainingElement = document.getElementById('timeRemaining');
  
  console.log('Elements found:', {
    progressModal: !!progressModal,
    resultsModal: !!resultsModal,
    progressFill: !!progressFill,
    progressSteps: !!progressSteps,
    currentStepElement: !!currentStepElement,
    timeRemainingElement: !!timeRemainingElement
  });
  
  // Verify modal structure
  if (progressModal) {
    console.log('Progress modal exists, ensuring proper structure');
    progressModal.classList.add('hidden');
    progressModal.style.display = 'none';
  } else {
    console.error('Progress modal not found in DOM!');
  }
  
  if (resultsModal) {
    console.log('Results modal exists, ensuring proper structure');
    resultsModal.classList.add('hidden');
    resultsModal.style.display = 'none';
  } else {
    console.error('Results modal not found in DOM!');
  }
  
  createProgressSteps();
}

function attachEventListeners() {
  console.log('Attaching event listeners...');
  
  // Role switcher
  const roleSelect = document.getElementById('roleSelect');
  if (roleSelect) {
    console.log('Role select found:', roleSelect);
    console.log('Role select options:', roleSelect.options.length);
    
    // Verify select has options
    if (roleSelect.options.length === 0) {
      console.error('Role select has no options!');
    }
    
    roleSelect.addEventListener('change', function(e) {
      const newRole = e.target.value;
      console.log('Role changed to:', newRole);
      updateRoleContent(newRole);
    });
    
    console.log('Role select listener attached successfully');
  } else {
    console.error('Role select element not found!');
  }
  
  // Generate report button
  const generateBtn = document.getElementById('generateReportBtn');
  if (generateBtn) {
    console.log('Generate button found:', generateBtn);
    
    // Remove any existing listeners and add fresh one
    const newBtn = generateBtn.cloneNode(true);
    generateBtn.parentNode.replaceChild(newBtn, generateBtn);
    
    newBtn.addEventListener('click', function(e) {
      console.log('Generate report button clicked!');
      e.preventDefault();
      e.stopPropagation();
      
      // Prevent double-clicks
      if (reportGenerationInProgress) {
        console.log('Report generation already in progress, ignoring click');
        return;
      }
      
      startReportGeneration();
    });
    
    console.log('Generate button listener attached successfully');
  } else {
    console.error('Generate button element not found!');
  }
  
  // Modal close button
  const closeResultsBtn = document.getElementById('closeResultsModal');
  if (closeResultsBtn) {
    closeResultsBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('Close results button clicked');
      closeResultsModal();
    });
  }
  
  // Modal backdrop clicks
  if (resultsModal) {
    resultsModal.addEventListener('click', function(e) {
      if (e.target === resultsModal || e.target.classList.contains('modal__backdrop')) {
        console.log('Results modal backdrop clicked');
        closeResultsModal();
      }
    });
  }
  
  if (progressModal) {
    progressModal.addEventListener('click', function(e) {
      if (e.target === progressModal || e.target.classList.contains('modal__backdrop')) {
        if (reportGenerationInProgress) {
          if (confirm('Are you sure you want to cancel the report generation?')) {
            console.log('Cancelling report generation via backdrop click');
            cancelReportGeneration();
          }
        }
      }
    });
  }
  
  console.log('All event listeners attached successfully');
}

function updateRoleContent(roleId) {
  console.log('Updating role content for:', roleId);
  
  currentRole = roleId;
  const content = roleContent[roleId];
  
  if (!content) {
    console.error('Role content not found for:', roleId);
    return;
  }
  
  // Update welcome section
  const titleEl = document.getElementById('welcomeTitle');
  const subtitleEl = document.getElementById('welcomeSubtitle');
  
  if (titleEl) {
    titleEl.textContent = content.title;
    console.log('Updated title to:', content.title);
  } else {
    console.error('Welcome title element not found');
  }
  
  if (subtitleEl) {
    subtitleEl.textContent = content.subtitle;
    console.log('Updated subtitle to:', content.subtitle);
  } else {
    console.error('Welcome subtitle element not found');
  }
  
  // Update role select to match if needed
  const roleSelect = document.getElementById('roleSelect');
  if (roleSelect && roleSelect.value !== roleId) {
    roleSelect.value = roleId;
    console.log('Updated role select to:', roleId);
  }
  
  // Apply role-based emphasis (visual highlighting)
  applyRoleEmphasis(content.emphasis);
  
  console.log('Role content updated successfully for:', roleId);
}

function applyRoleEmphasis(emphasizedSections) {
  // Remove all existing emphasis
  const allCards = document.querySelectorAll('.card');
  allCards.forEach(card => {
    card.classList.remove('role-emphasis');
  });
  
  // Apply emphasis to relevant sections
  emphasizedSections.forEach(section => {
    const sectionCard = document.querySelector(`.${section}-card`);
    if (sectionCard) {
      sectionCard.classList.add('role-emphasis');
      console.log('Applied emphasis to:', section);
    }
  });
}

function initializeBenchmarkChart() {
  const ctx = document.getElementById('benchmarkChart');
  if (!ctx) {
    console.error('Benchmark chart canvas not found');
    return;
  }
  
  console.log('Initializing benchmark chart...');
  
  const data = appData.benchmarkingData;
  
  benchmarkChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Water Efficiency', 'Energy Intensity', 'Yield per m²', 'Sustainability Score'],
      datasets: [
        {
          label: 'Netherlands (Current)',
          data: [
            (2.8 - data.performance.waterEfficiency[3]) / 2.8 * 100,
            (4.5 - data.performance.energyIntensity[3]) / 4.5 * 100,
            data.performance.yieldPerSqFt[3] / 8.5 * 100,
            data.performance.sustainability[3]
          ],
          borderColor: '#1FB8CD',
          backgroundColor: 'rgba(31, 184, 205, 0.2)',
          fill: true,
          pointBackgroundColor: '#1FB8CD',
          pointBorderColor: '#1FB8CD',
          pointHoverBackgroundColor: '#1FB8CD',
          pointHoverBorderColor: '#1FB8CD'
        },
        {
          label: 'UK Research Site',
          data: [
            (2.8 - data.performance.waterEfficiency[1]) / 2.8 * 100,
            (4.5 - data.performance.energyIntensity[1]) / 4.5 * 100,
            data.performance.yieldPerSqFt[1] / 8.5 * 100,
            data.performance.sustainability[1]
          ],
          borderColor: '#FFC185',
          backgroundColor: 'rgba(255, 193, 133, 0.2)',
          fill: true,
          pointBackgroundColor: '#FFC185',
          pointBorderColor: '#FFC185',
          pointHoverBackgroundColor: '#FFC185',
          pointHoverBorderColor: '#FFC185'
        },
        {
          label: 'Italy Research Site',
          data: [
            (2.8 - data.performance.waterEfficiency[2]) / 2.8 * 100,
            (4.5 - data.performance.energyIntensity[2]) / 4.5 * 100,
            data.performance.yieldPerSqFt[2] / 8.5 * 100,
            data.performance.sustainability[2]
          ],
          borderColor: '#B4413C',
          backgroundColor: 'rgba(180, 65, 60, 0.2)',
          fill: true,
          pointBackgroundColor: '#B4413C',
          pointBorderColor: '#B4413C',
          pointHoverBackgroundColor: '#B4413C',
          pointHoverBorderColor: '#B4413C'
        },
        {
          label: 'Morocco Living Lab',
          data: [
            (2.8 - data.performance.waterEfficiency[0]) / 2.8 * 100,
            (4.5 - data.performance.energyIntensity[0]) / 4.5 * 100,
            data.performance.yieldPerSqFt[0] / 8.5 * 100,
            data.performance.sustainability[0]
          ],
          borderColor: '#ECEBD5',
          backgroundColor: 'rgba(236, 235, 213, 0.2)',
          fill: true,
          pointBackgroundColor: '#ECEBD5',
          pointBorderColor: '#ECEBD5',
          pointHoverBackgroundColor: '#ECEBD5',
          pointHoverBorderColor: '#ECEBD5'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': ' + context.parsed.r.toFixed(1) + '%';
            }
          }
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 20,
            color: 'rgba(98, 108, 113, 0.7)'
          },
          grid: {
            color: 'rgba(94, 82, 64, 0.3)'
          },
          pointLabels: {
            color: '#1F3433',
            font: {
              size: 12
            }
          }
        }
      }
    }
  });
  
  console.log('Benchmark chart initialized successfully');
}

function createProgressSteps() {
  if (!progressSteps) {
    console.error('Progress steps container not found');
    return;
  }
  
  console.log('Creating progress steps...');
  progressSteps.innerHTML = '';
  
  appData.reportGeneration.steps.forEach((step, index) => {
    const stepElement = document.createElement('div');
    stepElement.className = 'progress-step';
    stepElement.id = `step-${index}`;
    
    stepElement.innerHTML = `
      <div class="progress-step__icon">${index + 1}</div>
      <div class="progress-step__content">
        <div class="progress-step__name">${step.name}</div>
        <div class="progress-step__description">${step.description}</div>
      </div>
    `;
    
    progressSteps.appendChild(stepElement);
  });
  
  console.log('Progress steps created:', appData.reportGeneration.steps.length);
}

function startReportGeneration() {
  console.log('=== STARTING REPORT GENERATION ===');
  
  if (reportGenerationInProgress) {
    console.log('Report generation already in progress, aborting');
    return;
  }
  
  // Verify modal exists
  if (!progressModal) {
    console.error('Progress modal not found, cannot start generation');
    return;
  }
  
  // Set flag first
  reportGenerationInProgress = true;
  console.log('Report generation flag set to true');
  
  // Show progress modal
  showProgressModal();
  
  // Reset progress
  if (progressFill) {
    progressFill.style.width = '0%';
    console.log('Progress bar reset to 0%');
  }
  
  if (currentStepElement) {
    currentStepElement.textContent = 'Initializing...';
  }
  
  if (timeRemainingElement) {
    timeRemainingElement.textContent = `${appData.reportGeneration.totalTime}s remaining`;
  }
  
  // Reset all steps
  const allSteps = document.querySelectorAll('.progress-step');
  allSteps.forEach(step => {
    step.classList.remove('active', 'completed');
  });
  console.log('All progress steps reset');
  
  // Start the generation process
  setTimeout(() => {
    console.log('Starting report generation execution...');
    executeReportGeneration();
  }, 1000);
}

function executeReportGeneration() {
  console.log('=== EXECUTING REPORT GENERATION ===');
  
  const steps = appData.reportGeneration.steps;
  let currentStepIndex = 0;
  let totalElapsed = 0;
  const totalDuration = appData.reportGeneration.totalTime;
  
  function processStep() {
    if (!reportGenerationInProgress) {
      console.log('Report generation was cancelled, stopping');
      return;
    }
    
    if (currentStepIndex >= steps.length) {
      console.log('All steps completed, finishing report generation');
      completeReportGeneration();
      return;
    }
    
    const step = steps[currentStepIndex];
    const stepElement = document.getElementById(`step-${currentStepIndex}`);
    
    console.log(`Processing step ${currentStepIndex + 1}/${steps.length}: ${step.name}`);
    
    // Mark current step as active
    if (stepElement) {
      stepElement.classList.add('active');
      console.log(`Step ${currentStepIndex + 1} marked as active`);
    }
    
    if (currentStepElement) {
      currentStepElement.textContent = step.name;
    }
    
    // Simulate step processing
    const stepDuration = step.duration * 1000;
    let stepElapsed = 0;
    
    const stepTimer = setInterval(() => {
      if (!reportGenerationInProgress) {
        clearInterval(stepTimer);
        return;
      }
      
      stepElapsed += 200;
      totalElapsed += 0.2;
      
      // Update progress bar
      const currentProgress = Math.min((totalElapsed / totalDuration) * 100, 100);
      if (progressFill) {
        progressFill.style.width = `${currentProgress}%`;
      }
      
      // Update time remaining
      const timeRemaining = Math.max(0, totalDuration - totalElapsed);
      if (timeRemainingElement) {
        timeRemainingElement.textContent = `${Math.ceil(timeRemaining)}s remaining`;
      }
      
      if (stepElapsed >= stepDuration) {
        clearInterval(stepTimer);
        
        // Mark step as completed
        if (stepElement) {
          stepElement.classList.remove('active');
          stepElement.classList.add('completed');
          console.log(`Step ${currentStepIndex + 1} marked as completed`);
        }
        
        // Move to next step
        currentStepIndex++;
        setTimeout(() => processStep(), 300);
      }
    }, 200);
    
    currentGenerationTimer = stepTimer;
  }
  
  processStep();
}

function completeReportGeneration() {
  console.log('=== COMPLETING REPORT GENERATION ===');
  
  // Ensure progress is at 100%
  if (progressFill) {
    progressFill.style.width = '100%';
  }
  
  if (timeRemainingElement) {
    timeRemainingElement.textContent = 'Complete!';
  }
  
  if (currentStepElement) {
    currentStepElement.textContent = 'Report Ready';
  }
  
  setTimeout(() => {
    console.log('Hiding progress modal and showing results...');
    hideProgressModal();
    setTimeout(() => {
      showResultsModal();
      reportGenerationInProgress = false;
      console.log('Report generation completed successfully');
    }, 500);
  }, 1500);
}

function cancelReportGeneration() {
  console.log('=== CANCELLING REPORT GENERATION ===');
  
  reportGenerationInProgress = false;
  
  if (currentGenerationTimer) {
    clearInterval(currentGenerationTimer);
    currentGenerationTimer = null;
  }
  
  hideProgressModal();
}

function showProgressModal() {
  console.log('=== SHOWING PROGRESS MODAL ===');
  
  if (!progressModal) {
    console.error('Cannot show progress modal - element not found!');
    return;
  }
  
  // Force show the modal with multiple methods
  progressModal.style.display = 'flex';
  progressModal.classList.remove('hidden');
  progressModal.style.position = 'fixed';
  progressModal.style.top = '0';
  progressModal.style.left = '0';
  progressModal.style.width = '100%';
  progressModal.style.height = '100%';
  progressModal.style.zIndex = '1000';
  progressModal.style.alignItems = 'center';
  progressModal.style.justifyContent = 'center';
  
  document.body.style.overflow = 'hidden';
  
  console.log('Progress modal display styles applied');
  console.log('Modal visibility:', window.getComputedStyle(progressModal).display);
}

function hideProgressModal() {
  console.log('=== HIDING PROGRESS MODAL ===');
  
  if (progressModal) {
    progressModal.classList.add('hidden');
    progressModal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function showResultsModal() {
  console.log('=== SHOWING RESULTS MODAL ===');
  
  if (!resultsModal) {
    console.error('Cannot show results modal - element not found!');
    return;
  }
  
  // Attach download listeners
  attachDownloadListeners();
  
  // Force show the modal
  resultsModal.style.display = 'flex';
  resultsModal.classList.remove('hidden');
  resultsModal.style.position = 'fixed';
  resultsModal.style.top = '0';
  resultsModal.style.left = '0';
  resultsModal.style.width = '100%';
  resultsModal.style.height = '100%';
  resultsModal.style.zIndex = '1000';
  resultsModal.style.alignItems = 'center';
  resultsModal.style.justifyContent = 'center';
  
  document.body.style.overflow = 'hidden';
  
  console.log('Results modal shown successfully');
}

function closeResultsModal() {
  console.log('=== CLOSING RESULTS MODAL ===');
  
  if (resultsModal) {
    resultsModal.classList.add('hidden');
    resultsModal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function attachDownloadListeners() {
  const downloadButtons = document.querySelectorAll('.download-btn');
  console.log('Attaching download listeners to', downloadButtons.length, 'buttons');
  
  downloadButtons.forEach((button, index) => {
    // Clone to remove existing listeners
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    
    newButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const fileName = this.textContent.trim();
      console.log('Download requested:', fileName);
      showNotification(`Downloading ${fileName}...`, 'info');
      
      // Add visual feedback
      const originalText = this.textContent;
      this.textContent = 'Downloading...';
      this.disabled = true;
      
      setTimeout(() => {
        this.textContent = originalText;
        this.disabled = false;
        showNotification(`${fileName} downloaded successfully!`, 'success');
      }, 2000);
    });
  });
}

function showNotification(message, type = 'info') {
  console.log('Showing notification:', message, type);
  
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.textContent = message;
  
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    backgroundColor: type === 'success' ? '#218a7d' : '#626c71',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    zIndex: '10000',
    fontSize: '14px',
    fontWeight: '500',
    maxWidth: '300px',
    transform: 'translateX(100%)',
    transition: 'transform 0.3s ease',
    border: '1px solid rgba(94, 82, 64, 0.12)'
  });
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

function initializeRealTimeUpdates() {
  console.log('Initializing real-time updates');
  
  setInterval(() => {
    updateEnvironmentalData();
    updateSystemStatus();
  }, 8000);
  
  addLiveDataIndicators();
}

function updateEnvironmentalData() {
  const tempElements = document.querySelectorAll('.env-metric__value');
  tempElements.forEach((element, index) => {
    if (index === 0) {
      const currentTemp = parseFloat(element.textContent);
      if (!isNaN(currentTemp)) {
        const newTemp = currentTemp + (Math.random() - 0.5) * 0.3;
        element.textContent = `${newTemp.toFixed(1)}°C`;
      }
    }
  });
}

function updateSystemStatus() {
  if (Math.random() > 0.7) {
    const statusElements = document.querySelectorAll('.status--success');
    statusElements.forEach(element => {
      element.style.animation = 'pulse 0.5s ease-in-out';
      element.addEventListener('animationend', function() {
        this.style.animation = '';
      }, { once: true });
    });
  }
}

function addLiveDataIndicators() {
  const liveStatuses = document.querySelectorAll('.status--success');
  console.log('Adding live data indicators to', liveStatuses.length, 'elements');
  
  liveStatuses.forEach(status => {
    status.style.position = 'relative';
    status.style.overflow = 'hidden';
    
    status.addEventListener('mouseenter', function() {
      this.style.boxShadow = '0 0 10px rgba(33, 128, 141, 0.3)';
    });
    
    status.addEventListener('mouseleave', function() {
      this.style.boxShadow = '';
    });
  });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
  if (e.key.toLowerCase() === 'g' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
    const activeElement = document.activeElement;
    const isInInput = activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'SELECT');
    
    if (!reportGenerationInProgress && !isInInput) {
      const progressModalHidden = !progressModal || progressModal.classList.contains('hidden');
      const resultsModalHidden = !resultsModal || resultsModal.classList.contains('hidden');
      
      if (progressModalHidden && resultsModalHidden) {
        console.log('Keyboard shortcut: Generate report (G)');
        startReportGeneration();
      }
    }
  }
  
  if (e.key === 'Escape') {
    if (resultsModal && !resultsModal.classList.contains('hidden')) {
      console.log('Keyboard shortcut: Close results modal (Escape)');
      closeResultsModal();
    } else if (progressModal && !progressModal.classList.contains('hidden') && reportGenerationInProgress) {
      if (confirm('Are you sure you want to cancel the report generation?')) {
        cancelReportGeneration();
      }
    }
  }
  
  const roleKeys = {'1': 'farmer', '2': 'researcher', '3': 'policy', '4': 'investor'};
  if (roleKeys[e.key] && !e.ctrlKey && !e.altKey && !e.shiftKey) {
    const activeElement = document.activeElement;
    const isInInput = activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'SELECT');
    
    if (!isInInput) {
      console.log('Keyboard shortcut: Switch to role', roleKeys[e.key]);
      updateRoleContent(roleKeys[e.key]);
    }
  }
});

// Add CSS for role emphasis and animations
const style = document.createElement('style');
style.textContent = `
  .role-emphasis {
    border: 2px solid var(--color-primary) !important;
    box-shadow: 0 0 20px rgba(33, 128, 141, 0.2) !important;
    transform: scale(1.02);
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  
  /* Force modal visibility */
  .modal:not(.hidden) {
    display: flex !important;
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    z-index: 1000 !important;
    align-items: center !important;
    justify-content: center !important;
  }
`;
document.head.appendChild(style);

// Add intersection observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-fade-in-up');
    }
  });
}, observerOptions);

// Observe all cards for animation
setTimeout(() => {
  const cards = document.querySelectorAll('.card');
  console.log('Setting up animations for', cards.length, 'cards');
  cards.forEach(card => {
    observer.observe(card);
  });
}, 500);

// Debug function
window.testSolaraFeatures = function() {
  console.log('=== SOLARA DEBUG INFO ===');
  console.log('Current role:', currentRole);
  console.log('Benchmark chart:', benchmarkChart);
  console.log('Progress modal:', progressModal);
  console.log('Results modal:', resultsModal);
  console.log('Report generation in progress:', reportGenerationInProgress);
  
  console.log('Testing report generation...');
  startReportGeneration();
};

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    startReportGeneration,
    updateRoleContent,
    formatNumber: (num, decimals = 1) => parseFloat(num).toFixed(decimals)
  };
}