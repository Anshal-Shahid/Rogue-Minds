(function () {
    // Guard: only run once GSAP + ScrollTrigger are ready
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('Section 6: GSAP or ScrollTrigger not loaded.');
      return;
    }
 
    gsap.registerPlugin(ScrollTrigger);
 
    // Scope all selectors to .section-6 so nothing bleeds out
    const section    = document.querySelector('.section-6');
    const shape      = section.querySelector('.s6-animated-shape');
    const textBox    = section.querySelector('.s6-text-container');
    const wordsUp    = section.querySelectorAll('.s6-up');
    const wordsDown  = section.querySelectorAll('.s6-down');
 
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,       // pin relative to THIS section, not <body>
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      }
    });
 
    tl
      // 1. SVG scales up & rotates to fill viewport
      .to(shape, {
        scale: 40,
        rotation: 90,
        ease: 'power2.inOut',
        duration: 2
      }, 0)
 
      // 2. Text flies in from the right
      .to(textBox, {
        right: '50vw',
        x: '50%',
        ease: 'power3.out',
        duration: 1
      }, 1)
 
      // 3. Pause a beat
      .to({}, { duration: 1 })
 
      // 4. Words explode away — up words fly up, down words fly down
      .to(wordsUp,   { y: -150, opacity: 0, duration: 1, stagger: 0.05 }, '+=0')
      .to(wordsDown, { y:  150, opacity: 0, duration: 1, stagger: 0.05 }, '<');
 
  })();