/**
 * Theme Manager - Dark Mode & Timestamps
 */
export const ThemeManager = {
  init() {
    this.updateTimestamp();
    setInterval(() => this.updateTimestamp(), 60000); // Update every minute
  },

  updateTimestamp() {
    const now = new Date();
    const opts = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    const str = now.toLocaleDateString('en-GB', opts).replace(',', '');
    
    const updated = document.getElementById('lastUpdated');
    const footer = document.getElementById('footerTs');
    
    if(updated) updated.textContent = str;
    if(footer) footer.textContent = '// snapshot: ' + str;
  }
};
