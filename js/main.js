document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // NAVBAR E ROLAGEM
  // ==========================================
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('nav a');
  const sections = document.querySelectorAll('section');
  
  const handleScroll = () => {
    // Adiciona classe scrolled ao rolar
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Link ativo conforme a seção visível
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Executa no carregamento inicial

  // ==========================================
  // MENU MOBILE
  // ==========================================
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('nav');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Fecha o menu ao clicar em um link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // ==========================================
  // EFEITO REVEAL (INTERSECTION OBSERVER)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Deixa de observar após revelar
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================
  // DEMONSTRAÇÃO INTERATIVA - TABS
  // ==========================================
  const demoTabs = document.querySelectorAll('.demo-tab');
  const demoScreens = document.querySelectorAll('.demo-screen');

  demoTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove classe active de todas as abas
      demoTabs.forEach(t => t.classList.remove('active'));
      // Adiciona active na clicada
      tab.classList.add('active');

      // Alterna as telas correspondentes
      const targetTab = tab.getAttribute('data-tab');
      demoScreens.forEach(screen => {
        screen.classList.remove('active');
        if (screen.getAttribute('id') === targetTab) {
          screen.classList.add('active');
        }
      });
    });
  });

  // ==========================================
  // DEMONSTRAÇÃO INTERATIVA - MAPA DO ARMAZÉM
  // ==========================================
  const mapCells = document.querySelectorAll('.map-cell');
  const detailAddr = document.getElementById('detailAddr');
  const detailProd = document.getElementById('detailProd');
  const detailLote = document.getElementById('detailLote');
  const detailQty = document.getElementById('detailQty');

  const updateMapDetails = (cell) => {
    const address = cell.getAttribute('data-addr');
    const product = cell.getAttribute('data-prod');
    const lote = cell.getAttribute('data-lote');
    const qty = cell.getAttribute('data-qty');

    detailAddr.textContent = address;
    detailProd.textContent = product;
    detailLote.textContent = lote;
    detailQty.textContent = qty;
  };

  mapCells.forEach(cell => {
    // Evento de hover (Desktop)
    cell.addEventListener('mouseenter', () => {
      mapCells.forEach(c => c.classList.remove('selected'));
      cell.classList.add('selected');
      updateMapDetails(cell);
    });

    // Evento de clique (Mobile e Desktop)
    cell.addEventListener('click', () => {
      mapCells.forEach(c => c.classList.remove('selected'));
      cell.classList.add('selected');
      updateMapDetails(cell);
    });
  });

  // ==========================================
  // DEMONSTRAÇÃO INTERATIVA - CONSULTA
  // ==========================================
  const querySearchInput = document.getElementById('querySearchInput');
  const btnRunQuerySearch = document.getElementById('btnRunQuerySearch');
  const queryResultTable = document.getElementById('queryResultTable');
  const queryTableRows = queryResultTable ? queryResultTable.querySelectorAll('tbody tr') : [];
  const queryNoResults = document.getElementById('queryNoResults');

  const performSearch = () => {
    if (!querySearchInput) return;
    const searchTerm = querySearchInput.value.trim().toLowerCase();
    let matchCount = 0;

    queryTableRows.forEach(row => {
      const keywords = row.getAttribute('data-keywords').toLowerCase();
      if (keywords.includes(searchTerm)) {
        row.style.display = '';
        matchCount++;
      } else {
        row.style.display = 'none';
      }
    });

    if (matchCount === 0) {
      if (queryResultTable) queryResultTable.style.display = 'none';
      if (queryNoResults) queryNoResults.style.display = 'block';
    } else {
      if (queryResultTable) queryResultTable.style.display = 'table';
      if (queryNoResults) queryNoResults.style.display = 'none';
    }
  };

  if (btnRunQuerySearch) {
    btnRunQuerySearch.addEventListener('click', performSearch);
  }

  if (querySearchInput) {
    querySearchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
    // Limpa a busca e restaura as linhas se o campo for apagado
    querySearchInput.addEventListener('input', () => {
      if (querySearchInput.value.trim() === '') {
        queryTableRows.forEach(row => {
          row.style.display = '';
        });
        if (queryResultTable) queryResultTable.style.display = 'table';
        if (queryNoResults) queryNoResults.style.display = 'none';
      }
    });
  }

  // ==========================================
  // FORMULÁRIO DE CONTATO
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const company = document.getElementById('company').value.trim();
      const message = document.getElementById('message').value.trim();

      // Todos os campos são obrigatórios
      if (!name || !email || !phone || !company || !message) {
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Por favor, preencha todos os campos obrigatórios.';
        return;
      }

      // Efeito de carregamento no botão
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';

      // Envia os dados do formulário via API para olnwmssolutions@gmail.com usando o serviço FormSubmit
      fetch('https://formsubmit.co/ajax/olnwmssolutions@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Nome: name,
          Email: email,
          Celular: phone,
          Empresa: company,
          Mensagem: message
        })
      })
      .then(response => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        if (response.ok) {
          formStatus.className = 'form-status success';
          formStatus.textContent = `Mensagem enviada! Na primeira vez, clique no link de ativação enviado para olnwmssolutions@gmail.com para habilitar o recebimento das mensagens.`;
          contactForm.reset();
        } else {
          formStatus.className = 'form-status error';
          formStatus.textContent = 'Ocorreu um erro no servidor de envio. Por favor, tente novamente.';
        }
        
        setTimeout(() => {
          formStatus.style.display = 'none';
        }, 8000);
      })
      .catch(error => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Erro de conexão. Verifique sua rede e tente novamente.';
        
        setTimeout(() => {
          formStatus.style.display = 'none';
        }, 5000);
      });
    });
  }
});
