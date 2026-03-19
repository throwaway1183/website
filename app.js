let slides = [];
let currentSlide = 0;
let data = null;

/* ---------------- MOCK DATA ---------------- */
function loadData() {
  data = {
    group: {
      total_messages: { Alice: 120, Bob: 90, Charlie: 200 },
      total_words: { Alice: 1000, Bob: 850, Charlie: 1500 },
      night_owl: "Charlie",
      night_owl_avg_time: "2:30 AM - 4:00 AM",
      ghost: "Bob",
      ghost_max_consecutive: 15,
      conversation_starter: "Alice",
      busiest_day: "12/03/26",
      longest_silence: "2 days",
      hype_person: "Charlie"
    },
    people: {
      Alice: { total_messages: 120, total_words: 1000, avg_response_time: 5, most_used_emoji: ["😂","🔥","😭"] },
      Bob: { total_messages: 90, total_words: 850, avg_response_time: 8, most_used_emoji: ["🤣","😎","👍"] },
      Charlie: { total_messages: 200, total_words: 1500, avg_response_time: 2, most_used_emoji: ["🔥","💀","😂"] }
    }
  };

  init();
}

/* ---------------- INIT ---------------- */
function init() {
  buildSlides();
  showSlide(0);
  initBlobs();
  initParticles();
  initMouseTracking();
}

/* ---------------- SLIDES ---------------- */
function buildSlides() {
  const container = document.getElementById("slide-container");
  slides = [];

  slides.push(createSlide(`<h1>📱 WhatsApp Wrapped</h1>`, true));
  slides.push(createSlide(renderChart("Messages", data.group.total_messages)));
  slides.push(createSlide(renderChart("Words", data.group.total_words)));

  slides.push(createSlide(`<h1>🌙 Night Owl</h1><div class="stat primary">${data.group.night_owl}</div><div class="stat secondary">Avg active: ${data.group.night_owl_avg_time}</div>`));
  slides.push(createSlide(`<h1>👻 Ghost</h1><div class="stat primary">${data.group.ghost}</div><div class="stat secondary">Max consecutive: ${data.group.ghost_max_consecutive} msgs</div>`));

  const profileSlide = createSlide(renderProfiles(), false, "profile-slide");
  slides.push(profileSlide);

  container.innerHTML = "";
  slides.forEach(s => container.appendChild(s));
}

function createSlide(content, isIntro = false, extraClass = "") {
  const div = document.createElement("div");
  div.className = "slide";
  if (isIntro) div.classList.add("intro-slide");
  if (extraClass) div.classList.add(extraClass);
  div.innerHTML = content;
  return div;
}

function showSlide(i) {
  const prevSlide = slides[currentSlide];
  if (prevSlide) {
    // Make fade-out instant by temporarily disabling transition before hiding
    prevSlide.style.transition = "none";
    prevSlide.classList.remove("active");
    // Force reflow so the style change takes effect immediately
    void prevSlide.offsetWidth;
    prevSlide.style.transition = "";
  }

  slides[i].classList.add("active");

  animateBars();

  currentSlide = i;
}

/* ---------------- CHART ---------------- */
function renderChart(title, obj) {
  let html = `<h1>${title}</h1><div class="chart">`;

  const max = Math.max(...Object.values(obj));

  Object.entries(obj).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => {
    const width = (v / max) * 100;

    html += `
      <div class="bar-row">
        <div class="bar-label">
          <span>${k}</span>
          <span>${v}</span>
        </div>
        <div class="bar-bg">
          <div class="bar-fill" data-width="${width}%"></div>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  return html;
}

function animateBars() {
  setTimeout(() => {
    document.querySelectorAll(".bar-fill").forEach(b => {
      b.style.width = b.dataset.width;
    });
  }, 100);
}

function renderProfiles() {
  let html = `<h1>Profiles</h1>`;

  Object.entries(data.people).forEach(([name, p], index) => {
    const delay = 0.5 + index * 0.2;

    html += `
      <div class="stat" style="animation-delay: ${delay}s;">
        <h2>${name}</h2>
        ${p.total_messages} msgs<br>
        ${p.total_words} words<br>
        ⏱ ${p.avg_response_time} min<br>
        ${p.most_used_emoji.join(" ")}
      </div>
    `;
  });

  return html;
}

/* ---------------- BLOBS ---------------- */
function initBlobs() {
  const container = document.getElementById("blob-container");

  for (let i = 0; i < 5; i++) {
    const blob = document.createElement("div");
    blob.className = "blob";

    blob.style.width = blob.style.height = (200 + Math.random() * 200) + "px";
    blob.style.left = Math.random() * 100 + "%";
    blob.style.top = Math.random() * 100 + "%";
    blob.style.background = `hsl(${Math.random()*360},70%,60%)`;
    blob.style.animationDuration = (10 + Math.random() * 20) + "s";

    container.appendChild(blob);
  }
}

/* ---------------- PARTICLES ---------------- */
function initParticles() {
  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = Array.from({length: 60}, () => ({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height,
    dx: (Math.random()-0.5),
    dy: (Math.random()-0.5),
    r: Math.random()*2
  }));

  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;

      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw();
}

/* ---------------- MOUSE TRACKING ---------------- */
function initMouseTracking() {
  const blobs = document.querySelectorAll(".blob");
  document.addEventListener("mousemove", (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    blobs.forEach((blob, i) => {
      const offsetX = (x - 0.5) * 50 * (i + 1);
      const offsetY = (y - 0.5) * 50 * (i + 1);
      blob.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });
  });
}

/* ---------------- START ---------------- */
loadData();

document.addEventListener('click', () => {
  showSlide((currentSlide + 1) % slides.length);
});
