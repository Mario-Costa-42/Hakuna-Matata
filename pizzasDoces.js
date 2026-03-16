const FLAVORS = [
  { 
    id: 0, 
    nome: "Pizza Brigadeiro", 
    desc: "Brigadeiro , granulado", 
    prices: {"Média": 45.00}, // Unique prices
    topping: "#1E120B"
  },
  { 
    id: 1, 
    nome: "Pizza Beijinho", 
    desc: "Beijinho de coco", 
    prices: {"Média": 45.00}, // No fixed pattern
    topping: "#1E120B"
  },
  { 
    id: 2, 
    nome: "Pizza Romeu e Julieta", 
    desc: "Mussarela, goiabada , canela", 
    prices: {"Média": 47.00 }, // No fixed pattern
    topping: "#1E120B" 
  },
  { 
    id: 3, 
    nome: "Pizza Prestígio", 
    desc: "Beijinho , gotas de chocolate", 
    prices: {"Média": 47.00}, // Unique prices
    topping: "#1E120B"  
  },
  { 
    id: 4, 
    nome: "Pizza paçoquinha", 
    desc: "Brigadeiro, paçoquinha, cereja, gotas de chocolate", 
    prices: {"Média": 49.00}, // Unique prices
    topping: "#1E120B"  
  },
];

    const BORDAS = [
      { id: 0, nome: "Sem borda",  price: 0    },
      { id: 1, nome: "Catupiry",   price: 5.00 },
      { id: 2, nome: "Cheddar",    price: 5.00 },
      { id: 3, nome: "Chocolate",  price: 6.00 },
    ];

    let numSabores    = 1;
    let chosenFlavors = [null];
    let currentSlot   = 0;
    let chosenBorda   = 0;

    // ── Sabores ───────────────────────────────────────────────
function changeSabores(d) {
  // Change FLAVORS.length to 2 to set the maximum limit
  numSabores = Math.max(1, Math.min(2, numSabores + d)); 
  
  document.getElementById('saboresLabel').textContent =
    numSabores + (numSabores === 1 ? ' SABOR' : ' SABORES');
    
  chosenFlavors = chosenFlavors.slice(0, numSabores);
  while (chosenFlavors.length < numSabores) chosenFlavors.push(null);
  
  rebuildPizzaHalves();
  updateSelectedFlavorsBox();
  updatePrice();
}

    // ── Pizza circle ──────────────────────────────────────────
    function sliceClip(i, sweepDeg) {
      const pts = ['50% 50%'];
      const steps = Math.max(8, Math.ceil(sweepDeg / 8));
      const overlap = 0.5; // degrees of overlap to hide seam
      for (let s = 0; s <= steps; s++) {
        const deg = (i * sweepDeg - 90 - overlap) + (sweepDeg + overlap * 2) * s / steps;
        pts.push(`${(50 + 70 * Math.cos(deg * Math.PI / 180)).toFixed(2)}% ${(50 + 70 * Math.sin(deg * Math.PI / 180)).toFixed(2)}%`);
      }
      return `polygon(${pts.join(', ')})`;
    }

    function rebuildPizzaHalves() {
      const circle = document.getElementById('pizzaCircle');
      circle.querySelectorAll('.slice-segment,.slice-overlay,.slice-label,.pizza-divider-line,.pizza-touch-icon')
            .forEach(e => e.remove());

      const n = numSabores;
      const sweepDeg = 360 / n;

      for (let i = 0; i < n; i++) {
        // Base segment
        const seg = document.createElement('div');
        seg.className = 'slice-segment';
        seg.style.cssText = `
          position:absolute; width:100%; height:100%; top:0; left:0;
          background: radial-gradient(circle at 50% 50%, #2a2a2a 0%, #1a1a1a 100%);
          clip-path: ${n === 1 ? 'circle(50%)' : sliceClip(i, sweepDeg)};
          cursor:pointer; z-index:1; transition:filter 0.15s;
        `;
        seg.addEventListener('click', () => openFlavor(i));
        seg.addEventListener('mouseenter', () => { if (!seg.style.filter) seg.style.filter = 'brightness(1.5)'; });
        seg.addEventListener('mouseleave', () => seg.style.filter = '');
        circle.appendChild(seg);

        // Divider line
      // Draw divider spokes in a single SVG — one spoke per slice boundary
      if (n > 1) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '220');
        svg.setAttribute('height', '220');
        svg.setAttribute('viewBox', '0 0 220 220');
        svg.style.cssText = `position:absolute; top:0; left:0; z-index:9; pointer-events:none;`;
        svg.classList.add('pizza-divider-line');

        const cx = 110, cy = 110, r = 96;
        for (let i = 0; i < n; i++) {
          const rad = (i * sweepDeg - 90) * Math.PI / 180;
          const x2 = cx + r * Math.cos(rad);
          const y2 = cy + r * Math.sin(rad);

          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', cx);
          line.setAttribute('y1', cy);
          line.setAttribute('x2', x2.toFixed(2));
          line.setAttribute('y2', y2.toFixed(2));
          line.setAttribute('stroke', 'rgba(255,255,255,0.3)');
          line.setAttribute('stroke-width', '1');
          svg.appendChild(line);
        }
        circle.appendChild(svg);
      }

        // Label
        const lbl = document.createElement('div');
        lbl.className = 'slice-label';
        lbl.id = 'lbl_' + i;
        const midDeg = (i * sweepDeg + sweepDeg / 2) - 90;
        const lx = 50 + 55 * Math.cos(midDeg * Math.PI / 180) / 1.0;
        const ly = 50 + 55 * Math.sin(midDeg * Math.PI / 180) / 1.0;
        lbl.style.cssText = `
          position:absolute; left:${lx}%; top:${ly}%;
          transform:translate(-50%,-50%);
          z-index:9; pointer-events:none;
          font-family:'Oswald',sans-serif; font-size:0.55rem;
          letter-spacing:1px; color:rgba(255,255,255,0.55);
          text-align:center; text-transform:uppercase;
          max-width:65px; line-height:1.3;
        `;
        lbl.textContent = chosenFlavors[i] != null ? FLAVORS[chosenFlavors[i]].nome : 'toque';
        circle.appendChild(lbl);
      }

      // Re-apply overlays
      chosenFlavors.forEach((id, slot) => { if (id !== null) applySliceOverlay(slot, id); });
    }

    function applySliceOverlay(slot, flavorId) {
      const circle = document.getElementById('pizzaCircle');
      const existing = circle.querySelector(`.slice-overlay[data-slot="${slot}"]`);
      if (existing) existing.remove();

      const f = FLAVORS[flavorId];
      const n = numSabores;
      const sweepDeg = 360 / n;
      const startDeg = slot * sweepDeg - 90;

      const overlay = document.createElement('div');
      overlay.className = 'slice-overlay';
      overlay.dataset.slot = slot;
      overlay.style.cssText = `
        position:absolute; width:100%; height:100%; top:0; left:0;
        z-index:2; pointer-events:none;
        clip-path: ${n === 1 ? 'circle(50%)' : sliceClip(slot, sweepDeg)};
      `;

      // Topping dots scattered in the slice
      const dots = Array.from({ length: 10 }, (_, k) => {
        const angle = startDeg + sweepDeg * (0.15 + k * 0.07);
        const dist  = 18 + (k % 4) * 18;
        const cx = 110 + dist * Math.cos(angle * Math.PI / 180);
        const cy = 110 + dist * Math.sin(angle * Math.PI / 180);
        const r  = 3 + (k % 3) * 1.5;
        return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r}" fill="${f.topping}" opacity="0.92"/>`;
      }).join('');

      overlay.innerHTML = `
        <svg width="220" height="220" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="sg${slot}" cx="50%" cy="45%" r="60%">
              <stop offset="0%" stop-color="#c0441a"/>
              <stop offset="100%" stop-color="#7a1a00"/>
            </radialGradient>
          </defs>
          <rect width="220" height="220" fill="url(#sg${slot})"/>
          <ellipse cx="100" cy="95"  rx="32" ry="24" fill="#f0c040" opacity="0.80"/>
          <ellipse cx="128" cy="118" rx="26" ry="20" fill="#e8b820" opacity="0.75"/>
          <ellipse cx="92"  cy="128" rx="22" ry="17" fill="#f5cc50" opacity="0.70"/>
          ${dots}
        </svg>`;
      circle.appendChild(overlay);

      // Update label
      const lbl = document.getElementById('lbl_' + slot);
      if (lbl) {
        lbl.textContent = f.nome;
        lbl.style.color = 'rgba(255,255,255,0.9)';
        lbl.style.textShadow = '0 1px 4px rgba(0,0,0,0.9)';
        lbl.style.zIndex = '9';
      }
    }

    // ── Flavor picker ─────────────────────────────────────────
function renderFlavorList(query) {
  const slot = currentSlot;
  const selectedSize = document.getElementById('sizeSelect').value;
  
  const list = query
    ? FLAVORS.filter(f => f.nome.toLowerCase().includes(query.toLowerCase()) || f.desc.toLowerCase().includes(query.toLowerCase()))
    : FLAVORS;

  document.getElementById('flavorList').innerHTML = list.map(f => `
    <div class="flavor-option ${chosenFlavors[slot] === f.id ? 'selected' : ''}" onclick="selectFlavor(${f.id})">
      <div class="flavor-thumb" style="--topping-color:${f.topping}"></div>
      <div class="flavor-info">
        <div class="flavor-num-name"><span class="num">${String(f.id + 1).padStart(2, '0')}-</span>${f.nome.toUpperCase()}</div>
        <div class="flavor-desc-line">${f.desc}</div>
      </div>
      <div class="flavor-price">R$ ${f.prices[selectedSize].toFixed(2).replace('.', ',')}</div>
    </div>
  `).join('');
}

    function filterFlavors() { renderFlavorList(document.getElementById('flavorSearch').value); }

    function openFlavor(slot) {
      currentSlot = slot;
      document.getElementById('flavorPickerTitle').textContent =
        numSabores === 1 ? 'SELECIONE UM SABOR' : `METADE ${slot + 1} – SELECIONE UM SABOR`;
      document.getElementById('flavorSearch').value = '';
      renderFlavorList('');
      document.getElementById('flavorPicker').classList.add('open');
    }

function updateSelectedFlavorsBox() {
  const box  = document.getElementById('selectedFlavorsBox');
  const list = document.getElementById('selectedFlavorsList');
  const sel  = document.getElementById('sizeSelect');
  const selectedSize = sel.value; // Get "Pequena", "Média", or "Grande"
  const any  = chosenFlavors.some(id => id !== null);
  
  box.style.display = any ? 'block' : 'none';
  
  list.innerHTML = chosenFlavors.map((id, slot) => {
    if (id === null) return '';
    const f = FLAVORS[id];
    const label = numSabores === 1 ? 'INTEIRA' : `METADE ${slot + 1}`;
    
    // Get price based on the current selected size
    const currentPrice = f.prices[selectedSize];

    // Clever Ingredient Logic: Split description by comma into tags
    const ingredientsTags = f.desc.split(',').map(item => 
      `<span class="ingredient-tag">${item.trim()}</span>`
    ).join('');

    return `
      <div class="selected-flavor-card">
        <div class="flavor-card-main" style="width: 100%;">
          <div class="flavor-card-top" style="display: flex; align-items: center; justify-content: space-between; gap: 10px;">
            <span class="selected-half-badge">${label}</span>
            <span class="selected-flavor-name" style="flex: 1; font-weight: 700;">${f.nome}</span>
            <span class="selected-flavor-price" style="color: #e67e22; font-weight: 700;">
              R$ ${currentPrice.toFixed(2).replace('.', ',')}
            </span>
          </div>
          
          <div class="ingredients-container" style="display: flex; flex-wrap: wrap; gap: 6px; margin: 10px 0;">
            ${ingredientsTags}
          </div>
          
          <div class="flavor-card-actions" style="display: flex; gap: 8px; border-top: 1px solid #222; padding-top: 10px;">
            <button class="selected-flavor-edit" onclick="openFlavor(${slot})">✎ Trocar</button>
            <button class="selected-flavor-remove" onclick="removeFlavor(${slot})">✕ Remover</button>
          </div>
        </div>
      </div>`;
  }).join('');
}

    function removeFlavor(slot) {
      chosenFlavors[slot] = null;
      // Remove overlay
      const circle = document.getElementById('pizzaCircle');
      const overlay = circle.querySelector(`.slice-overlay[data-slot="${slot}"]`);
      if (overlay) overlay.remove();
      // Reset label
      const lbl = document.getElementById('lbl_' + slot);
      if (lbl) { lbl.textContent = 'toque'; lbl.style.color = 'rgba(255,255,255,0.55)'; lbl.style.textShadow = ''; }
      updateSelectedFlavorsBox();
      updatePrice();
    }

    function selectFlavor(id) {
      chosenFlavors[currentSlot] = id;
      renderFlavorList(document.getElementById('flavorSearch').value);
      applySliceOverlay(currentSlot, id);
      updateSelectedFlavorsBox();
      updatePrice();
    }

    function closeFlavor() { document.getElementById('flavorPicker').classList.remove('open'); }

    // ── Borda picker ──────────────────────────────────────────
    function openBorda() {
      document.getElementById('bordaList').innerHTML = BORDAS.map(b => `
        <div class="borda-option ${chosenBorda === b.id ? 'selected' : ''}" onclick="selectBorda(${b.id})">
          <span class="borda-name">${b.nome}</span>
          <span class="borda-price">${b.price === 0 ? 'Grátis' : '+ R$ ' + b.price.toFixed(2).replace('.', ',')}</span>
        </div>
      `).join('');
      document.getElementById('bordaPicker').classList.add('open');
    }

    function selectBorda(id) {
      chosenBorda = id;
      document.querySelectorAll('.borda-option').forEach((el, i) => el.classList.toggle('selected', BORDAS[i].id === id));
      document.getElementById('bordaLabel').textContent = BORDAS[id].nome;
      updatePrice();
    }

    function closeBorda() { document.getElementById('bordaPicker').classList.remove('open'); }

    // ── Price ─────────────────────────────────────────────────
function updatePrice() {
  const sel = document.getElementById('sizeSelect');
  const selectedSize = sel.value; 
  const pickedFlavors = chosenFlavors.filter(id => id !== null);

  if (pickedFlavors.length === 0) {
    const basePrice = parseFloat(sel.options[sel.selectedIndex].getAttribute('data-price-base'));
    document.getElementById('priceDisplay').textContent = 'R$ ' + basePrice.toFixed(2).replace('.', ',');
    return;
  }

  // This finds the most expensive of the (maximum 2) flavors for the selected size
  const flavorPrices = pickedFlavors.map(id => FLAVORS[id].prices[selectedSize]);
  const total = Math.max(...flavorPrices);

  document.getElementById('priceDisplay').textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
}

    // ── Carrinho ──────────────────────────────────────────────
function adicionarCarrinho() {
  if (!chosenFlavors.every(f => f != null)) { 
    alert('Por favor, escolha todos os sabores!'); 
    return; 
  }

  const sel = document.getElementById('sizeSelect');
  const selectedSize = sel.value; // "Pequena", "Média", or "Grande"
  const tamanhoTexto = sel.options[sel.selectedIndex].text;
  
  const nomes = chosenFlavors.map(id => FLAVORS[id].nome).join(' / ');
  
  // Logic: Use the most expensive flavor price for the selected size
  const preco = Math.max(...chosenFlavors.map(id => FLAVORS[id].prices[selectedSize]));

  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const editIndex = localStorage.getItem('editarIndex');
  
  if (editIndex !== null) { 
    carrinho.splice(editIndex, 1); 
    localStorage.removeItem('editarIndex'); 
  }

  carrinho.push({ 
    produto: 'Pizza', 
    nome: nomes, 
    tamanho: tamanhoTexto, 
    borda: BORDAS[chosenBorda].nome, 
    quantidade: 1, 
    preco: preco, 
    subtotal: preco 
  });

  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  window.location.href = 'carrinho.html';
}

    // ── Init ──────────────────────────────────────────────────
    rebuildPizzaHalves();
    updateSelectedFlavorsBox();
    updatePrice();