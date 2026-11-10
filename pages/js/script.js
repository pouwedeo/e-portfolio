// ===== 1. Thème clair / sombre (utilise data-bs-theme de Bootstrap 5.3) =====
(function () {
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.setAttribute("data-bs-theme", saved || (prefersDark ? "dark" : "light"));

  document.getElementById("themeBtn").addEventListener("click", function () {
    var next = root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-bs-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });
})();

// ===== 2. Carrousel de projets : flèches + clavier =====
(function () {
  var track = document.getElementById("track");
  function step(dir) {
    var card = track.querySelector(".project");
    track.scrollBy({ left: dir * (card.offsetWidth + 24), behavior: "smooth" });
  }
  document.getElementById("prev").addEventListener("click", function () { step(-1); });
  document.getElementById("next").addEventListener("click", function () { step(1); });
  track.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });
})();

// ===== 3. Apparition des blocs au défilement =====
(function () {
  var items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("visible"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(function (el) { io.observe(el); });
})();

// ===== 4. Bouton « retour en haut » =====
(function () {
  var btn = document.getElementById("topBtn");
  window.addEventListener("scroll", function () {
    btn.classList.toggle("show", window.scrollY > 600);
  });
  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

// ===== 5. Formulaire : validation Bootstrap puis ouverture du mail =====
// ===== Formulaire : envoi réel via Web3Forms =====
(function () {
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  var btn = form.querySelector("button[type=submit]");

  function show(type, text) {
    status.innerHTML = '<div class="alert alert-' + type + ' mt-3 mb-0">' + text + "</div>";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    form.classList.add("was-validated");
    if (!form.checkValidity()) return;
    if (document.getElementById("botcheck").checked) return; // robot détecté

    btn.disabled = true;
    btn.textContent = "Envoi en cours…";

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: document.getElementById("access_key").value,
        subject: "Nouveau message depuis ton portfolio",
        from_name: document.getElementById("nom").value,
        name: document.getElementById("nom").value,
        email: document.getElementById("email").value,
        message: document.getElementById("msg").value
      })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.success) {
          show("success", "Merci, ton message a bien été envoyé.");
          form.reset();
          form.classList.remove("was-validated");
        } else {
          show("danger", "L’envoi a échoué. Écris-moi directement par e-mail.");
        }
      })
      .catch(function () {
        show("danger", "Problème de connexion. Réessaie dans un instant.");
      })
      .finally(function () {
        btn.disabled = false;
        btn.textContent = "Envoyer le message";
      });
  });
})();


// ===== 6. Barre de progression de lecture =====
(function () {
  var bar = document.getElementById("progress");
  window.addEventListener("scroll", function () {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
  });
})();

// ===== 7. Accroche qui s’écrit (désactivée si l’utilisateur limite les animations) =====
(function () {
  var el = document.getElementById("typed");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var phrases = [
    "j’ai plusieurs années d’expérience dans le développement d’applications et la conception d’APIs.",
    "Je suis actuellement en formation spécialisée en Data Engineering pour l’intelligence artificielle.",
    "Je combine une solide maîtrise du code avec des compétences avérées en pipelines de données, Cloud et MLOps."
  ];
  var i = 0, j = 0, del = false;
  function tick() {
    var full = phrases[i];
    j += del ? -1 : 1;
    el.textContent = full.slice(0, j);
    var wait = del ? 25 : 55;
    if (!del && j === full.length) { del = true; wait = 1800; }
    else if (del && j === 0) { del = false; i = (i + 1) % phrases.length; wait = 400; }
    setTimeout(tick, wait);
  }
  el.textContent = "";
  tick();
})();

// ===== 8. Filtre des projets =====
(function () {
  var buttons = document.querySelectorAll("#filters [data-filter]");
  var cards = document.querySelectorAll(".project");
  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      buttons.forEach(function (x) { x.classList.remove("active"); });
      b.classList.add("active");
      var f = b.getAttribute("data-filter");
      cards.forEach(function (c) {
        c.classList.toggle("is-hidden", f !== "all" && c.getAttribute("data-cat") !== f);
      });
      document.getElementById("track").scrollTo({ left: 0 });
    });
  });
})();

// ===== 9. Copier l’adresse e-mail + notification Bootstrap (toast) =====
(function () {
  var btn = document.getElementById("copyMail");
  var toast = new bootstrap.Toast(document.getElementById("mailToast"), { delay: 2200 });
  btn.addEventListener("click", function () {
    var mail = btn.previousElementSibling.textContent.trim();
    var done = function () { toast.show(); };
    if (navigator.clipboard) { navigator.clipboard.writeText(mail).then(done, done); } else { done(); }
  });
})();
