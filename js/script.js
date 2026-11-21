/* Ecoclean redesign concept: all behaviour is front-end only. Nothing is sent anywhere. */
(function () {
  "use strict";

  /* Mobile navigation ----------------------------------------------------- */
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("primary-nav");

  function setNav(open) {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  }

  toggle.addEventListener("click", function () {
    setNav(toggle.getAttribute("aria-expanded") !== "true");
  });

  nav.addEventListener("click", function (event) {
    if (event.target.closest("a")) setNav(false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setNav(false);
      toggle.focus();
    }
  });

  /* Header shadow once the page has scrolled ----------------------------- */
  var header = document.getElementById("site-header");
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Highlight the nav link for the section in view ------------------------ */
  var links = Array.prototype.slice.call(document.querySelectorAll(".primary-nav li a"));
  var targets = links
    .map(function (link) {
      var id = link.getAttribute("href").slice(1);
      return id === "top" ? document.querySelector(".hero") : document.getElementById(id);
    });

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var index = targets.indexOf(entry.target);
        links.forEach(function (link, i) {
          if (i === index) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
          link.classList.toggle("is-active", i === index);
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });

    targets.forEach(function (target) {
      if (target) observer.observe(target);
    });
  }

  /* NFPA 96 inspection schedule picker ------------------------------------ */
  var result = document.getElementById("picker-result");
  var descriptions = {
    "monthly": "Systems serving solid fuel cooking operations.",
    "quarterly": "Systems serving high-volume cooking such as 24-hour cooking, charbroiling or wok cooking.",
    "semi-annually": "Systems serving moderate-volume cooking operations.",
    "annually": "Systems serving low-volume cooking such as churches, day camps, seasonal businesses or senior centers."
  };

  document.querySelectorAll('#picker input[name="cooking"]').forEach(function (input) {
    input.addEventListener("change", function () {
      var value = input.value;
      result.innerHTML = "";

      var label = document.createElement("span");
      label.textContent = "Inspect your exhaust system";
      var freq = document.createElement("span");
      freq.className = "freq";
      freq.textContent = value;
      var detail = document.createElement("span");
      detail.textContent = descriptions[value];

      result.appendChild(label);
      result.appendChild(freq);
      result.appendChild(detail);
    });
  });

  /* Before / after comparison slider -------------------------------------- */
  var range = document.getElementById("compare-range");
  var after = document.getElementById("compare-after");
  var handle = document.getElementById("compare-handle");

  function updateCompare() {
    var value = Number(range.value);
    after.style.clipPath = "inset(0 0 0 " + value + "%)";
    handle.style.left = value + "%";
  }
  range.addEventListener("input", updateCompare);
  updateCompare();

  /* Demo form: validates the email, never sends anything ------------------- */
  var form = document.getElementById("demo-form");
  var email = document.getElementById("f-email");
  var emailError = document.getElementById("f-email-error");
  var status = document.getElementById("form-status");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    status.textContent = "";

    var valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    email.setAttribute("aria-invalid", String(!valid));
    emailError.hidden = valid;

    if (!valid) {
      email.focus();
      return;
    }

    status.textContent = "Demo only. Nothing was sent. To reach Ecoclean, call 281.599.7444.";
    form.reset();
  });
})();
