import express from 'express';
import os from 'os';

const router = express.Router();

// Move version to a constant since we can't import package.json directly
const APP_VERSION = '1.0.0';

const formatUptime = (uptime) => {
  const days = Math.floor(uptime / (3600 * 24));
  const hours = Math.floor((uptime % (3600 * 24)) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

const getMemoryUsage = () => {
  const used = process.memoryUsage();
  return {
    heapUsed: (used.heapUsed / 1024 / 1024).toFixed(2),
    heapTotal: (used.heapTotal / 1024 / 1024).toFixed(2),
    rss: (used.rss / 1024 / 1024).toFixed(2),
  };
};

router.get('/', async (req, res) => {
  try {
    const mongoStatus = req.app.get('mongoose').connection.readyState === 1;
    const systemInfo = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: formatUptime(process.uptime()),
      version: APP_VERSION,
      node: process.version,
      memory: getMemoryUsage(),
      cpu: {
        cores: os.cpus().length,
        model: os.cpus()[0].model,
        loadAvg: os.loadavg(),
      },
      os: {
        platform: os.platform(),
        release: os.release(),
        type: os.type(),
      },
      database: {
        status: mongoStatus ? 'connected' : 'disconnected',
        name: 'MongoDB',
      }
    };

    // Send HTML response
    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>System Health - Priyansh's Portfolio</title>
          <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet">
          <style>
            :root {
              --primary: #00E5A0;
              --secondary: #6B3BFF;
              --dark-bg: #0A0A0B;
              --card-bg: rgba(255, 255, 255, 0.03);
              --border-color: rgba(255, 255, 255, 0.06);
            }
            
            body {
              font-family: 'Space Grotesk', sans-serif;
              background-color: var(--dark-bg);
              color: white;
              margin: 0;
              padding: 2rem;
              min-height: 100vh;
              background-image: 
                radial-gradient(circle at 50% 0%, rgba(107, 59, 255, 0.15), transparent 25%),
                radial-gradient(circle at 0% 50%, rgba(0, 229, 160, 0.1), transparent 25%);
            }
            
            .container {
              max-width: 800px;
              margin: 0 auto;
            }
            
            .header {
              text-align: center;
              margin-bottom: 3rem;
            }
            
            .title {
              font-size: 2.5rem;
              font-weight: bold;
              margin-bottom: 0.5rem;
            }
            
            .subtitle {
              color: rgba(255, 255, 255, 0.7);
            }
            
            .status-card {
              background: var(--card-bg);
              border: 1px solid var(--border-color);
              border-radius: 1rem;
              padding: 1.5rem;
              backdrop-filter: blur(10px);
              margin-bottom: 1rem;
            }
            
            .status-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 1rem;
            }
            
            .status-badge {
              background: ${mongoStatus ? 'rgba(0, 229, 160, 0.1)' : 'rgba(255, 99, 71, 0.1)'};
              color: ${mongoStatus ? '#00E5A0' : '#FF6347'};
              padding: 0.5rem 1rem;
              border-radius: 2rem;
              font-weight: bold;
            }
            
            .grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 1rem;
            }
            
            .stat {
              display: flex;
              flex-direction: column;
              gap: 0.25rem;
            }
            
            .stat-label {
              color: rgba(255, 255, 255, 0.7);
              font-size: 0.875rem;
            }
            
            .stat-value {
              font-weight: bold;
            }
            
            .refresh-time {
              text-align: center;
              color: rgba(255, 255, 255, 0.5);
              font-size: 0.875rem;
              margin-top: 2rem;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="title">System Health</h1>
              <p class="subtitle">Real-time system metrics and status</p>
            </div>
            
            <div class="status-card">
              <div class="status-header">
                <h2>System Status</h2>
                <span class="status-badge">${mongoStatus ? 'HEALTHY' : 'ISSUES DETECTED'}</span>
              </div>
              
              <div class="grid">
                <div class="stat">
                  <span class="stat-label">Uptime</span>
                  <span class="stat-value">${systemInfo.uptime}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Version</span>
                  <span class="stat-value">${systemInfo.version}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Node.js</span>
                  <span class="stat-value">${systemInfo.node}</span>
                </div>
              </div>
            </div>
            
            <div class="status-card">
              <h2>Memory Usage</h2>
              <div class="grid">
                <div class="stat">
                  <span class="stat-label">Heap Used</span>
                  <span class="stat-value">${systemInfo.memory.heapUsed} MB</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Heap Total</span>
                  <span class="stat-value">${systemInfo.memory.heapTotal} MB</span>
                </div>
                <div class="stat">
                  <span class="stat-label">RSS</span>
                  <span class="stat-value">${systemInfo.memory.rss} MB</span>
                </div>
              </div>
            </div>
            
            <div class="status-card">
              <h2>System Info</h2>
              <div class="grid">
                <div class="stat">
                  <span class="stat-label">Platform</span>
                  <span class="stat-value">${systemInfo.os.platform}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">CPU Cores</span>
                  <span class="stat-value">${systemInfo.cpu.cores}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Load Average</span>
                  <span class="stat-value">${systemInfo.cpu.loadAvg[0].toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <p class="refresh-time">Last updated: ${new Date().toLocaleString()}</p>
          </div>
          
          <script>
            setTimeout(() => window.location.reload(), 30000);
          </script>
        </body>
      </html>
    `;

    res.send(html);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching health status' });
  }
});

export const healthRouter = router;