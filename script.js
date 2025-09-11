// ====== DEMO DATA ======
const placeholderSVG = (label = 'JKL Veículos') =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 675'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='#c52222'/>
        <stop offset='1' stop-color='#9c1f1f'/>
      </linearGradient>
    </defs>
    <rect width='1200' height='675' fill='#0b1117'/>
    <g opacity='.2'>
      <circle cx='200' cy='200' r='240' fill='url(#g)'/>
      <circle cx='900' cy='500' r='320' fill='url(#g)'/>
    </g>
    <g fill='white'>
      <text x='600' y='360' text-anchor='middle' font-size='80' font-family='Inter, Arial, sans-serif' font-weight='800'>${label}</text>
    </g>
  </svg>`)}`;

let cars = [
  {id:1, make:'Chevrolet', model:'Onix LT 1.0', year:2021, km:42000, price:68990, fuel:'Flex', transmission:'Manual', color:'Prata', images:['files/onix_2021.jpg', placeholderSVG('Onix 2021 Interior'), placeholderSVG('Onix 2021 Detalhe')]},
  {id:2, make:'Volkswagen', model:'T-Cross Comfortline 1.0 TSI', year:2022, km:28000, price:119900, fuel:'Flex', transmission:'Automático', color:'Branco', images:['files/t-cross2022.jpg', placeholderSVG('T-Cross Painel'), placeholderSVG('T-Cross Roda')]},
  {id:3, make:'Fiat', model:'Argo Drive 1.0', year:2020, km:51000, price:56990, fuel:'Flex', transmission:'Manual', color:'Vermelho', images:['files/argo2020.jpeg', placeholderSVG('Argo 2020 Interior')]},
  {id:4, make:'Toyota', model:'Corolla XEi 2.0', year:2019, km:62000, price:109900, fuel:'Flex', transmission:'Automático', color:'Preto', images:['files/corolla2019.jpg', placeholderSVG('Corolla 2019 Painel')]},
  {id:5, make:'Hyundai', model:'HB20S Vision 1.0', year:2023, km:15000, price:82990, fuel:'Flex', transmission:'Manual', color:'Cinza', images:['files/hb20s2023.jpg', placeholderSVG('HB20S 2023 Detalhe')]},
  {id:6, make:'Jeep', model:'Compass Longitude 1.3 T270', year:2023, km:18000, price:149900, fuel:'Flex', transmission:'Automático', color:'Branco', images:['files/compass2023.jpg', placeholderSVG('Compass 2023 Interior')]},
  {id:7, make:'Renault', model:'Kwid Zen 1.0', year:2021, km:35000, price:47990, fuel:'Flex', transmission:'Manual', color:'Azul', images:['files/kwid2021.jpg']},
  {id:8, make:'Honda', model:'Civic EX 2.0', year:2018, km:74000, price:99900, fuel:'Flex', transmission:'Automático', color:'Prata', images:['files/civic2018.jpg', placeholderSVG('Civic 2018 Roda')]},
  {id:9, make:'Nissan', model:'Kicks SV 1.6', year:2022, km:22000, price:112900, fuel:'Flex', transmission:'Automático', color:'Laranja', images:['files/kicks2022.jpg', placeholderSVG('Kicks 2022 Painel'), placeholderSVG('Kicks 2022 Mala')]}
];

// ====== AUTH & STATE ======
const adminCredentials = { user: 'admin', pass: 'jkl123' };
let state = { q:'', make:'', sort:'relevance', minPrice:'', maxPrice:'', isLoggedIn: false, currentSliderIndex: 0 };
let uploadedImageFiles = [];

const money = v => v.toLocaleString('pt-BR', {style:'currency', currency:'BRL'});

const els = {
  grid: document.getElementById('grid'),
  empty: document.getElementById('empty'),
  q: document.getElementById('q'),
  make: document.getElementById('make'),
  sort: document.getElementById('sort'),
  minPrice: document.getElementById('minPrice'),
  maxPrice: document.getElementById('maxPrice'),
  clear: document.getElementById('clearFilters'),
  year: document.getElementById('year'),
  mobileToggle: document.querySelector('.mobile-toggle'),
  menu: document.querySelector('.menu'),
  body: document.body,
  // Modals
  carModal: document.getElementById('carModal'),
  carTitle: document.getElementById('carTitle'),
  carName: document.getElementById('carName'),
  carPrice: document.getElementById('carPrice'),
  carImg: document.getElementById('carImg'),
  carTags: document.getElementById('carTags'),
  carSpecs: document.getElementById('carSpecs'),
  ctaWhatsapp: document.getElementById('ctaWhatsapp'),
  sliderThumbnails: document.getElementById('sliderThumbnails'),
  sliderPrev: document.getElementById('sliderPrev'),
  sliderNext: document.getElementById('sliderNext'),
  // Admin
  loginBtn: document.getElementById('loginBtn'),
  adminBtn: document.getElementById('adminBtn'),
  loginModal: document.getElementById('loginModal'),
  loginForm: document.getElementById('loginForm'),
  loginError: document.getElementById('loginError'),
  addVehicleModal: document.getElementById('addVehicleModal'),
  addVehicleForm: document.getElementById('addVehicleForm'),
  imageUploadInput: document.getElementById('imageUpload'),
  imagePreviewContainer: document.getElementById('imagePreviewContainer')
};

// ====== RENDER ======
function populateMakes(){
  const makes = [...new Set(cars.map(c => c.make))].sort();
  els.make.innerHTML = '<option value="">Todas as marcas</option>'; // Clear previous
  const frag = document.createDocumentFragment();
  makes.forEach(m => {
    const o = document.createElement('option');
    o.value = m; o.textContent = m; frag.appendChild(o);
  });
  els.make.appendChild(frag);
}

function vehicleCard(car){
  const card = document.createElement('article');
  card.className = 'card';
  const mainImage = car.images && car.images.length > 0 ? car.images[0] : placeholderSVG(car.make);
  card.innerHTML = `
    <button class="delete-btn" data-action="delete" data-id="${car.id}" aria-label="Apagar veículo">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/></svg>
    </button>
    <div class="thumb"><img loading="lazy" src="${mainImage}" alt="${car.make} ${car.model} ${car.year}" onerror="this.onerror=null;this.src=placeholderSVG('${car.make}');"/></div>
    <div class="body">
      <h3>${car.make} ${car.model} • ${car.year}</h3>
      <div class="price">${money(car.price)}</div>
      <div class="tags">
        <span class="tag">${car.km.toLocaleString('pt-BR')} km</span>
        <span class="tag">${car.fuel}</span>
        <span class="tag">${car.transmission}</span>
        <span class="tag">Cor ${car.color}</span>
      </div>
      <div class="actions">
        <button class="btn brand" data-action="whatsapp" aria-label="Entrar em contato por WhatsApp">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.1-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>
          <span>WhatsApp</span>
        </button>
        <button class="btn ghost" data-action="details" aria-label="Ver detalhes do veículo">Detalhes</button>
      </div>
    </div>`;

  card.addEventListener('click', (e) => {
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (action === 'whatsapp') openWhats(car);
    if (action === 'details') openModal(car.id, 'carModal');
    if (action === 'delete') handleDeleteVehicle(car.id);
  });
  return card;
}

function applyFiltersAndRender(){
  const q = state.q.trim().toLowerCase();
  let list = cars.filter(c => {
    const searchString = `${c.make} ${c.model} ${c.year} ${c.color}`.toLowerCase();
    const okQ = !q || searchString.includes(q);
    const okMake = !state.make || c.make === state.make;
    const okMin = !state.minPrice || c.price >= Number(state.minPrice);
    const okMax = !state.maxPrice || c.price <= Number(state.maxPrice);
    return okQ && okMake && okMin && okMax;
  });

  switch(state.sort){
    case 'priceAsc': list.sort((a,b) => a.price - b.price); break;
    case 'priceDesc': list.sort((a,b) => b.price - a.price); break;
    case 'yearDesc': list.sort((a,b) => b.year - a.year); break;
    case 'kmAsc': list.sort((a,b) => a.km - b.km); break;
  }
  renderList(list);
}

function renderList(list){
  els.grid.setAttribute('aria-busy', 'true');
  els.grid.innerHTML = '';
  els.empty.hidden = list.length > 0;
  const frag = document.createDocumentFragment();
  list.forEach(car => frag.appendChild(vehicleCard(car)));
  els.grid.appendChild(frag);
  els.grid.setAttribute('aria-busy', 'false');
}

// ====== MODALS & ACTIONS ======
function openWhats(car){
  const msg = encodeURIComponent(`Olá, tenho interesse no ${car.make} ${car.model} ${car.year} (${money(car.price)}). Ainda está disponível?`);
  const phone = '5584994510452';
  window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
}

function updateSliderImage(car, index) {
    els.carImg.src = car.images[index];
    els.sliderThumbnails.querySelectorAll('img').forEach((img, i) => {
        img.classList.toggle('active', i === index);
    });
    state.currentSliderIndex = index;
}

function openModal(id, modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    if (modalId === 'carModal') {
        const car = cars.find(c => c.id === id);
        if (!car) return;
        
        // Car details
        els.carTitle.textContent = `${car.make} ${car.model}`;
        els.carName.textContent = `${car.make} ${car.model} • ${car.year}`;
        els.carPrice.textContent = money(car.price);
        els.carTags.innerHTML = '';
        [car.fuel, car.transmission, `${car.km.toLocaleString('pt-BR')} km`, `Cor ${car.color}`].forEach(t => {
            const s = document.createElement('span'); s.className = 'tag'; s.textContent = t; els.carTags.appendChild(s);
        });
        els.carSpecs.innerHTML = '';
        const specs = { 'Ano/modelo': car.year, 'Combustível': car.fuel, 'Câmbio': car.transmission, 'Quilometragem': `${car.km.toLocaleString('pt-BR')} km` };
        Object.entries(specs).forEach(([k, v]) => {
            const d = document.createElement('div'); d.className = 'spec';
            d.innerHTML = `<strong>${k}</strong><div class="sub">${v}</div>`;
            els.carSpecs.appendChild(d);
        });
        const msg = encodeURIComponent(`Olá! Tenho interesse no ${car.make} ${car.model} ${car.year}. Podemos conversar?`);
        els.ctaWhatsapp.href = `https://wa.me/5584994510452?text=${msg}`;

        // Image Slider
        els.sliderThumbnails.innerHTML = '';
        if (car.images && car.images.length > 0) {
            car.images.forEach((imgSrc, index) => {
                const img = document.createElement('img');
                img.src = imgSrc;
                img.alt = `Imagem ${index + 1} de ${car.model}`;
                img.onclick = () => updateSliderImage(car, index);
                els.sliderThumbnails.appendChild(img);
            });
            updateSliderImage(car, 0); // Start with the first image
            
            els.sliderPrev.onclick = () => {
                const newIndex = (state.currentSliderIndex - 1 + car.images.length) % car.images.length;
                updateSliderImage(car, newIndex);
            };
            els.sliderNext.onclick = () => {
                const newIndex = (state.currentSliderIndex + 1) % car.images.length;
                updateSliderImage(car, newIndex);
            };
            els.sliderPrev.style.display = car.images.length > 1 ? 'grid' : 'none';
            els.sliderNext.style.display = car.images.length > 1 ? 'grid' : 'none';

        } else { // Fallback if no images
            els.carImg.src = placeholderSVG(car.make);
            els.sliderPrev.style.display = 'none';
            els.sliderNext.style.display = 'none';
        }
    }
    modal.showModal();
}

function closeModal(modalId){ 
    const modal = document.getElementById(modalId);
    if (modal) modal.close();
}
window.closeModal = closeModal;

function handleForm(formId, msgId){
  const form = document.getElementById(formId);
  const msgEl = document.getElementById(msgId);
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    if(!data.name || !data.phone){
      msgEl.textContent = 'Por favor, informe nome e telefone.';
      msgEl.style.color = 'var(--warning)';
      return;
    }
    msgEl.textContent = 'Recebemos sua solicitação! Em breve entraremos em contato.';
    msgEl.style.color = 'var(--brand)';
    form.reset();
    setTimeout(() => msgEl.textContent = '', 5000);
  });
}

// ====== ADMIN LOGIC ======
function updateUIforLoginState() {
    const addBtnId = 'addVehicleBtn';
    let addBtn = document.getElementById(addBtnId);

    if (state.isLoggedIn) {
        els.body.classList.add('logged-in');
        els.loginBtn.style.display = 'none';
        els.adminBtn.style.display = 'flex';
        els.adminBtn.innerHTML = 'Sair';
        els.adminBtn.onclick = handleLogout;
        
        if (!addBtn) {
            addBtn = document.createElement('button');
            addBtn.id = addBtnId;
            addBtn.className = 'btn brand';
            addBtn.textContent = 'Adicionar Veículo';
            addBtn.onclick = () => openModal(null, 'addVehicleModal');
            els.adminBtn.insertAdjacentElement('beforebegin', addBtn);
        }
    } else {
        els.body.classList.remove('logged-in');
        els.loginBtn.style.display = 'flex';
        els.adminBtn.style.display = 'none';
        els.adminBtn.innerHTML = 'Painel';
        els.adminBtn.onclick = null;

        if (addBtn) {
            addBtn.remove();
        }
    }
    applyFiltersAndRender();
}

function handleLogin(e) {
    e.preventDefault();
    const user = e.target.username.value;
    const pass = e.target.password.value;
    if (user === adminCredentials.user && pass === adminCredentials.pass) {
        state.isLoggedIn = true;
        sessionStorage.setItem('isLoggedIn', 'true');
        updateUIforLoginState();
        closeModal('loginModal');
        els.loginForm.reset();
        els.loginError.textContent = '';
    } else {
        els.loginError.textContent = 'Usuário ou senha inválidos.';
    }
}

function handleLogout() {
    state.isLoggedIn = false;
    sessionStorage.removeItem('isLoggedIn');
    updateUIforLoginState();
}

function handleAddVehicle(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target).entries());
    const images = uploadedImageFiles.length > 0 ? uploadedImageFiles : [placeholderSVG(`${data.make} ${data.model}`)];
    const newCar = {
        id: Date.now(),
        make: data.make,
        model: data.model,
        year: Number(data.year),
        km: Number(data.km),
        price: Number(data.price),
        fuel: data.fuel,
        transmission: data.transmission,
        color: data.color,
        images: images
    };
    cars.unshift(newCar);
    applyFiltersAndRender();
    populateMakes();
    e.target.reset();
    els.imagePreviewContainer.innerHTML = '';
    uploadedImageFiles = [];
    closeModal('addVehicleModal');
}

function handleDeleteVehicle(carId) {
    if (confirm('Tem certeza que deseja apagar este veículo?')) {
        cars = cars.filter(c => c.id !== carId);
        applyFiltersAndRender();
        populateMakes();
    }
}

// ====== INIT ======
document.addEventListener('DOMContentLoaded', () => {
  populateMakes();
  applyFiltersAndRender();
  els.year.textContent = new Date().getFullYear();

  const bindFilter = (el, key) => {
    el.addEventListener('input', () => { state[key] = el.value; applyFiltersAndRender(); });
  };
  bindFilter(els.q, 'q');
  bindFilter(els.make, 'make');
  bindFilter(els.sort, 'sort');
  bindFilter(els.minPrice, 'minPrice');
  bindFilter(els.maxPrice, 'maxPrice');

  els.clear.addEventListener('click', () => {
    els.q.value = els.make.value = els.minPrice.value = els.maxPrice.value = '';
    els.sort.value = 'relevance';
    Object.assign(state, { q:'', make:'', sort:'relevance', minPrice:'', maxPrice:'' });
    applyFiltersAndRender();
  });

  handleForm('financeForm', 'financeMsg');
  handleForm('tradeForm', 'tradeMsg');
  
  els.mobileToggle.addEventListener('click', () => els.menu.classList.toggle('active'));
  els.menu.addEventListener('click', (e) => { if (e.target.tagName === 'A') els.menu.classList.remove('active'); });

  // Admin Init
  els.loginBtn.addEventListener('click', () => openModal(null, 'loginModal'));
  els.loginForm.addEventListener('submit', handleLogin);
  els.addVehicleForm.addEventListener('submit', handleAddVehicle);
  if (sessionStorage.getItem('isLoggedIn') === 'true') {
      state.isLoggedIn = true;
  }
  updateUIforLoginState();

  // Image Upload Preview Handler
  if (els.imageUploadInput) {
    els.imageUploadInput.addEventListener('change', (event) => {
        els.imagePreviewContainer.innerHTML = ''; 
        uploadedImageFiles = [];
        const files = Array.from(event.target.files);

        files.forEach(file => {
            if (!file.type.startsWith('image/')) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedImageFiles.push(e.target.result);
                const img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('preview-img');
                els.imagePreviewContainer.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    });
  }

  // Theme Toggler
  const themeToggle = document.getElementById('theme-toggle');
  const iconMoon = themeToggle.querySelector('.icon-moon');
  const iconSun = themeToggle.querySelector('.icon-sun');

  function setTheme(theme) {
    if (theme === 'light') {
      els.body.classList.add('light-theme');
      iconMoon.style.display = 'none'; iconSun.style.display = 'block';
      localStorage.setItem('theme', 'light');
    } else {
      els.body.classList.remove('light-theme');
      iconMoon.style.display = 'block'; iconSun.style.display = 'none';
      localStorage.setItem('theme', 'dark');
    }
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });

  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      ['carModal', 'loginModal', 'addVehicleModal'].forEach(id => {
        const modal = document.getElementById(id);
        if (modal && modal.open) closeModal(id);
      });
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      } else {
        entry.target.classList.remove('is-visible');
      }
    });
  }, { 
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1 
  });

  document.querySelectorAll('.headline, .sub, .cta, .hero-card, .section h2, .filters, .grid, .panel').forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
  });
});

