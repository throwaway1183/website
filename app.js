let slides = [];
let currentSlide = 0;
let data = null;
let selectedProfiles = new Set();

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
      Alice: { total_messages: 120, total_words: 1000, avg_response_time: 5, most_used_emoji: ["😂","🔥","😭"], activity: { '00:00': 5, '06:00': 10, '12:00': 20, '18:00': 15, '23:00': 8 } },
      Bob: { total_messages: 90, total_words: 850, avg_response_time: 8, most_used_emoji: ["🤣","😎","👍"], activity: { '01:00': 3, '07:00': 8, '13:00': 15, '19:00': 12, '22:00': 6 } },
      Charlie: { total_messages: 200, total_words: 1500, avg_response_time: 2, most_used_emoji: ["🔥","💀","😂"], activity: { '02:00': 10, '08:00': 25, '14:00': 30, '20:00': 20, '23:59': 15 } }
    }
  };

  init();
}

/* ---------------- INIT ---------------- */
function init() {
  buildSlides();
  buildProfiles();
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

  slides.push(createSlide(`<h1>Profiles</h1><div id="profiles-content"></div>`, false, "profile-slide"));

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

  // Populate profiles content if needed
  const profilesContent = slides[i].querySelector('#profiles-content');
  if (profilesContent && !profilesContent.innerHTML) {
    profilesContent.innerHTML = renderProfiles();
  }

  // Show/hide profile selector
  const selector = document.getElementById('profile-selector');
  if (slides[i].classList.contains('profile-slide')) {
    selector.style.display = 'block';
  } else {
    selector.style.display = 'none';
  }

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
    document.querySelectorAll(".activity-fill").forEach(b => {
      b.style.height = b.dataset.height;
    });
  }, 100);
}

function renderActivity(activity, delay) {
  let html = `<div class="activity-chart" style="animation-delay: ${delay}s;">`;

  const entries = Object.entries(activity).sort(([a], [b]) => a.localeCompare(b));

  const max = Math.max(...entries.map(([,v]) => v));

  entries.forEach(([hour, v]) => {
    const height = max > 0 ? (v / max) * 100 : 0;

    html += `
      <div class="activity-bar-container">
        <div class="activity-value">${v}</div>
        <div class="activity-bar">
          <div class="activity-fill" data-height="${height}%"></div>
        </div>
        <div class="activity-label">${hour}</div>
      </div>
    `;
  });

  html += `</div>`;
  return html;
}

function renderProfiles() {
  let html = '';

  selectedProfiles.forEach((name, index) => {
    const p = data.people[name];
    const delay = 0.5 + index * 0.2;

    html += `
      <div class="stat" style="animation-delay: ${delay}s;">
        <h2>${name}</h2>
        ${p.total_messages} msgs<br>
        ${p.total_words} words<br>
        ⏱ ${p.avg_response_time} min<br>
        ${p.most_used_emoji.join(" ")}
      </div>
      ${renderActivity(p.activity, delay + 0.5)}
    `;
  });

  return html;
}

/* ---------------- PROFILES ---------------- */
function buildProfiles() {
  const list = document.getElementById("profile-list");

  Object.keys(data.people).forEach(name => {
    const label = document.createElement("label");
    const cb = document.createElement("input");

    cb.type = "checkbox";
    cb.checked = true; // default selected
    selectedProfiles.add(name);

    cb.onchange = () => {
      cb.checked ? selectedProfiles.add(name) : selectedProfiles.delete(name);
      // Update the profiles slide content
      const contentDiv = document.getElementById('profiles-content');
      if (contentDiv) {
        contentDiv.innerHTML = renderProfiles();
        animateBars();
      }
    };

    label.appendChild(cb);
    label.append(name);
    list.appendChild(label);
  });
}
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

document.addEventListener('click', (e) => {
  if (!e.target.closest('#profile-selector')) {
    const isRightSide = e.clientX > window.innerWidth / 2;
    if (isRightSide) {
      showSlide((currentSlide + 1) % slides.length);
    } else {
      showSlide((currentSlide - 1 + slides.length) % slides.length);
    }
  }
});
