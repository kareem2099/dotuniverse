/**
 * Theme Manager - Dark Mode & Timestamps
 */
export const ThemeManager = {
  init() {
    this.updateTimestamp();
    setInterval(() => this.updateTimestamp(), 60000); // Keep the "ago" part current
  },

  // Shows when the stats were last refreshed (#lastUpdated's data-updated), not the visitor's clock
  updateTimestamp() {
    const updated = document.getElementById('lastUpdated');
    const footer = document.getElementById('footerTs');
    const when = new Date(updated?.dataset.updated || NaN);
    if (isNaN(when)) return;

    const opts = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    const str = when.toLocaleDateString('en-GB', opts).replace(',', '');

    updated.textContent = `${str} (${this.timeAgo(when)})`;
    if(footer) footer.textContent = '// snapshot: ' + str;
  },

  timeAgo(date) {
    const mins = Math.max(0, Math.round((Date.now() - date) / 60000));
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.round(mins / 60);
    if (hours < 48) return `${hours}h ago`;
    return `${Math.round(hours / 24)}d ago`;
  }
};
