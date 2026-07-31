const toggleBtn = document.getElementById('toggle-btn')!;
const statusBadge = document.getElementById('status-badge')!;
const activityCountEl = document.getElementById('activity-count')!;
const screenshotCountEl = document.getElementById('screenshot-count')!;
const connectionBadge = document.getElementById('connection-badge')!;

type Status = { isRecording: boolean; startedAt: string | null; activityQueueSize: number; screenshotQueueSize: number; isOnline: boolean };

async function refreshStatus(): Promise<void> {
  const status: Status = await chrome.runtime.sendMessage({ type: 'GET_STATUS' });
  renderStatus(status);
}

function renderStatus(status: Status): void {
  if (status.isRecording) {
    toggleBtn.textContent = 'Stop Monitoring';
    toggleBtn.className = 'btn btn-danger';
    statusBadge.textContent = 'Recording';
    statusBadge.className = 'status-badge status-recording';
  } else {
    toggleBtn.textContent = 'Start Monitoring';
    toggleBtn.className = 'btn btn-primary';
    statusBadge.textContent = 'Stopped';
    statusBadge.className = 'status-badge status-stopped';
  }

  activityCountEl.textContent = String(status.activityQueueSize || 0);
  screenshotCountEl.textContent = String(status.screenshotQueueSize || 0);

  if (status.isOnline) {
    connectionBadge.innerHTML = '<span class="online-badge online"></span> Online';
  } else {
    connectionBadge.innerHTML = '<span class="online-badge offline"></span> Offline';
  }
}

toggleBtn.addEventListener('click', async () => {
  const status: Status = await chrome.runtime.sendMessage({ type: 'GET_STATUS' });
  if (status.isRecording) {
    await chrome.runtime.sendMessage({ type: 'STOP_MONITORING' });
  } else {
    await chrome.runtime.sendMessage({ type: 'START_MONITORING' });
  }
  await refreshStatus();
});

window.addEventListener('online', refreshStatus);
window.addEventListener('offline', refreshStatus);

document.addEventListener('DOMContentLoaded', refreshStatus);
setInterval(refreshStatus, 3000);