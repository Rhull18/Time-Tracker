// Pre-defined distinct colors for chart slices
const palette = ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#4bc0c0', '#ffa1b5'];

function formatTime(seconds) {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  return `${mins}m ${seconds % 60}s`;
}

chrome.storage.local.get(null, (data) => {
  const sortedSites = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const totalSeconds = sortedSites.reduce((sum, item) => sum + item[1], 0);

  const legend = document.getElementById('legend');
  const chart = document.getElementById('pie-chart');

  if (totalSeconds === 0) {
    legend.innerHTML = '<p style="text-align:center; color:#999;">No web activity recorded yet.</p>';
    return;
  }

  let gradientString = '';
  let accumulatedPercentage = 0;

  sortedSites.forEach(([domain, seconds], index) => {
    const percentage = (seconds / totalSeconds) * 100;
    const color = palette[index % palette.length];

    // Create Legend Item
    const item = document.createElement('div');
    item.className = 'legend-item';
    item.innerHTML = `
      <div class="color-box" style="background-color: ${color}"></div>
      <span class="site-name">${domain}</span>
      <span class="site-time">${formatTime(seconds)}</span>
    `;
    legend.appendChild(item);

    // Build CSS Conic Gradient String
    const startPos = accumulatedPercentage.toFixed(1);
    accumulatedPercentage += percentage;
    const endPos = accumulatedPercentage.toFixed(1);
    
    gradientString += `${color} ${startPos}% ${endPos}%, `;
  });

  // Apply gradient background to create the dynamic pie chart slice looks
  chart.style.background = `conic-gradient(${gradientString.slice(0, -2)})`;
});
