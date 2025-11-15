// Cash Flow Forecast Lab - Interactive JavaScript
// Enhanced for accessibility and engagement

// Utility functions
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const gbMoney0 = new Intl.NumberFormat('en-GB', { 
  style: 'currency', 
  currency: 'GBP', 
  maximumFractionDigits: 0 
});

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// Application state
const state = {
  months: 12,
  opening: 1000,
  termDays: 30,
  inflows: [],
  outflows: [],
  closing: [],
  receipts: [],
  sales: []
};

// Accessibility helpers
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

function showFeedback(element, message, isSuccess = true) {
  element.textContent = message;
  element.className = isSuccess ? 'note feedback-success' : 'note feedback-error';
  
  if (isSuccess) {
    element.classList.add('success-animation');
    setTimeout(() => element.classList.remove('success-animation'), 600);
  }
  
  announceToScreenReader(message);
}

// Core application functions
function monthName(i) {
  return MONTH_NAMES[i % 12];
}

function initState() {
  state.inflows = Array(state.months).fill(0);
  state.outflows = Array(state.months).fill(0);
  state.sales = Array(state.months).fill(0);
  state.receipts = Array(state.months).fill(0);
  state.closing = Array(state.months).fill(0);
}

function buildTable() {
  const wrap = $('#tableWrap');
  wrap.innerHTML = '';
  
  const table = document.createElement('table');
  table.setAttribute('role', 'table');
  table.setAttribute('aria-label', 'Cash flow forecast data table');
  
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headerRow.setAttribute('role', 'row');
  
  const headers = [
    'Month',
    'Sales (£)',
    'Other Inflows (£)',
    'Total Inflow (£)',
    'Outflows (£)',
    'Net Flow (£)',
    'Opening Balance (£)',
    'Closing Balance (£)'
  ];

  headers.forEach((h, index) => {
    const th = document.createElement('th');
    th.setAttribute('role', 'columnheader');
    th.setAttribute('scope', 'col');
    th.textContent = h;
    if (index > 0) {
      th.setAttribute('aria-sort', 'none');
    }
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  const tbody = document.createElement('tbody');
  let opening = state.opening;

  for (let i = 0; i < state.months; i++) {
    const tr = document.createElement('tr');
    tr.setAttribute('role', 'row');

    // Month cell
    const tdMonth = document.createElement('td');
    tdMonth.setAttribute('role', 'cell');
    tdMonth.textContent = monthName(i);
    tr.appendChild(tdMonth);

    // Sales input
    const salesInput = document.createElement('input');
    salesInput.type = 'number';
    salesInput.value = state.sales[i] || 0;
    salesInput.dataset.col = 'sales';
    salesInput.dataset.idx = String(i);
    salesInput.setAttribute('aria-label', `Sales for ${monthName(i)}`);
    salesInput.setAttribute('min', '0');
    salesInput.setAttribute('step', '1');
    salesInput.addEventListener('input', onEdit);
    salesInput.addEventListener('focus', () => {
      announceToScreenReader(`Editing sales for ${monthName(i)}`);
    });
    
    const tdSales = document.createElement('td');
    tdSales.setAttribute('role', 'cell');
    tdSales.appendChild(salesInput);
    tr.appendChild(tdSales);

    // Other inflows input
    const inflowInput = document.createElement('input');
    inflowInput.type = 'number';
    inflowInput.value = state.inflows[i] || 0;
    inflowInput.dataset.col = 'inflow';
    inflowInput.dataset.idx = String(i);
    inflowInput.setAttribute('aria-label', `Other inflows for ${monthName(i)}`);
    inflowInput.setAttribute('min', '0');
    inflowInput.setAttribute('step', '1');
    inflowInput.addEventListener('input', onEdit);
    inflowInput.addEventListener('focus', () => {
      announceToScreenReader(`Editing other inflows for ${monthName(i)}`);
    });
    
    const tdInflows = document.createElement('td');
    tdInflows.setAttribute('role', 'cell');
    tdInflows.appendChild(inflowInput);
    tr.appendChild(tdInflows);

    // Total inflow (calculated)
    const tdTotIn = document.createElement('td');
    tdTotIn.setAttribute('role', 'cell');
    tdTotIn.id = 'ti-' + i;
    tdTotIn.textContent = '£0';
    tdTotIn.setAttribute('aria-label', `Total inflow for ${monthName(i)}`);
    tr.appendChild(tdTotIn);

    // Outflows input
    const outInput = document.createElement('input');
    outInput.type = 'number';
    outInput.value = state.outflows[i] || 0;
    outInput.dataset.col = 'outflow';
    outInput.dataset.idx = String(i);
    outInput.setAttribute('aria-label', `Outflows for ${monthName(i)}`);
    outInput.setAttribute('min', '0');
    outInput.setAttribute('step', '1');
    outInput.addEventListener('input', onEdit);
    outInput.addEventListener('focus', () => {
      announceToScreenReader(`Editing outflows for ${monthName(i)}`);
    });
    
    const tdOut = document.createElement('td');
    tdOut.setAttribute('role', 'cell');
    tdOut.appendChild(outInput);
    tr.appendChild(tdOut);

    // Net flow (calculated)
    const tdNet = document.createElement('td');
    tdNet.setAttribute('role', 'cell');
    tdNet.id = 'net-' + i;
    tdNet.textContent = '£0';
    tdNet.setAttribute('aria-label', `Net flow for ${monthName(i)}`);
    tr.appendChild(tdNet);

    // Opening balance (calculated)
    const tdOpen = document.createElement('td');
    tdOpen.setAttribute('role', 'cell');
    tdOpen.id = 'open-' + i;
    tdOpen.textContent = gbMoney0.format(opening);
    tdOpen.setAttribute('aria-label', `Opening balance for ${monthName(i)}`);
    tr.appendChild(tdOpen);

    // Closing balance (calculated)
    const tdClose = document.createElement('td');
    tdClose.setAttribute('role', 'cell');
    tdClose.id = 'close-' + i;
    tdClose.textContent = '£0';
    tdClose.setAttribute('aria-label', `Closing balance for ${monthName(i)}`);
    tr.appendChild(tdClose);

    tbody.appendChild(tr);
  }

  table.appendChild(tbody);
  wrap.appendChild(table);
  recalc();
}

function onEdit(e) {
  const idx = Number(e.target.dataset.idx || 0);
  const col = e.target.dataset.col;
  const val = Number(e.target.value || 0);

  if (col === 'sales') state.sales[idx] = val;
  if (col === 'inflow') state.inflows[idx] = val;
  if (col === 'outflow') state.outflows[idx] = val;

  recalc();
  
  // Provide audio feedback for changes
  const monthStr = monthName(idx);
  const colName = col === 'sales' ? 'sales' : col === 'inflow' ? 'other inflows' : 'outflows';
  announceToScreenReader(`${colName} for ${monthStr} updated to ${gbMoney0.format(val)}`);
}

function applyTerm() {
  const shift = Math.round(state.termDays / 30);
  state.receipts = Array(state.months).fill(0);
  
  for (let i = 0; i < state.months; i++) {
    const target = i + shift;
    if (target < state.months) {
      state.receipts[target] += state.sales[i];
    }
  }
}

function recalc() {
  applyTerm();
  let opening = state.opening;
  let negativeCount = 0;
  let lowest = Infinity;
  let lowestIdx = -1;

  for (let i = 0; i < state.months; i++) {
    const totalIn = (state.receipts[i] || 0) + (state.inflows[i] || 0);
    const out = state.outflows[i] || 0;
    const net = totalIn - out;
    const close = opening + net;
    state.closing[i] = close;

    $('#ti-' + i).textContent = gbMoney0.format(totalIn);
    $('#net-' + i).textContent = gbMoney0.format(net);
    $('#open-' + i).textContent = gbMoney0.format(opening);
    $('#close-' + i).textContent = gbMoney0.format(close);

    const row = $('#close-' + i).parentElement;
    row.classList.toggle('negative', close < 0);
    
    if (close < 0) {
      negativeCount++;
      row.setAttribute('aria-label', `Warning: Negative balance in ${monthName(i)}`);
    } else {
      row.removeAttribute('aria-label');
    }
    
    if (close < lowest) {
      lowest = close;
      lowestIdx = i;
    }

    opening = close;
  }

  const negText = negativeCount + ' month' + (negativeCount === 1 ? '' : 's') + ' negative';
  const lowestText = 'Lowest: ' + gbMoney0.format(lowest === Infinity ? 0 : lowest) + 
                    ' (' + (lowestIdx >= 0 ? monthName(lowestIdx) : 'n/a') + ')';
  
  $('#negCount').textContent = negText;
  $('#lowestBal').textContent = lowestText;

  // Update ARIA labels for summary information
  $('#negCount').setAttribute('aria-label', negText);
  $('#lowestBal').setAttribute('aria-label', lowestText);

  drawChart();
  buildInsights();
}

function drawChart() {
  const svg = $('#chart');
  const W = svg.clientWidth || 1000;
  const H = svg.clientHeight || 400;
  const padL = 60;
  const padR = 20;
  const padT = 40;
  const padB = 50;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  svg.innerHTML = '';

  const maxAbs = Math.max(100, ...state.closing.map((v) => Math.abs(v)));
  const yMax = maxAbs * 1.2;
  const yMin = -maxAbs * 1.2;

  const sx = (i) => padL + (i / Math.max(1, state.months - 1)) * innerW;
  const sy = (v) => padT + (yMax - v) / (yMax - yMin) * innerH;

  // Grid and axes
  const grid = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  grid.setAttribute('aria-hidden', 'true');

  for (let i = 0; i < state.months; i++) {
    const x = sx(i);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x);
    line.setAttribute('y1', padT);
    line.setAttribute('x2', x);
    line.setAttribute('y2', H - padB);
    line.setAttribute('class', 'gridline');
    grid.appendChild(line);

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.textContent = monthName(i);
    label.setAttribute('x', x);
    label.setAttribute('y', H - 12);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('fill', '#334155');
    label.setAttribute('font-size', '14');
    label.setAttribute('font-weight', '600');
    grid.appendChild(label);
  }

  // X-axis
  const axisX = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  axisX.setAttribute('x1', padL);
  axisX.setAttribute('y1', H - padB);
  axisX.setAttribute('x2', W - padR);
  axisX.setAttribute('y2', H - padB);
  axisX.setAttribute('class', 'axis');
  grid.appendChild(axisX);

  // Zero line
  const zero = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  zero.setAttribute('x1', padL);
  zero.setAttribute('y1', sy(0));
  zero.setAttribute('x2', W - padR);
  zero.setAttribute('y2', sy(0));
  zero.setAttribute('class', 'gridline');
  zero.setAttribute('stroke-width', '2');
  grid.appendChild(zero);

  svg.appendChild(grid);

  // Data line
  const points = state.closing.map((v, i) => sx(i) + ',' + sy(v)).join(' ');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  path.setAttribute('points', points);
  path.setAttribute('class', 'line-bal');
  svg.appendChild(path);

  // Data points with enhanced accessibility
  state.closing.forEach((v, i) => {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', sx(i));
    c.setAttribute('cy', sy(v));
    c.setAttribute('r', 6);
    c.setAttribute('fill', v >= 0 ? 'var(--good)' : 'var(--bad)');
    c.setAttribute('stroke', '#fff');
    c.setAttribute('stroke-width', '2');
    
    // Add accessibility information
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = `${monthName(i)}: ${gbMoney0.format(v)}`;
    c.appendChild(title);
    
    svg.appendChild(c);
  });

  // Chart title
  const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  title.textContent = 'Closing Cash Balance by Month';
  title.setAttribute('x', W / 2);
  title.setAttribute('y', 24);
  title.setAttribute('text-anchor', 'middle');
  title.setAttribute('class', 'chart-title');
  svg.appendChild(title);

  // Axis labels
  const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  xLabel.textContent = 'Months';
  xLabel.setAttribute('x', padL + innerW / 2);
  xLabel.setAttribute('y', H - 8);
  xLabel.setAttribute('text-anchor', 'middle');
  xLabel.setAttribute('class', 'axis-label');
  svg.appendChild(xLabel);

  const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  yLabel.textContent = 'Cash Balance (£)';
  yLabel.setAttribute('x', 20);
  yLabel.setAttribute('y', padT + innerH / 2);
  yLabel.setAttribute('transform', 'rotate(-90 20 ' + (padT + innerH / 2) + ')');
  yLabel.setAttribute('class', 'axis-label');
  svg.appendChild(yLabel);
}

function buildInsights() {
  const negatives = state.closing
    .map((v, i) => [v, i])
    .filter(([v]) => v < 0)
    .map(([, i]) => i);

  const el = $('#insights');

  if (!negatives.length) {
    el.textContent = 'Great news! No negative months in this forecast. The business maintains positive cash flow throughout the period, but should continue monitoring for unexpected changes.';
    el.className = 'note feedback-success';
    return;
  }

  const months = negatives.map((i) => monthName(i)).join(', ');
  const suggestions = [
    'Negotiate shorter payment terms with customers (e.g., Net 15 instead of Net 30)',
    'Delay non-essential purchases or spread large payments over multiple months',
    'Follow up promptly with customers who have overdue invoices',
    'Arrange an overdraft facility or line of credit with the bank',
    'Consider factoring or invoice financing for immediate cash',
    'Review and reduce unnecessary monthly expenses'
  ];

  const textParts = [
    `⚠️ Cash shortage warning: Negative closing balance predicted in ${months}.`,
    'Recommended actions:',
    suggestions.map((s, i) => `${i + 1}. ${s}`).join(' ')
  ];

  el.innerHTML = textParts.join('<br><br>');
  el.className = 'note feedback-error';
}

// Purpose task with enhanced feedback
function initPurposeTask() {
  const slots = $$('.slot');
  const chips = $$('#purposeBank .chip');
  const feedback = $('#purposeFeedback');

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const word = chip.dataset.word || '';
      
      // Find first empty slot
      for (const slot of slots) {
        if (!slot.dataset.value || slot.dataset.value === '') {
          slot.textContent = word;
          slot.dataset.value = word;
          slot.classList.add('filled');
          
          // Mark chip as used
          chip.classList.add('used');
          chip.setAttribute('aria-pressed', 'true');
          
          announceToScreenReader(`Added "${word}" to definition`);
          break;
        }
      }
    });
    
    // Add keyboard support
    chip.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        chip.click();
      }
    });
  });

  slots.forEach((slot) => {
    slot.addEventListener('click', () => {
      const currentWord = slot.dataset.value;
      
      slot.textContent = '____';
      slot.dataset.value = '';
      slot.classList.remove('filled');
      feedback.textContent = '';
      
      // Unmark the corresponding chip
      if (currentWord) {
        const chip = document.querySelector(`#purposeBank .chip[data-word="${currentWord}"]`);
        if (chip) {
          chip.classList.remove('used');
          chip.setAttribute('aria-pressed', 'false');
        }
        announceToScreenReader(`Removed "${currentWord}" from definition`);
      }
    });
    
    // Add keyboard support for slots
    slot.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        slot.click();
      }
    });
  });

  $('#checkPurpose').addEventListener('click', () => {
    let correct = 0;
    let total = 0;
    
    slots.forEach((slot) => {
      const expected = slot.dataset.correct || '';
      const val = (slot.dataset.value || '').toLowerCase();
      total += 1;
      if (val === expected.toLowerCase()) {
        correct += 1;
      }
    });

    if (correct === total) {
      showFeedback(feedback, '✅ Excellent! You have built a clear and accurate purpose for a cash flow forecast. This shows you understand why businesses need to plan their cash flow.', true);
    } else {
      showFeedback(feedback, '❌ Not quite right. Think about WHEN cash moves and what action the business wants to AVOID. Try again!', false);
    }
  });
}

// Mini check 1: Enhanced negative months check
function initMiniNegative() {
  $('#btnCheckNeg').addEventListener('click', () => {
    const anyNeg = state.closing.some((v) => v < 0);
    const feedback = $('#miniNegFeedback');
    
    if (anyNeg) {
      const negativeMonths = state.closing
        .map((v, i) => [v, i])
        .filter(([v]) => v < 0);
      
      const months = negativeMonths.map(([, i]) => monthName(i)).join(', ');
      const worstMonth = negativeMonths.reduce((worst, current) => 
        current[0] < worst[0] ? current : worst
      );
      
      const message = `⚠️ Cash shortage alert! Negative months found: ${months}. ` +
                     `Worst month is ${monthName(worstMonth[1])} with ${gbMoney0.format(worstMonth[0])}. ` +
                     `The business risks being unable to pay bills during these periods.`;
      
      showFeedback(feedback, message, false);
    } else {
      showFeedback(feedback, '✅ Great news! No negative months detected. The cash flow forecast shows the business maintains positive cash throughout the period.', true);
    }
  });
}

// Mini check 2: Enhanced payment terms drag and drop
const TERM_ITEMS = [
  { id: 't1', text: 'Customer pays immediately when they buy something (cash sale)', term: '0' },
  { id: 't2', text: 'Customer pays about one month after the sale (30-day credit)', term: '30' },
  { id: 't3', text: 'Customer pays about two months after the sale (60-day credit)', term: '60' }
];

function buildTermCards() {
  const holder = $('#termCards');
  holder.innerHTML = '';
  
  TERM_ITEMS.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.textContent = item.text;
    card.dataset.termTarget = item.term;
    card.dataset.id = item.id;
    card.setAttribute('draggable', 'true');
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Drag this card: ${item.text}`);
    
    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', item.id);
      card.style.opacity = '0.5';
      announceToScreenReader(`Dragging: ${item.text}`);
    });
    
    card.addEventListener('dragend', () => {
      card.style.opacity = '1';
    });
    
    // Keyboard support for drag and drop
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // Simple keyboard interaction - move to first available bin
        const bins = $$('.bin[data-term]');
        for (const bin of bins) {
          if (bin.children.length === 1) { // Only has the title
            bin.appendChild(card);
            announceToScreenReader(`Moved "${item.text}" to ${bin.querySelector('strong').textContent}`);
            break;
          }
        }
      }
    });
    
    holder.appendChild(card);
  });

  // Enhanced drop zones
  ['bin-term-0', 'bin-term-30', 'bin-term-60', 'termCards'].forEach((id) => {
    const bin = document.getElementById(id);
    
    bin.addEventListener('dragover', (e) => {
      e.preventDefault();
      bin.style.backgroundColor = '#e0f2fe';
    });
    
    bin.addEventListener('dragleave', () => {
      bin.style.backgroundColor = '';
    });
    
    bin.addEventListener('drop', (e) => {
      e.preventDefault();
      bin.style.backgroundColor = '';
      
      const idDropped = e.dataTransfer.getData('text/plain');
      const card = document.querySelector('.card[data-id="' + idDropped + '"]');
      
      if (card) {
        bin.appendChild(card);
        const binName = bin.querySelector('strong')?.textContent || 'cards area';
        announceToScreenReader(`Dropped card in ${binName}`);
      }
    });
  });
}

function initMiniTerms() {
  buildTermCards();
  
  $('#btnCheckTerms').addEventListener('click', () => {
    let total = 0;
    let correct = 0;
    const results = [];
    
    TERM_ITEMS.forEach((item) => {
      total += 1;
      const card = document.querySelector('.card[data-id="' + item.id + '"]');
      
      if (!card || !card.parentElement) return;
      
      const parent = card.parentElement;
      const parentTerm = parent.dataset.term || '';
      const isCorrect = parentTerm === item.term;
      
      if (isCorrect) {
        correct += 1;
      }
      
      results.push({
        text: item.text,
        correct: isCorrect,
        expected: item.term,
        actual: parentTerm
      });
    });
    
    const feedback = $('#miniTermsFeedback');
    
    if (correct === total) {
      showFeedback(feedback, '✅ Perfect! You understand how payment terms affect cash flow timing. Longer credit terms mean cash arrives later, which can create cash flow problems.', true);
    } else {
      const incorrectItems = results.filter(r => !r.correct).length;
      showFeedback(feedback, `❌ ${incorrectItems} statement${incorrectItems > 1 ? 's are' : ' is'} in the wrong box. Remember: think about WHEN the cash actually arrives in the business bank account, not when the sale happens.`, false);
    }
  });
}

// Mini check 3: Enhanced advantages/disadvantages
const ADV_ITEMS = [
  { id: 'a1', text: 'Helps businesses spot cash shortages before they happen, allowing time to fix problems', type: 'adv' },
  { id: 'a2', text: 'Supports planning for large purchases like equipment or vehicles', type: 'adv' },
  { id: 'a3', text: 'Can be shown to banks and investors to demonstrate good financial planning', type: 'adv' },
  { id: 'd1', text: 'Based on estimates and predictions, so may not be completely accurate', type: 'dis' },
  { id: 'd2', text: 'Takes time and effort to create and update regularly', type: 'dis' },
  { id: 'd3', text: 'Unexpected events (like losing a big customer) can quickly make forecasts outdated', type: 'dis' }
];

function buildAdvCards() {
  const holder = $('#advCards');
  holder.innerHTML = '';
  
  ADV_ITEMS.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.textContent = item.text;
    card.dataset.typeTarget = item.type;
    card.dataset.id = item.id;
    card.setAttribute('draggable', 'true');
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Drag this card: ${item.text}`);
    
    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', item.id);
      card.style.opacity = '0.5';
    });
    
    card.addEventListener('dragend', () => {
      card.style.opacity = '1';
    });
    
    // Keyboard support
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const bins = $$('.bin[data-type]');
        for (const bin of bins) {
          if (bin.children.length === 1) {
            bin.appendChild(card);
            announceToScreenReader(`Moved to ${bin.querySelector('strong').textContent}`);
            break;
          }
        }
      }
    });
    
    holder.appendChild(card);
  });

  ['bin-adv', 'bin-dis', 'advCards'].forEach((id) => {
    const bin = document.getElementById(id);
    
    bin.addEventListener('dragover', (e) => {
      e.preventDefault();
      bin.style.backgroundColor = '#f0fdf4';
    });
    
    bin.addEventListener('dragleave', () => {
      bin.style.backgroundColor = '';
    });
    
    bin.addEventListener('drop', (e) => {
      e.preventDefault();
      bin.style.backgroundColor = '';
      
      const idDropped = e.dataTransfer.getData('text/plain');
      const card = document.querySelector('.card[data-id="' + idDropped + '"]');
      
      if (card) {
        bin.appendChild(card);
      }
    });
  });
}

function initMiniAdv() {
  buildAdvCards();
  
  $('#btnCheckAdv').addEventListener('click', () => {
    let total = 0;
    let correct = 0;
    
    ADV_ITEMS.forEach((item) => {
      total += 1;
      const card = document.querySelector('.card[data-id="' + item.id + '"]');
      
      if (!card || !card.parentElement) return;
      
      const parentType = card.parentElement.dataset.type || '';
      if (parentType === item.type) correct += 1;
    });
    
    const feedback = $('#miniAdvFeedback');
    
    if (correct === total) {
      showFeedback(feedback, '✅ Excellent work! You clearly understand the benefits and limitations of cash flow forecasting. This knowledge will help you make better business decisions.', true);
    } else {
      const incorrect = total - correct;
      showFeedback(feedback, `❌ ${incorrect} card${incorrect > 1 ? 's are' : ' is'} in the wrong place. Think: Do advantages help with planning? Do disadvantages show problems or limitations?`, false);
    }
  });
}

// Enhanced preset functions with better descriptions
function preset(type) {
  initState();
  
  const presets = {
    entry: {
      opening: 500,
      termDays: 0,
      description: 'Small startup with cash sales',
      setup: () => {
        for (let i = 0; i < state.months; i++) {
          state.sales[i] = 1200;
          state.outflows[i] = 1000;
        }
        state.outflows[2] += 800; // Equipment purchase in March
      }
    },
    core: {
      opening: 1000,
      termDays: 30,
      description: 'Established business with 30-day credit terms',
      setup: () => {
        for (let i = 0; i < state.months; i++) {
          state.sales[i] = 2000;
          state.inflows[i] = 100;
          state.outflows[i] = 1800;
        }
        state.outflows[5] += 1500; // Large payment in June
      }
    },
    stretch: {
      opening: 300,
      termDays: 60,
      description: 'Growing business with longer payment terms',
      setup: () => {
        for (let i = 0; i < state.months; i++) {
          state.sales[i] = 2200;
          state.outflows[i] = 2100;
        }
        state.outflows[0] += 1200; // January equipment
        state.outflows[8] += 2500; // September expansion
      }
    }
  };
  
  const preset_data = presets[type];
  if (!preset_data) return;
  
  state.opening = preset_data.opening;
  state.termDays = preset_data.termDays;
  preset_data.setup();
  
  $('#opening').value = state.opening;
  $('#term').value = String(state.termDays);
  
  buildTable();
  
  announceToScreenReader(`Loaded ${preset_data.description} scenario`);
}

// Enhanced event handlers
function initEventHandlers() {
  // Month selection
  $('#months').addEventListener('change', (e) => {
    state.months = Number(e.target.value);
    initState();
    buildTable();
    announceToScreenReader(`Changed to ${state.months} months forecast`);
  });

  // Opening balance
  $('#opening').addEventListener('input', (e) => {
    state.opening = Number(e.target.value || 0);
    recalc();
  });

  // Payment terms
  $('#term').addEventListener('change', (e) => {
    state.termDays = Number(e.target.value || 0);
    recalc();
    
    const termText = e.target.options[e.target.selectedIndex].text;
    announceToScreenReader(`Payment terms changed to ${termText}`);
  });

  // Preset buttons
  $('#presetEntry').addEventListener('click', () => preset('entry'));
  $('#presetCore').addEventListener('click', () => preset('core'));
  $('#presetStretch').addEventListener('click', () => preset('stretch'));

  // Utility buttons
  $('#printBtn').addEventListener('click', () => {
    announceToScreenReader('Opening print dialog');
    window.print();
  });

  $('#resetBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      state.months = 12;
      state.opening = 1000;
      state.termDays = 30;
      $('#months').value = '12';
      $('#opening').value = '1000';
      $('#term').value = '30';
      initState();
      buildTable();
      announceToScreenReader('Forecast reset to default values');
    }
  });
}

// Application initialization
function initApp() {
  // Add skip link for accessibility
  const skipLink = document.createElement('a');
  skipLink.href = '#main';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';
  document.body.insertBefore(skipLink, document.body.firstChild);
  
  // Add main landmark
  const main = document.querySelector('main');
  if (main) {
    main.id = 'main';
    main.setAttribute('role', 'main');
  }
  
  // Initialize application state and components
  initState();
  buildTable();
  initPurposeTask();
  initMiniNegative();
  initMiniTerms();
  initMiniAdv();
  initEventHandlers();
  
  // Welcome message for screen readers
  announceToScreenReader('Cash Flow Forecast Lab loaded. Use the controls to explore different scenarios and complete the learning activities.');
  
  console.log('Cash Flow Forecast Lab initialized successfully');
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}