 gsap.registerPlugin(ScrollTrigger);

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "body",
                start: "top top",       
                end: "bottom bottom",   
                scrub: 1.5, 
            }
        });

        tl.to(".animated-shape", { 
            scale: 40,           
            rotation: 90, 
            ease: "power2.inOut",      
            duration: 2 
        }, 0)
        
        .to(".text-container", {
            right: "50vw",
            x: "50%", 
            ease: "power3.out",
            duration: 1
        }, 1)

        .to({}, { duration: 1 })

        // The "stagger" property makes them exit one by one like a ripple!
        .to(".up", { y: -150, opacity: 0, duration: 1, stagger: 0.05 }, "+=0")
        .to(".down", { y: 150, opacity: 0, duration: 1, stagger: 0.05 }, "<"); 