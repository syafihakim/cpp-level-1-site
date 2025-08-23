// SHOWCASE STARTS
// VIDEO MODAL SCRIPT
const openBtn = document.getElementById('openModal');
const closeBtn = document.getElementById('closeModal');
const modal = document.getElementById('videoModal');
const popup = document.getElementById("videoPopup");
const video = document.getElementById("popupVideo");

  openBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    video.pause();         // pause video
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });


// SHOWCASE SLIDER
const container = document.getElementById("demoContainer");
const slides = container.children;
const slideWidth = slides[0].offsetWidth + 16; // adjust if you use margin
let currentIndex = 0;

// Function to scroll to a slide
function goToSlide(index) {
  currentIndex = Math.max(0, Math.min(index, slides.length - 1));
  container.scrollTo({
    left: currentIndex * slideWidth,
    behavior: "smooth",
  });
}

// Handle wheel scroll (desktop)
container.addEventListener("wheel", (e) => {
  e.preventDefault();
  if (e.deltaY > 0 || e.deltaX > 0) {
    goToSlide(currentIndex + 1);
  } else {
    goToSlide(currentIndex - 1);
  }
}, { passive: false });

// Handle swipe gesture (mobile)
let startX = 0;
container.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

container.addEventListener("touchend", (e) => {
  const endX = e.changedTouches[0].clientX;
  const diffX = startX - endX;

  if (Math.abs(diffX) > 50) { // swipe threshold
    if (diffX > 0) {
      goToSlide(currentIndex + 1); // swipe left → next
    } else {
      goToSlide(currentIndex - 1); // swipe right → prev
    }
  } else {
    goToSlide(currentIndex); // snap back if swipe too small
  }
});
// SHOWCASE ENDS



const targetDiv = document.getElementById('banner');
const section2 = document.getElementById('gold'); 

window.addEventListener('scroll', () => {
  const section2Bottom = section2.getBoundingClientRect().bottom;

  // If the bottom of section2 is above the viewport top (i.e. scrolled past)
  if (section2Bottom < 0) {
    targetDiv.style.display = 'none';  // hide
  } else {
    targetDiv.style.display = 'block'; // show
  }
});

const tabs = document.querySelectorAll('.payment-tab');
const contents = document.querySelectorAll('.payment-content');
const copyBtn = document.getElementById('copyAccBtn');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Remove active styles from all tabs
    tabs.forEach(t => {
      t.classList.remove('border-orange-500', 'text-orange-600', 'font-semibold');
      t.classList.add('text-gray-600');
    });

    // Hide all content
    contents.forEach(c => c.classList.add('hidden'));

    // Activate clicked tab
    tab.classList.add('border-orange-500', 'text-orange-600', 'font-semibold');
    tab.classList.remove('text-gray-600');

    // Show corresponding content
    const mode = tab.getAttribute('data-mode');
    document.getElementById(mode).classList.remove('hidden');
  });
});

if(copyBtn) {
  copyBtn.addEventListener('click', () => {
    const accNumber = "1062 0305 8090";
    navigator.clipboard.writeText(accNumber).then(() => {
      copyBtn.textContent = "Copied!";
      setTimeout(() => {
        copyBtn.textContent = "Copy";
      }, 2000);
    }).catch(() => {
      alert("Gagal copy nombor akaun. Sila copy secara manual.");
    });
  });
}

// Run on load and when window resizes
window.addEventListener("load", updateBannerHeight);
window.addEventListener("resize", updateBannerHeight);



// 
const sheetId = "1o_PVByfyy3NNcHfUMK2obi1jquivOHr6PZjvouksqRk";
const apiKey = "AIzaSyBU8TMPP0ZUxS_979y6cYdNOU6SfdfBXYc";
const range = "Promos!A2:G10";
const promoCodeFromUrl = new URLSearchParams(window.location.search).get("promo");

fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`)
  .then(response => response.json())
  .then(data => {
    if (!data.values || !data.values[0]) throw new Error("No data found");

    let promoIdx = -1;

    const now = new Date();
    let validUntilFromDB = undefined;

    for(let i=0; i<10; i++) {

      if (!data.values[i]) break;

      const promoCodeFromDB = data.values[i][0];
      validUntilFromDB = new Date(data.values[i][1]);
      const diff = validUntilFromDB - now;

      if (promoCodeFromDB == promoCodeFromUrl && diff > 0) {
        promoIdx = i;
        break;
      }
    }

    if (promoIdx != -1) {
      const promoPrice = parseInt(data.values[promoIdx][2], 10);
      const promoName = data.values[promoIdx][3];

      const price1 = parseInt(data.values[promoIdx][4], 10);
      const price2 = parseInt(data.values[promoIdx][5], 10);
      const price3 = parseInt(data.values[promoIdx][6], 10);

      document.getElementById("price1").innerHTML = `RM${price1}`;
      document.getElementById("price2").innerHTML = `RM${price2}`;
      document.getElementById("price3").innerHTML = `RM${price3}`;
      document.querySelectorAll(".total-price").forEach(el => el.innerHTML = `RM${promoPrice}`);
      document.getElementById("top-banner").innerHTML = `
        <span class="text-md font-semilight">
        ${promoName}</br>
        <span class="text-4xl font-bold">RM${promoPrice}</span>
        <span class="line-through text-gray-600 text-md">RM40</span>
        </span>`;

      document.getElementById("countdown-container").classList.remove("hidden");

      updateCountdown(validUntilFromDB);
      timer = setInterval(() => updateCountdown(validUntilFromDB), 1000);

    } else {
      resetPrice();
    }

  })
  .catch(error => {
    console.error("Error:", error);
    document.getElementById("top-banner").textContent =
      "⚠️ Uh oh. Tak boleh load data";
  });

  function resetPrice() {
    document.getElementById("price1").innerHTML = `RM15`;
    document.getElementById("price2").innerHTML = `RM15`;
    document.getElementById("price3").innerHTML = `RM10`;
    document.querySelectorAll(".total-price").forEach(el => el.innerHTML = `RM40`);

    document.getElementById("top-banner").innerHTML = `
      <span class="text-sm font-semilight">
      🚀 100+ pelajar dah mula bercoding!</br>
      <span class="text-4xl font-bold">RM40</span>
      </span>`;
    document.getElementById("countdown-container").classList.add("hidden");
  }

// ---------------------
// All Functions
// ---------------------

function updateCountdown(targetDate) {

  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    document.getElementById("countdown").textContent = "00:00:00";
    resetPrice();
    clearInterval(timer);
    return;
  }

  const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
  const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
  const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, "0");

  document.getElementById("countdown").textContent = `Tamat dalam ${hours}:${minutes}:${seconds}`;
}

function updateBannerHeight() {
  const banner = document.getElementById("banner");
  if (banner) {
    document.documentElement.style.setProperty(
      "--banner-height",
      banner.offsetHeight + "px"
    );
  }
}