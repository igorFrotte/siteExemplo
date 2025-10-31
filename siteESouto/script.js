const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".tab-content");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    contents.forEach(c => c.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

const carrossel = document.querySelector('.carrossel');
  const inners = document.querySelectorAll('.carrossel-inner');
  let pausado = false;

  carrossel.addEventListener('click', () => {
    pausado = !pausado;
    inners.forEach(inner => {
      inner.style.animationPlayState = pausado ? 'paused' : 'running';
    });
  });

const depoimentos = document.querySelectorAll('.depoimento');
const total = depoimentos.length;
const visiveis = 4;
let indice = 0;

function atualizarDepoimentos() {
  depoimentos.forEach(d => d.classList.remove('ativo'));

  for (let i = 0; i < visiveis; i++) {
    const atual = (indice + i) % total;
    depoimentos[atual].classList.add('ativo');
  }

  indice = (indice + visiveis) % total;
}

atualizarDepoimentos(); // mostra os primeiros
setInterval(atualizarDepoimentos, 6000); // troca a cada 6 segundos


const cards = document.querySelectorAll('.depoimento');

cards.forEach(card => {
  card.addEventListener('click', () => {
    window.open('https://www.google.com/search?q=esouto+advocacia&oq=esouto+ad&gs_lcrp=EgZjaHJvbWUqDQgBEC4YrwEYxwEYgAQyBggAEEUYOTINCAEQLhivARjHARiABDIICAIQABgWGB4yCggDEAAYChgWGB4yBwgEEAAY7wUyCggFEAAYgAQYogQyBggGEEUYPDIGCAcQRRg80gEIODA1NmowajeoAgCwAgA&sourceid=chrome&ie=UTF-8#lrd=0xbd196c5e218b73:0xab5eb98d093a03f,1,,,,', '_blank');
  });
});


const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.menu-oculto');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('ativo');
});