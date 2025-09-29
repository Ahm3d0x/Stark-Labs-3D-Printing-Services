async function loadEvents() {
    try {
      const res = await fetch('events.json');
      const events = await res.json();
      const container = document.getElementById('events-container');
      container.innerHTML = '';
  
      const now = new Date();
      const activeEvents = events.filter(e => new Date(e.to) > now);
  
      activeEvents.forEach(event => {
        const fromDate = new Date(event.from);
        const toDate = new Date(event.to);
  
        if (isNaN(fromDate) || isNaN(toDate)) return;
  
        const formattedFrom = formatDate(fromDate);
        const formattedTo = formatDate(toDate);
  
        const card = document.createElement('div');
        card.className = "bg-dark-700 text-white rounded-xl shadow-lg p-4 relative overflow-hidden animate-fade-in";
  
        const tags = [
          event.tags?.includes("Hot") ? '<span class="text-xs bg-red-500 text-white px-2 py-1 rounded-full">Hot</span>' : '',
          event.tags?.includes("Limited") ? '<span class="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">Limited</span>' : '',
          event.tags?.includes("New") ? '<span class="text-xs bg-green-500 text-white px-2 py-1 rounded-full">New</span>' : ''
        ].filter(Boolean).join(' ');
  
        card.innerHTML = `
          <img src="${event.image}" class="w-full h-40 object-cover rounded-lg mb-4" alt="${event.title}" />
          <div class="absolute top-2 left-2 space-x-1">${tags}</div>
          <h3 class="text-lg font-bold text-yellow-400 mb-1">${event.title}</h3>
          <p class="text-sm text-gray-300 mb-2">${event.description}</p>
          <p class="text-sm text-orange-400 font-semibold mb-2">Discount: ${event.discount}</p>
          <p class="text-xs text-purple-400 mb-1">From ${formattedFrom} to ${formattedTo}</p>
          <p id="countdown-${event.id}" class="text-sm font-bold text-pink-400">⏳ Checking...</p>
        `;
  
        container.appendChild(card);
  
        startSmartCountdown(`countdown-${event.id}`, fromDate, toDate, card);
      });
  
    } catch (error) {
      console.error("Failed to load events:", error);
    }
  }
  
  // ✅ التاريخ بصيغة dd-mm-yyyy
  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  
  // ✅ عداد ذكي: يبدأ بعدين يعد تنازلي وينتهي
  function startSmartCountdown(id, startDate, endDate, cardEl) {
    const el = document.getElementById(id);
    if (!el) return;
  
    function update() {
      const now = new Date();
  
      if (now >= endDate) {
        el.textContent = '⏳ Expired';
        if (cardEl) cardEl.style.display = 'none';
        clearInterval(interval);
        return;
      }
  
      if (now < startDate) {
        const diff = startDate - now;
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        el.textContent = `⏳ Starts in ${d}d ${h}h ${m}m`;
      } else {
        const diff = endDate - now;
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        el.textContent = `⏳ Ends in ${h}h ${m}m ${s}s`;
      }
    }
  
    update();
    const interval = setInterval(update, 1000);
  }
  
  window.addEventListener('DOMContentLoaded', loadEvents);
  