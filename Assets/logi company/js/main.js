document.addEventListener("DOMContentLoaded", function () {
  const bar = document.querySelector(".bar");
  const menu = document.querySelector(".menu2");
  const overlay = document.querySelector(".overlay");

  bar.addEventListener("click", function () {
    menu.classList.toggle("show");
    bar.classList.toggle("active");
    overlay.classList.toggle("show");
  });


  overlay.addEventListener("click", function () {
    menu.classList.remove("show");
    bar.classList.remove("active");
    overlay.classList.remove("show");
  });
});



const faqItems = document.querySelectorAll(".qtqcont");

faqItems.forEach((item) => {
  const btn = item.querySelector(".accordion");

  btn.addEventListener("click", () => {

    faqItems.forEach((other) => {
      if (other !== item) {
        other.classList.remove("active");
      }
    });

    item.classList.toggle("active");
  });
});



const counters = document.querySelectorAll('.num, .numm');
const speed = 200; 

const countUp = (counter) => {
  const target = +counter.innerText.trim();
  let count = 0;
  const increment = target / speed;

  const updateCount = () => {
    if (count < target) {
      count += increment;
      counter.innerText = Math.ceil(count);
      requestAnimationFrame(updateCount);
    } else {
      counter.innerText = target;
    }
  };

  updateCount();
};


const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      countUp(entry.target);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(counter => observer.observe(counter));












