let controller;
let slideScene;
let pageScene;

function animateSlideAndNav() {
  //init the controller
  controller = new ScrollMagic.Controller();

  const nav = document.querySelector(".nav-header");
  const slides = document.querySelectorAll(".slide");

  gsap.fromTo(nav, 1, { y: "-100%" }, { y: "0", ease: "Power2.easeInOut" });
  slides.forEach((slide, index, slides) => {
    const revealImage = slide.querySelector(".reveal-image");
    const slideImage = slide.querySelector("img");
    const revealText = slide.querySelector(".reveal-text");

    //lets do animation with gsap
    const slideTl = gsap.timeline({
      defaults: { duration: 1, ease: "Power2.easeInOut" },
    });
    slideTl.to(revealImage, 1, { x: "100%" });
    slideTl.fromTo(slideImage, 1, { scale: 2 }, { scale: 1 }, "-=1");
    slideTl.to(revealText, 1, { x: "100%" }, "-=0.75");

    //Create a scene
    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.25,
      reverse: false,
    })
      .setTween(slideTl)
      .addTo(controller);

    //New Animation
    const pageTl = gsap.timeline();
    const nextSlide = slides.length - 1 === index ? "ene" : slides[index + 1];
    pageTl.fromTo(nextSlide, { y: "0%" }, { y: "50%" });
    pageTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
    pageTl.fromTo(nextSlide, { y: "50%" }, { y: "0%" }, "-=0.5");
    //Create New Scene
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0,
      duration: "100%",
    })
      .setPin(slide, { pushFollowers: false })
      .setTween(pageTl)
      .addTo(controller);
  });
}

//lets build out the cursor stuffs

const mouse = document.querySelector(".cursor");
let mouseText = mouse.querySelector("span");
const burger = document.querySelector(".burger");

function cursor(e) {
  mouse.style.top = e.pageY + "px";
  mouse.style.left = e.pageX + "px";
}

function activeCursor(e) {
  const item = e.target;
  if (item.id === "logo-link" || item.classList.contains("burger")) {
    mouse.classList.add("nav-active");
  } else {
    mouse.classList.remove("nav-active");
  }

  if (item.classList.contains("explore")) {
    mouse.classList.add("explore-active");
    gsap.to(".title-swipe", 1, { y: "0%" });
    mouseText.innerText = "Tap";
  } else {
    mouse.classList.remove("explore-active");
    gsap.to(".title-swipe", 1, { y: "100%" });
    mouseText.innerText = "";
  }
}

function navToggle(e) {
  if (!e.target.classList.contains("active")) {
    e.target.classList.add("active");
    gsap.to(".line1", 0.5, { rotateZ: "45", y: 5, background: "black" });
    gsap.to(".line2", 0.5, { rotateZ: "-45", y: -5, background: "black" });
    gsap.to("#logo-link", 1, { color: "black" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(2500px at 100% -10%)" });
    document.body.classList.add("hide");
  } else {
    e.target.classList.remove("active");
    gsap.to(".line1", 0.5, { rotateZ: "0", y: 0, background: "white" });
    gsap.to(".line2", 0.5, { rotateZ: "0", y: 0, background: "white" });
    gsap.to("#logo-link", 1, { color: "white" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(50px at 100% -10%)" });
    document.body.classList.remove("hide");
  }
}

//Barba Page Transition
const logoLink = document.querySelector("#logo-link");
barba.init({
  views: [
    {
      namespace: "home",
      beforeEnter() {
        animateSlideAndNav();
        logoLink.href = "./index.html";
      },
      beforeLeave() {
        slideScene.destroy();
        pageScene.destroy();
        controller.destroy();
      },
    },
    {
      namespace: "fashion",
      beforeEnter() {
        logoLink.href = "../index.html";
        detailSlideAnimation();
      },
      beforeLeave() {
        slideScene.destroy();
        controller.destroy();
      },
    },
  ],
  transitions: [
    {
      leave({ current, next }) {
        let done = this.async();
        //Animation
        const tl = gsap.timeline({ defaults: { ease: "Power2.inOut" } });
        tl.fromTo(
          current.container,
          1,
          { opacity: 1 },
          { opacity: 0, onComplete: done }
        );
        tl.fromTo(".swipe", 0.75, { x: "-100%" }, { x: "0%" }, "-=0.5");
      },
      enter({ current, next }) {
        let done = this.async();
        //Scroll to the top
        window.scrollTo(0, 0);
        //Animtion
        const tl = gsap.timeline({ defaults: { ease: "Power2.inOut" } });
        tl.fromTo(
          ".swipe",
          1,
          { x: "0%" },
          { x: "100%", stagger: 0.2, onComplete: done }
        );
        tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 });
        tl.fromTo(".nav-header", 1, { y: "-100%" }, { y: "0%" }, "-=1");
      },
    },
  ],
});

//functions

function detailSlideAnimation() {
  //Init the controller for triggering functionalities
  controller = new ScrollMagic.Controller();

  //lets grab all the detail slide for further animation
  const detailSlides = document.querySelectorAll(".detail-slide");

  //loop over all the slides and do some stuffs
  detailSlides.forEach((detailSlide, index, detailSlides) => {
    //lets grap the next slide and img of the slide
    const nextDetailSlide =
      detailSlides.length - 1 === index ? "end" : detailSlides[index + 1];
    const img = nextDetailSlide.querySelector("img");

    //create timeline for detailslide animation
    const detailSlideTimeline = gsap.timeline({
      defaults: { ease: "Power2.inOut" },
    });
    detailSlideTimeline.fromTo(detailSlide, 1, { opacity: 1 }, { opacity: 0 });
    detailSlideTimeline.fromTo(
      nextDetailSlide,
      1,
      { opacity: 0 },
      { opacity: 1 },
      "-=1"
    );
    detailSlideTimeline.fromTo(img, 1, { x: "50%" }, { x: "0%" });

    //create scene for triggering
    const slideScene = new ScrollMagic.Scene({
      triggerElement: detailSlide,
      triggerHook: 0,
      duration: "100%",
    })
      .setPin(detailSlide, { pushFollowers: false })
      .setTween(detailSlideTimeline)
      .addTo(controller);
  });
}

//Event Listeners
window.addEventListener("mousemove", cursor);
window.addEventListener("mouseover", activeCursor);
burger.addEventListener("click", navToggle);

// practice stuff
