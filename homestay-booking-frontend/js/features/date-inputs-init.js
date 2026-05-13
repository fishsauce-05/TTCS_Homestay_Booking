export async function initDateInputs() {
  const today = new Date().toISOString().split('T')[0];
  ['search-checkin', 'search-checkout'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.min = today;
  });
}
