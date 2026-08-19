// Helper script to support GSAP ScrollTrigger driver track height
document.addEventListener('DOMContentLoaded', () => {
  const driver = document.getElementById('tourScrollDriver');
  if (driver) {
    // Make driver 300vh tall to provide ample scroll room for all 5 room transitions
    driver.style.position = 'relative';
    driver.style.height = '300vh';
    driver.style.marginTop = '-100vh';
    driver.style.pointerEvents = 'none';
    driver.style.zIndex = '-1';
  }
});
