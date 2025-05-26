import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles
import '../style.css'; // se o style.css estiver na raiz

// ..
AOS.init();
var btn = document.getElementById('btn');
var nav = document.getElementById('menu');
if (btn && nav) {
  btn.addEventListener('click', function () {
    nav.classList.toggle('flex');
    nav.classList.toggle('hidden');
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const API_KEY = 'pub_497535368d0f4420949cca31dd5787ce';
  const URL = `https://newsdata.io/api/1/news?apikey=${API_KEY}&language=pt&category=technology`;
  const container = document.getElementById('noticias-tecnologia');

  if (!container) return;

  const hoje = new Date().toISOString().split('T')[0];
  const cache = JSON.parse(localStorage.getItem('noticiasTec'));

  if (cache && cache.data === hoje) {
    exibirNoticias(cache.noticias);
  } else {
    fetch(URL)
      .then((res) => res.json())
      .then((data) => {
        const noticias = data.results.slice(0, 6);
        localStorage.setItem(
          'noticiasTec',
          JSON.stringify({
            data: hoje,
            noticias: noticias,
          })
        );
        exibirNoticias(noticias);
      })
      .catch((err) => {
        console.error('Erro ao buscar notícias:', err);
        container.innerHTML = `<p class="text-gray-400 text-center">Não foi possível carregar as notícias hoje. Tente novamente mais tarde.</p>`;
      });
  }

  function exibirNoticias(lista) {
    container.innerHTML = '';
    lista.forEach((noticia) => {
      container.innerHTML += `
        <div class="bg-zinc-900 p-4 rounded-lg shadow-md flex flex-col justify-between min-w-[300px] snap-center">
          <img src="${
            noticia.image_url || 'https://via.placeholder.com/300'
          }" alt="notícia" class="w-full h-40 object-cover rounded mb-4">
          <h3 class="text-white font-bold text-lg">${noticia.title}</h3>
          <p class="text-gray-400 text-sm mt-2">${noticia.description || ''}</p>
          <a href="${
            noticia.link
          }" target="_blank" class="text-primary font-bold mt-2 hover:underline">Leia mais</a>
        </div>
      `;
    });
  }
});

// DATA ATUAL
const dataSpan = document.getElementById('data-atual');
const agora = new Date();
const opcoes = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};
dataSpan.textContent = `📅 ${agora.toLocaleDateString('pt-BR', opcoes)}`;

// CLIMA ATUAL DO USUÁRIO COM ÍCONE
fetch('https://ipapi.co/json/')
  .then((res) => res.json())
  .then((loc) => {
    const lat = loc.latitude;
    const lon = loc.longitude;
    const cidade = loc.city;
    const isBrasil = loc.country === 'BR';

    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    )
      .then((res) => res.json())
      .then((data) => {
        const tempC = data.current_weather.temperature;
        const code = data.current_weather.weathercode;

        const icone = getIconeClima(code);
        const climaSpan = document.getElementById('clima-atual');

        climaSpan.textContent = `${icone} ${tempC}°C em ${cidade}`;
      })
      .catch(() => {
        document.getElementById(
          'clima-atual'
        ).textContent = `Clima indisponível`;
      });
  })
  .catch(() => {
    document.getElementById('clima-atual').textContent = `Clima indisponível`;
  });

// Função que converte o código do clima em emoji

const climaSpan = document.getElementById('clima-atual');

fetch('https://ipapi.co/json/')
  .then((res) => res.json())
  .then((loc) => {
    const lat = loc.latitude;
    const lon = loc.longitude;
    const cidade = loc.city || 'sua cidade';

    console.log('Localização detectada:', lat, lon, cidade);

    if (!lat || !lon) {
      climaSpan.textContent = 'Clima indisponível';
      return;
    }

    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    )
      .then((res) => res.json())
      .then((data) => {
        const temp = data.current_weather?.temperature;
        const code = data.current_weather?.weathercode;

        if (temp === undefined || code === undefined) {
          console.warn('Dados climáticos não disponíveis.');
          climaSpan.textContent = `Clima indisponível`;
          return;
        }

        const icone = getIconeClima(code);
        climaSpan.textContent = `${icone} ${temp}°C em ${cidade}`;
      })
      .catch((err) => {
        console.error('Erro ao buscar clima:', err);
        climaSpan.textContent = `Clima indisponível`;
      });
  })
  .catch((err) => {
    console.error('Erro ao detectar local:', err);
    climaSpan.textContent = `Clima indisponível`;
  });

