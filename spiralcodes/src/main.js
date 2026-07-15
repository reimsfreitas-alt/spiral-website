/* SpiralCodes — runtime.
   One job: reveal sections as they enter the viewport, and stop.
   No analytics, no trackers, no third-party scripts. ~700 bytes. */

(function () {
  "use strict";

  var nodes = document.querySelectorAll("[data-reveal]");
  if (!nodes.length) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced || !("IntersectionObserver" in window)) {
    nodes.forEach(function (n) { n.classList.add("is-visible"); });
    return;
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // Stagger siblings so a row of cards arrives as a sequence, not a flash.
        var delay = Math.min(i * 70, 280);
        setTimeout(function () { el.classList.add("is-visible"); }, delay);
        io.unobserve(el);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
  );

  nodes.forEach(function (n) { io.observe(n); });
})();
