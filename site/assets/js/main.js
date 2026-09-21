/* Lynzi Trading: site behaviour (no dependencies) */
(function () {
  "use strict";
  window.lynziReady = true;

  var doc = document.documentElement;
  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* ---------- Header: solid background once the page scrolls ---------- */
  var header = document.querySelector("[data-header]");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Desktop dropdowns (hover via CSS, click/keyboard via JS) ---------- */
  var dropdowns = Array.prototype.slice.call(
    document.querySelectorAll(".has-dd"),
  );
  function setDropdown(item, open) {
    item.classList.toggle("is-open", open);
    item
      .querySelector(".dd-toggle")
      .setAttribute("aria-expanded", String(open));
  }
  dropdowns.forEach(function (item) {
    var btn = item.querySelector(".dd-toggle");
    btn.addEventListener("click", function () {
      var open = !item.classList.contains("is-open");
      dropdowns.forEach(function (other) {
        if (other !== item) setDropdown(other, false);
      });
      setDropdown(item, open);
    });
    item.addEventListener("focusout", function (e) {
      if (!item.contains(e.relatedTarget)) setDropdown(item, false);
    });
    item.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && item.classList.contains("is-open")) {
        setDropdown(item, false);
        btn.focus();
      }
    });
  });
  document.addEventListener("click", function (e) {
    dropdowns.forEach(function (item) {
      if (!item.contains(e.target)) setDropdown(item, false);
    });
  });

  /* ---------- Mobile full-screen menu ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var menu = document.getElementById("mobile-menu");
  var main = document.getElementById("main");
  var footer = document.querySelector(".site-footer");

  function setMenu(open) {
    doc.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.setAttribute("aria-hidden", String(!open));
    menu.inert = !open;
    if (main) main.inert = open;
    if (footer) footer.inert = open;
  }

  if (toggle && menu) {
    menu.inert = true;
    toggle.addEventListener("click", function () {
      setMenu(!doc.classList.contains("menu-open"));
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && doc.classList.contains("menu-open")) {
        setMenu(false);
        toggle.focus();
      }
    });
    var desktop = window.matchMedia("(min-width: 900px)");
    var onChange = function (e) {
      if (e.matches) setMenu(false);
    };
    if (desktop.addEventListener) desktop.addEventListener("change", onChange);
    else if (desktop.addListener) desktop.addListener(onChange);
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );
    revealEls.forEach(function (el) {
      revealer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- Count-up numbers (final values are already in the HTML) ---------- */
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && !reduceMotion && counters.length) {
    var counterObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          counterObs.unobserve(entry.target);
          var el = entry.target;
          var target = parseInt(el.getAttribute("data-count"), 10);
          var start = null;
          var duration = 1400;
          function frame(ts) {
            if (start === null) start = ts;
            var p = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = String(Math.round(target * eased));
            if (p < 1) window.requestAnimationFrame(frame);
          }
          el.textContent = "0";
          window.requestAnimationFrame(frame);
        });
      },
      { threshold: 0.6 },
    );
    counters.forEach(function (el) {
      counterObs.observe(el);
    });
  }

  /* ---------- Section sub-navigation: highlight the section in view ---------- */
  var subnav = document.querySelector(".subnav");
  if (subnav && "IntersectionObserver" in window) {
    var list = subnav.querySelector("ul");
    var links = Array.prototype.slice.call(
      subnav.querySelectorAll('a[href^="#"]'),
    );
    var byId = {};
    links.forEach(function (a) {
      byId[a.getAttribute("href").slice(1)] = a;
    });
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var active = byId[entry.target.id];
          if (!active) return;
          links.forEach(function (a) {
            a.classList.toggle("is-active", a === active);
            if (a === active) a.setAttribute("aria-current", "true");
            else a.removeAttribute("aria-current");
          });
          var left =
            active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2;
          list.scrollTo({
            left: left,
            behavior: reduceMotion ? "auto" : "smooth",
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    Object.keys(byId).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) spy.observe(section);
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Contact form ----------
     Submits to Formspree when a form ID is set in data-formspree on the <form>.
     Until then it falls back to opening the visitor's email app, addressed to
     hello@lynzi.co.ke, so no message is ever lost. */
  var form = document.getElementById("contact-form");
  if (form) {
    var status = form.querySelector(".form-status");
    var submitBtn = form.querySelector('button[type="submit"]');
    var fields = ["name", "email", "venture", "message"];
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Allow links such as contact.html?venture=general to preselect the topic.
    var params = new URLSearchParams(window.location.search);
    var preset = params.get("venture");
    if (preset) {
      var select = form.elements.venture;
      Array.prototype.forEach.call(select.options, function (opt) {
        if (
          opt.value &&
          opt.value.toLowerCase().indexOf(preset.toLowerCase()) === 0
        )
          select.value = opt.value;
      });
    }

    function fieldValid(name) {
      var input = form.elements[name];
      var value = (input.value || "").trim();
      var ok = value.length > 0 && (name !== "email" || emailRe.test(value));
      var wrap = input.closest(".field");
      wrap.classList.toggle("has-error", !ok);
      input.setAttribute("aria-invalid", String(!ok));
      return ok;
    }

    fields.forEach(function (name) {
      var input = form.elements[name];
      input.addEventListener("blur", function () {
        if (input.value) fieldValid(name);
      });
      input.addEventListener("input", function () {
        if (input.closest(".field").classList.contains("has-error"))
          fieldValid(name);
      });
    });

    function setStatus(msg, type) {
      status.textContent = msg;
      status.className = "form-status" + (type ? " is-" + type : "");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstBad = null;
      fields.forEach(function (name) {
        if (!fieldValid(name) && !firstBad) firstBad = form.elements[name];
      });
      if (firstBad) {
        firstBad.focus();
        setStatus("Please complete the highlighted fields.", "error");
        return;
      }
      if (form.elements._gotcha && form.elements._gotcha.value) return; // spam trap

      var data = {
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        venture: form.elements.venture.value,
        message: form.elements.message.value.trim(),
      };
      var formId = (form.getAttribute("data-formspree") || "").trim();

      if (!formId) {
        var subject = "Website enquiry: " + data.venture;
        var body =
          data.message + "\n\nFrom: " + data.name + " (" + data.email + ")";
        window.location.href =
          "mailto:hello@lynzi.co.ke?subject=" +
          encodeURIComponent(subject) +
          "&body=" +
          encodeURIComponent(body);
        setStatus(
          "Your email app should open with your message ready to send to hello@lynzi.co.ke.",
          "success",
        );
        return;
      }

      submitBtn.disabled = true;
      setStatus("Sending…");
      fetch("https://formspree.io/f/" + encodeURIComponent(formId), {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Request failed");
          form.reset();
          fields.forEach(function (name) {
            form.elements[name].removeAttribute("aria-invalid");
          });
          setStatus(
            "Thank you. Your message has been sent and we'll be in touch shortly.",
            "success",
          );
        })
        .catch(function () {
          setStatus(
            "Sorry, something went wrong. Please email us directly at hello@lynzi.co.ke.",
            "error",
          );
        })
        .then(function () {
          submitBtn.disabled = false;
        });
    });
  }
})();
