

/* ======================================================
   ICONS & GSAP SETUP
====================================================== */
lucide.createIcons();
gsap.registerPlugin(ScrollTrigger);

/* ======================================================
   HERO HEADER FADE-IN
====================================================== */
const heroTimeline = gsap.timeline({ delay: 0.15 });
heroTimeline
  .to(".header-content", {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: "power2.out"
  })
  .from(".main-title", {
    opacity: 0,
    y: 42,
    duration: 1.05,
    stagger: 0.14,
    ease: "power3.out"
  }, "<0.05")
  .from(".subtitle-hero", {
    opacity: 0,
    y: 26,
    duration: 0.85,
    ease: "power2.out"
  }, "-=0.48");

/* ======================================================
   TIMELINE CARDS FADE UP
====================================================== */
document.querySelectorAll('.card').forEach(card => {
  gsap.to(card, {
    opacity: 1,
    y: 0,
    duration: 1,
    scrollTrigger: {
      trigger: card,
      start: "top 80%",
      toggleActions: "play none none reverse"
    }
  });
});

/* ======================================================
   PARALLAX INGREDIENT BLOBS
====================================================== */
document.querySelectorAll('.ingredient').forEach((item, index) => {
  const speed = Number(item.getAttribute('data-speed')) || 0.25;
  gsap.to(item, {
    y: -360 * speed,
    x: (index % 2 === 0 ? -1 : 1) * 70 * speed,
    rotation: (index % 2 === 0 ? -1 : 1) * 24 * speed,
    ease: "none",
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1
    }
  });
});

gsap.to(".herb-atmosphere", {
  yPercent: -7,
  scale: 1.14,
  ease: "none",
  scrollTrigger: {
    trigger: ".timeline-container",
    start: "top bottom",
    end: "bottom top",
    scrub: 1.4
  }
});

document.querySelectorAll('.steam-wisp').forEach((wisp, index) => {
  gsap.to(wisp, {
    y: -170 - (index * 55),
    x: index === 0 ? 34 : -28,
    opacity: 0.03,
    ease: "none",
    scrollTrigger: {
      trigger: ".timeline-container",
      start: "top bottom",
      end: "bottom top",
      scrub: 1.2
    }
  });
});

/* ======================================================
   MAP JOURNEY CONFIG
====================================================== */
const locations = {
  intro: { scale: 0.94, x: 50, y: 50 },
  jp: { scale: 1.28, x: 67, y: 38 },
  cn: { scale: 1.28, x: 64, y: 37 },
  au: { scale: 1.24, x: 68, y: 59 },
  fr: { scale: 1.26, x: 54, y: 37 },
  us: { scale: 1.24, x: 39, y: 38 },
  overview: { scale: 0.94, x: 50, y: 50 }
};

function calculateTransform(loc) {
  return {
    scale: loc.scale,
    xPercent: (50 - loc.x) * loc.scale,
    yPercent: (50 - loc.y) * loc.scale
  };
}

/* ======================================================
   MAP INITIAL POSITION
====================================================== */
const initialPos = calculateTransform(locations.intro);
gsap.set(".map-inner", {
  scale: initialPos.scale,
  xPercent: initialPos.xPercent,
  yPercent: initialPos.yPercent
});

/* ======================================================
   ROUTE PATH DRAWING
====================================================== */
document.querySelectorAll('.route-path').forEach(path => {
  const len = path.getTotalLength();
  gsap.set(path, {
    strokeDasharray: len,
    strokeDashoffset: len
  });
});

/* ======================================================
   MAP SCENE CREATOR
====================================================== */
function createScene(targetId, locKey, pathId, flagId) {
  const targetPos = calculateTransform(locations[locKey]);

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: targetId,
      start: "top bottom",
      end: "center center",
      scrub: 1
    }
  });

  tl.to(".map-inner", {
    scale: targetPos.scale,
    xPercent: targetPos.xPercent,
    yPercent: targetPos.yPercent,
    ease: "power1.inOut",
    duration: 0.75
  });

  if (pathId) {
    tl.to(pathId, {
      strokeDashoffset: 0,
      ease: "power1.out",
      duration: 0.65
    }, "<0.1");
  }

  if (flagId) {
    // Draw the route first, then reveal the correct country flag. The
    // scrubbed timeline keeps each flag visible after its country appears.
    tl.to(flagId, {
      scale: 1,
      duration: 0.22,
      ease: "back.out(1.35)"
    }, ">");
  }
}

/* ======================================================
   CREATE MAP SCENES
====================================================== */
createScene("#sec-jp", "jp", "#path-jp", "#flag-jp");
createScene("#sec-cn", "cn", "#path-cn", "#flag-cn");
createScene("#sec-au", "au", "#path-au", "#flag-au");
createScene("#sec-fr", "fr", "#path-fr", "#flag-fr");
createScene("#sec-us", "us", "#path-us", "#flag-us");

/* ======================================================
   MAP OVERVIEW
====================================================== */
const overviewPos = calculateTransform(locations.overview);

gsap.to(".map-inner", {
  scale: overviewPos.scale,
  xPercent: overviewPos.xPercent,
  yPercent: overviewPos.yPercent,
  ease: "power1.inOut",
  scrollTrigger: {
    trigger: "#sec-outro",
    start: "top 85%",
    end: "center center",
    scrub: 1.5
  }
});

/* ======================================================
   CONTENT CARD FADE
====================================================== */
document.querySelectorAll('.content-card').forEach(card => {
  gsap.to(card, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
      trigger: card,
      start: "top 72%",
      end: "bottom top",
      toggleActions: "play none none reverse"
    }
  });
});

/* ======================================================
   MAP / PARALLAX VISIBILITY CONTROL
====================================================== */
const mapLayers = gsap.utils.toArray([
  ".map-fixed-container",
  ".map-texture-overlay",
  ".map-vignette-overlay"
]);

const parallax = document.querySelector(".parallax-container");

gsap.set(mapLayers, { opacity: 0, pointerEvents: "none" });

ScrollTrigger.create({
  trigger: "#sec-intro",
  start: "top center",
  end: "top top",

  onEnter: () => {
    mapLayers.forEach(el => el.style.pointerEvents = "auto");
    gsap.to(mapLayers, { opacity: 1, duration: 0.5 });
    gsap.to(parallax, { opacity: 0, duration: 0.5 });
  },

  onLeaveBack: () => {
    gsap.to(mapLayers, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        mapLayers.forEach(el => el.style.pointerEvents = "none");
      }
    });
    gsap.to(parallax, { opacity: 1, duration: 0.5 });
  }
});

/* ======================================================
   REVEAL SECTIONS
====================================================== */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

revealEls.forEach(el => revealObserver.observe(el));

/* ======================================================
   BAR CHART ANIMATION
====================================================== */
const chartInner = document.getElementById('chart-inner');
const barEls = document.querySelectorAll('.bar');

if (chartInner) {
  const chartObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        barEls.forEach((bar, index) => {
          const h = bar.dataset.height;
          if (h) {
            bar.style.transitionDelay = `${index * 110}ms`;
            bar.style.height = h + 'px';
          }
        });
        chartObserver.unobserve(chartInner);
      }
    });
  }, { threshold: 0.5 });

  chartObserver.observe(chartInner);
}

/* ======================================================
   DONUT REVEAL
====================================================== */
const exportSection = document.querySelector('.export-section');
const donuts = document.querySelectorAll('.donut');

if (exportSection && donuts.length) {
  const donutObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        donuts.forEach((d, index) => {
          gsap.fromTo(d,
            { opacity: 0, scale: 0.92 },
            { opacity: 1, scale: 1, duration: 0.55, delay: index * 0.08, ease: "power2.out" }
          );
        });
        donutObserver.unobserve(exportSection);
      }
    });
  }, { threshold: 0.4 });

  donutObserver.observe(exportSection);
}

/* ======================================================
   THAI SELECT MAP MARKERS
====================================================== */
(function initThaiSelectMarkers() {
  const markers = Array.from(document.querySelectorAll('.select-marker'));
  if (!markers.length) return;

  function closeMarkers(except = null) {
    markers.forEach(marker => {
      if (marker === except) return;
      marker.classList.remove('is-active');
      marker.setAttribute('aria-expanded', 'false');
    });
  }

  markers.forEach(marker => {
    marker.addEventListener('click', event => {
      event.stopPropagation();
      const willOpen = !marker.classList.contains('is-active');
      closeMarkers(marker);
      marker.classList.toggle('is-active', willOpen);
      marker.setAttribute('aria-expanded', String(willOpen));
    });

    marker.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      marker.classList.remove('is-active');
      marker.setAttribute('aria-expanded', 'false');
      marker.blur();
    });
  });

  document.addEventListener('click', () => closeMarkers());
})();

/* ======================================================
   TOOLTIP
====================================================== */
const tooltip = document.getElementById('tooltip');

function attachTooltip(selectors) {
  document.querySelectorAll(selectors).forEach(el => {
    const text = el.dataset.tooltip;
    if (!text) return;

    el.addEventListener('mousemove', e => {
      tooltip.textContent = text;
      tooltip.style.left = e.clientX + 12 + 'px';
      tooltip.style.top = e.clientY + 12 + 'px';
      tooltip.classList.add('visible');
    });

    el.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
    });
  });
}

attachTooltip('.bar-group');
attachTooltip('.donut-card');





// ------------------------------
// Export Growth Chart Animation (Improved Version)
// ------------------------------

// ------------------------------
// Export Growth Chart: init with zeros, then animate bars on scroll
// ------------------------------

const canvas = document.getElementById("exportChart"); // canvas element
let exportChart = null;

const exportYears = ["2015","2016","2017","2018","2019","2020","2021","2022","2023","2024"];
const exportValues = [4.1, 3.5, 5.2, 6.8, 4.9, -2.1, 7.4, 8.2, 5.7, 6.9];

// create an array of zeros same length as exportValues
const zeroValues = exportValues.map(() => 0);

function initChartWithZeros() {
    exportChart = new Chart(canvas, {
        type: "bar",
        data: {
            labels: exportYears,
            datasets: [{
                label: "อัตราการเติบโต (%)",
                data: zeroValues.slice(), // start all bars at 0
                backgroundColor: "#f4b350",
                borderColor: "#d98c00",
                borderWidth: 2,
                borderRadius: 5,
                hoverBackgroundColor: "#ffcf7a",
                hoverBorderColor: "#ffdca6",
                borderSkipped: false,
                barThickness: 26,
                maxBarThickness: 30,
                categoryPercentage: 0.72,
                barPercentage: 0.7
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    backgroundColor: "rgba(0,0,0,0.85)",
                    titleColor: "#fff",
                    bodyColor: "#ffe5b0",
                    padding: 10
                },
                legend: { display: false }
            },
            scales: {
                x: { ticks: { color: "#333" }, grid: { display: false } },
                y: { ticks: { color: "#333" }, grid: { color: "rgba(0,0,0,0.06)" }, beginAtZero: true }
            },
            animation: {
                // delay per data item (staggered). Chart.js passes context where context.type === 'data'
                delay: function(context) {
                    if (context.type === 'data' && typeof context.dataIndex !== 'undefined') {
                        return context.dataIndex * 120; // 120ms stagger between bars
                    }
                    return 0;
                },
                duration: 1200,
                easing: 'easeOutQuart'
            }
        }
    });
}

// helper: is canvas in viewport (trigger a bit earlier)
function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight - 120;
}

let chartAnimated = false;

// init chart as zero immediately (so canvas is present)
document.addEventListener("DOMContentLoaded", () => {
    if (!canvas) return;
    initChartWithZeros();

    // if already visible on load, animate right away
    if (!chartAnimated && isInViewport(canvas)) {
        chartAnimated = true;
        // set real data and update (Chart.js will animate from zeros to real values, respecting the delay)
        exportChart.data.datasets[0].data = exportValues.slice();
        exportChart.update();
        const wrapper = document.querySelector(".chart-animate");
        if (wrapper) wrapper.classList.add("active");
    }
});

// on scroll: when canvas enters viewport, set real data and update once
window.addEventListener("scroll", () => {
    if (chartAnimated) return;
    if (!canvas) return;

    if (isInViewport(canvas)) {
        chartAnimated = true;
        // show wrapper animation class (if you use it)
        const wrapper = document.querySelector(".chart-animate");
        if (wrapper) wrapper.classList.add("active");

        // set dataset to real values and call update -> Chart.js will animate
        exportChart.data.datasets[0].data = exportValues.slice();
        exportChart.update();
    }
});

ScrollTrigger.create({
  trigger: ".page-wrapper",
  start: "top bottom",
  onEnter: () =>
    gsap.to(".map-fixed-container", {
      opacity: 0,
      pointerEvents: "none"
    }),
  onLeaveBack: () =>
    gsap.to(".map-fixed-container", {
      opacity: 1,
      pointerEvents: "auto"
    })
});


// สิ่งที่โลกมาองหาและไทยตอบได้
    
// สายอาหาร

const foodTypeData = {
    spicy: {
        title: "สายจัดจ้าน 🔥",
        img: "assets/images/รูปต้มยำกุ้ง .png",
        desc: "เผ็ด เปรี้ยว เค็มเข้มข้น เหมาะสำหรับคนรักความท้าทาย",
        blocks: [
            {
                color: "#ff3b30",
                icon: "🌶️",
                title: "รสชาติประจำสายนี้",
                desc: [
                    "ชอบรสจัด เด็ดทุกสัมผัส",
                    "เป็นคนชอบลองของใหม่ อยู่ไม่อยู่นิ่ง"
                ]
            },
            {
                color: "#ff3b30",
                icon: "🍜",
                title: "เมนูที่ใช่",
                desc: [
                    "ต้มยำทะเล",
                    "ยำแซ่บ",
                    "แกงเผ็ด"
                ]
            }
        ]
    },

    soft: {
        title: "สายนุ่มละมุน 🧡",
        img: "assets/images/favfooddetail/ต้มข่าไก่_จานโปรด.png",
        desc: "สายหวานนุ่ม ไม่เผ็ด ไม่จัด อารมณ์ละมุนๆ",
        blocks: [
            {
                color: "#ff9f0a",
                icon: "🥥",
                title: "รสชาติประจำสายนี้",
                desc: [
                    "อบอุ่น อ่อนโยน",
                    "ไม่เน้นจัดจ้าน"
                ]
            },
            {
                color: "#ff9f0a",
                icon: "🍲",
                title: "เมนูที่ใช่",
                desc: [
                    "แกงเขียวหวาน",
                    "ต้มจืดเต้าหู้"
                ]
            }
        ]
    },

    healthy: {
        title: "สายสุขภาพ 💚",
        img: "assets/images/น้ำพริกกะปิ.jpeg",
        desc: "เน้นกินดี อยู่ดี สายคลีนตัวจริง",
        blocks: [
            {
                color: "#34c759",
                icon: "💚",
                title: "บุคลิกของสายนี้",
                desc: [
                    "มีวินัย ชอบวางแผน",
                    "ใส่ใจสุขภาพตัวเอง"
                ]
            },
            {
                color: "#34c759",
                icon: "🥗",
                title: "เมนูที่ใช่",
                desc: [
                    "สลัดอกไก่",
                    "ปลาย่าง",
                    "เมนูคลีนๆ"
                ]
            }
        ]
    },

    modern: {
        title: "สายทันสมัย ✨",
        img: "assets/images/รูปผัดไทย สไตล์ อเมริกา.png",
        desc: "สนุกกับการผสมรสชาติไทยเข้ากับไอเดียใหม่และวัฒนธรรมร่วมสมัย",
        blocks: [
            {
                color: "#a734c7ff",
                icon: "✨",
                title: "บุคลิกของสายนี้",
                desc: [
                    "ครีเอทีฟ ไอเดียเยอะ ชอบของใหม่ไม่จำเจ"

                ]
            },
            {
                color: "#a734c7ff",
                icon: "🍔",
                title: "เมนูที่ใช่",
                desc: [
                    "ผัดไทยฟิวชัน, เบอร์เกอร์ไทยสไตล์, ข้าวหน้าหมูไทย-เกาหลี"


                ]
            },
            {
                color: "#a734c7ff",
                icon: "♻️",
                title: "เทรนด์อาหารโลกที่เข้ากับสายนี้:",
                desc: [
                    "อาหารคาร์บอนต่ำ อาหารฟิวชัน และความยั่งยืน"


                ]
            }
        ]
    }



};

function showFoodTypeDetail(type) {
    const data = foodTypeData[type];

    // ซ่อนหน้าเลือกสายอาหาร
    document.getElementById("foodTypeSelect").classList.add("hidden");

    // ใส่ข้อมูล
    document.getElementById("foodTypeTitle").innerHTML = data.title;
    document.getElementById("foodTypeDesc").innerHTML = data.desc;

    const img = document.getElementById("foodTypeImg");
    img.src = data.img;
    img.style.display = "block";

    const container = document.getElementById("foodDetailContainer");
    container.innerHTML = "";

    data.blocks.forEach(b => {
        container.innerHTML += `
            <div class="detail-box" style="border-left-color:${b.color}">
                <h3><span class="detail-icon">${b.icon}</span>${b.title}</h3>
                ${b.desc.map(text => `<p>${text}</p>`).join("")}
            </div>
        `;
    });

    // แสดงหน้ารายละเอียด
    const detailSection = document.getElementById("foodTypeDetail");
    detailSection.classList.remove("hidden");
    detailSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function backToFoodType() {
    // ซ่อนหน้ารายละเอียด
    document.getElementById("foodTypeDetail").classList.add("hidden");

    // แสดงหน้าเลือกสายอาหาร
    const selectSection = document.getElementById("foodTypeSelect");
    selectSection.classList.remove("hidden");
    selectSection.scrollIntoView({ behavior: "smooth", block: "start" });
}





// เมนูโปรด

// ข้อมูลเมนูทั้งหมด
// ข้อมูลเมนูทั้งหมด
const favFoodData = {
    padthai: {
        title: "ผัดไทย",
        img: "assets/images/favfooddetail/ผัดไทย_จานโปรด.png",
        source: "",       // TODO: ใส่ URL แหล่งอ้างอิงข้อมูลประวัติ
        imageSource: "",  // TODO: ใส่ URL/เครดิตแหล่งที่มาของภาพ
        history: "ผัดไทย ยุคสมัย: ผัดไทยเกิดขึ้นในสมัย จอมพล ป. พิบูลสงคราม ดำรงตำแหน่งนายกรัฐมนตรี (ช่วงปลายทศวรรษ 2480 ถึงต้น 2490) ซึ่งเป็นช่วงที่ประเทศไทยประสบกับปัญหาเศรษฐกิจตกต่ำ และภาวะขาดแคลนข้าวจากสงครามโลกครั้งที่ 2",
        ingredients: [
            "เส้นจันท์",
            "เต้าหู้",
            "กุ้งสด",
            "หอมแดง",
            "ถั่วงอก",
            "ไข่",
            "น้ำมะขาม"
        ]
    },

    greencurry: {
        title: "แกงเขียวหวาน",
        img: "assets/images/favfooddetail/แกงเขียวหวาน_จานโปรด.png",
        source: "",       // TODO: ใส่ URL แหล่งอ้างอิงข้อมูลประวัติ
        imageSource: "",  // TODO: ใส่ URL/เครดิตแหล่งที่มาของภาพ
        history: 'แกงเขียวหวาน เป็นแกงกะทิรสชาติกลมกล่อม ที่มีต้นกำเนิดจาก ภาคกลาง ของประเทศไทย เชื่อกันว่าพัฒนามาจากการปรุงอาหารประเภทแกงกะทิใน สมัยอยุธยา โดยดัดแปลงมาจากแกงเผ็ดหรือแกงแดงจุดเด่นของแกงเขียวหวานคือการใช้ พริกขี้หนูสดสีเขียว หรือ พริกชี้ฟ้าเขียว ในการทำน้ำพริกแกง ทำให้ได้สีเขียวนวลตา เมื่อผัดกับกะทิคำว่า "หวาน" ในชื่อไม่ได้หมายถึงรสหวานนำ แต่หมายถึงสีเขียวที่ดู "หวานละมุน" หรือ "นวล"',
        ingredients: [
            "กะทิ",
            "พริกแกงเขียวหวาน",
            "ไก่",
            "ใบโหระพา",
            "มะเขือเปราะ",
            "พริกชี้ฟ้า"
        ]
    },

    tomkakai: {
        title: "ต้มข่าไก่",
        img: "assets/images/favfooddetail/ต้มข่าไก่_จานโปรด.png",
        source: "",       // TODO: ใส่ URL แหล่งอ้างอิงข้อมูลประวัติ
        imageSource: "",  // TODO: ใส่ URL/เครดิตแหล่งที่มาของภาพ
        history: 'ต้มข่าไก่ มีต้นกำเนิดประมาณปี พ.ศ. 2433 (ปลายรัชกาลที่ 5) และถูกบันทึกไว้ในตำราอาหารไทยยุคแรก ๆเมนูต้นฉบับ: เมนูต้มข่าดั้งเดิมที่ถูกบันทึกไว้คือ "ต้มข่าเป็ด" ซึ่งใช้เนื้อเป็ดและข่าอ่อนเป็นส่วนผสมหลักในน้ำแกงกะทิ',
        ingredients: [
            "เนื้อไก่",
            "กะทิ",
            "ข่าอ่อน",
            "ตะไคร้",
            "ใบมะกรูด",
            "เห็ด",
            "น้ำปลา",
            "น้ำมะนาว"
        ]
    },

    tomyum: {
        title: "ต้มยำกุ้ง",
        img: "assets/images/favfooddetail/ต้มยำกุ้ง_จานโปรด.png",
        source: "",       // TODO: ใส่ URL แหล่งอ้างอิงข้อมูลประวัติ
        imageSource: "",  // TODO: ใส่ URL/เครดิตแหล่งที่มาของภาพ
        history: "ต้มยำกุ้ง เป็นซุปสมุนไพรไทยที่มีต้นกำเนิดจาก ภาคกลาง เชื่อว่าเกิดจากวิถีชีวิตริมน้ำของคนไทยที่จับกุ้งสดจาก แม่น้ำ แล้วนำมาปรุงกับสมุนไพร พื้นบ้าน เช่น ข่า ตะไคร้ มะกรูด สืบทอดมาตั้งแต่สมัย “กรุงศรีอยุธยา” และกลายเป็นหนึ่งในอาหารประจำชาติของไทย ปัจจุบันเป็นเมนูที่สร้างอัตลักษณ์ความ “เผ็ด-เปรี้ยว-หอมสมุนไพร” ให้โลกจดจำอาหารไทย...",
        ingredients: [
            "กุ้ง",
            "ตะไคร้",
            "ใบมะกรูด",
            "พริกสด",
            "เห็ดฟาง",
            "น้ำปลา",
            "มะนาว"
        ]
    },

    taipla: {
        title: "แกงไตปลา",
        img: "assets/images/favfooddetail/แกงไตปลา_จานโปรด.png",
        source: "",       // TODO: ใส่ URL แหล่งอ้างอิงข้อมูลประวัติ
        imageSource: "",  // TODO: ใส่ URL/เครดิตแหล่งที่มาของภาพ
        history: 'แกงไตปลา  มาจากส่วนผสมหลักที่ให้รสชาติและกลิ่นเฉพาะตัว คือ "ไตปลา" หรือ "พุงปลา" ซึ่งเป็นส่วนของกระเพาะและลำไส้ของปลา (เช่น ปลาทู ปลาอินทรี หรือปลาช่อน) ที่นำมาหมักกับเกลือจนกลายเป็นน้ำพริก/เครื่องปรุงรสเค็มข้นคล้ายกะปิหรือปลาร้า',
        ingredients: [
            "ไตปลา",
            "เนื้อปลา",
            "พริกแกงใต้",
            "หน่อไม้",
            "มะเขือเปราะ",
            "ถั่วฝักยาว",
            "ใบมะกรูด"
        ]
    },

    redcurry: {
        title: "มัสมั่น",
        img: "assets/images/favfooddetail/แกงมัสมั่นไก่_จานโปรด.png",
        source: "",       // TODO: ใส่ URL แหล่งอ้างอิงข้อมูลประวัติ
        imageSource: "",  // TODO: ใส่ URL/เครดิตแหล่งที่มาของภาพ
        history: 'แกงมัสมั่นไก่ มีต้นกำเนิดจาก แขกเจ้าเซ็น (มุสลิมนิกายชีอะฮ์ในประเทศไทย) สมัยกรุงศรีอยุธยา นำเครื่องเทศนานาชนิดมาผสมผสานกับวัตถุดิบไทย กลายเป็นแกงรสเข้มข้น มีกลิ่นหอมจากเครื่องเทศ เช่น ยี่หร่า, ลูกผักชี, อบเชย และกานพลู, ถูกบันทึกครั้งแรกใน "กาพย์เห่เรือชมเครื่องคาวหวาน" รัชกาลที่ 2 และได้รับยกย่องเป็นอาหารอร่อยที่สุดในโลก โดยชื่อ "มัสมั่น" มาจากคำว่า "มุสลิมาน" (ชาวมุสลิม) ในภาษาเปอร์เซีย',
        ingredients: [
            "กะทิ",
            "พริกแกงมัสมั่น",
            "ไก่",
            "มันฝรั่ง",
            "หอมใหญ่",
            "ถั่วลิสงคั่ว",
            "อบเชยและลูกกระวาน"
        ]
    },

    kaosoi: {
        title: "ข้าวซอย",
        img: "assets/images/favfooddetail/ข้าวซอย_จานโปรด.png",
        source: "",       // TODO: ใส่ URL แหล่งอ้างอิงข้อมูลประวัติ
        imageSource: "",  // TODO: ใส่ URL/เครดิตแหล่งที่มาของภาพ
        history: 'ข้าวซอย มีรากเหง้ามาจากอาหารของ ชาวจีนมุสลิม (จีนฮ่อ/จีนยูนนาน) ที่อพยพมาค้าขายและตั้งถิ่นฐานบริเวณภาคเหนือของไทย พม่า (เมียนมา) และลาว ในช่วงศตวรรษที่ 19    สูตรดั้งเดิม (ข้าวซอยน้ำใส): ข้าวซอยแบบดั้งเดิมของชาวจีนฮ่อ ไม่มีส่วนผสมของกะทิ น้ำซุปจะใสและได้จากการเคี่ยวกระดูกสัตว์ (วัว/ไก่) และมีชื่อเรียกแตกต่างกันไป เช่น ข้าวซอยหนาก หรือ เออร์ไคว่ (Erkuai)',
        ingredients: [
            "บะหมี่ไข่",
            "เนื้อไก่หรือเนื้อวัว",
            "กะทิ",
            "พริกแกงข้าวซอย",
            "บะหมี่ทอดกรอบ",
            "ผักกาดดอง",
            "หอมแดงและมะนาว"
        ]
    },

    stickyrice: {
        title: "ข้าวเหนียวมะม่วง",
        img: "assets/images/favfooddetail/ข้าวเหนียวมะม่วง_จานโปรด.png",
        source: "",       // TODO: ใส่ URL แหล่งอ้างอิงข้อมูลประวัติ
        imageSource: "",  // TODO: ใส่ URL/เครดิตแหล่งที่มาของภาพ
        history: 'ข้าวเหนียวมะม่วง เป็นของหวานที่มีมานานในประเทศไทย คาดว่ามีมาตั้งแต่สมัยปลายอยุธยา และได้รับความนิยมต่อเนื่องมาจนถึงสมัยรัตนโกสินทร์ตอนต้น โดยมีบันทึกในบทประพันธ์ โคลงกาพย์เห่ชมเครื่องคาวหวาน ในรัชกาลที่ 2 แห่งกรุงรัตนโกสินทร์ (แต่ไม่ได้ระบุชื่อว่า "ข้าวเหนียวมะม่วง" อย่างชัดเจน)',
        ingredients: [
            "ข้าวเหนียวมูน",
            "มะม่วงสุก",
            "กะทิ",
            "น้ำตาล",
            "เกลือ",
            "ถั่วทองคั่ว"
        ]
    }
};

// แสดงหน้า detail
function showFoodDetail(menu) {
    const selectPage = document.getElementById("favFoodSelect");
    const detailPage = document.getElementById("favFoodDetail");

    selectPage.classList.add("hidden");
    detailPage.classList.remove("hidden");

    const data = favFoodData[menu];

    document.getElementById("foodTitle").innerText = data.title;
    document.getElementById("foodImg").src = data.img;
    document.getElementById("foodHistory").innerText = data.history;

    // แหล่งอ้างอิงข้อมูลประวัติ
    const historySource = data.source
        ? '<a href="' + data.source + '" target="_blank" rel="noopener">' + data.source + '</a>'
        : "รอเพิ่มแหล่งอ้างอิง";
    document.getElementById("foodSource").innerHTML = "แหล่งที่มาข้อมูล: " + historySource;

    const ul = document.getElementById("foodIngredients");
    ul.innerHTML = "";
    data.ingredients.forEach(item => {
        let li = document.createElement("li");
        li.textContent = item;
        ul.appendChild(li);
    });

    detailPage.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ปุ่มกลับ
function backToMenu() {
    document.getElementById("favFoodDetail").classList.add("hidden");
    const menu = document.getElementById("favFoodSelect");
    menu.classList.remove("hidden");
    menu.scrollIntoView({ behavior: "smooth", block: "center" });
}

/* ======================================================
   BACKGROUND MUSIC & SOUND CONTROLLER
====================================================== */
(function initSoundController() {
  const bgmAudio = document.getElementById('bgmAudio');
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundIcon = document.getElementById('soundIcon');
  const soundLabel = document.getElementById('soundLabel');
  const soundVolumeSlider = document.getElementById('soundVolumeSlider');

  if (!bgmAudio || !soundToggleBtn) return;

  let isPlaying = false;
  let userVolume = 0.18;
  let ambienceFactor = 1;
  let targetVolume = userVolume;
  let fadeInterval = null;

  // Set initial volume
  bgmAudio.volume = 0;
  if (soundVolumeSlider) {
    soundVolumeSlider.value = targetVolume * 100;
  }

  function fadeTo(targetVol, duration = 800) {
    clearInterval(fadeInterval);
    const stepTime = 50;
    const steps = Math.max(1, Math.round(duration / stepTime));
    const startVolume = bgmAudio.volume;
    const volumeDelta = targetVol - startVolume;
    let currentStep = 0;
    
    fadeInterval = setInterval(() => {
      currentStep += 1;
      const progress = Math.min(currentStep / steps, 1);
      bgmAudio.volume = Math.max(0, Math.min(1, startVolume + (volumeDelta * progress)));
      if (progress >= 1) {
        bgmAudio.volume = targetVol;
        clearInterval(fadeInterval);
      }
    }, stepTime);
  }

  function fadeOut(duration = 600, callback) {
    clearInterval(fadeInterval);
    const stepTime = 50;
    const steps = duration / stepTime;
    const volStep = bgmAudio.volume / steps;

    fadeInterval = setInterval(() => {
      if (bgmAudio.volume - volStep > 0.02) {
        bgmAudio.volume -= volStep;
      } else {
        bgmAudio.volume = 0;
        clearInterval(fadeInterval);
        if (callback) callback();
      }
    }, stepTime);
  }

  const soundIconContainer = soundToggleBtn.querySelector('.sound-icon-container');

  function updateUI(playing) {
    if (playing) {
      soundToggleBtn.classList.add('is-playing');
      if (soundLabel) soundLabel.textContent = 'ปิดเสียงดนตรี';
      if (soundIconContainer) soundIconContainer.innerHTML = '<i data-lucide="volume-2" id="soundIcon"></i>';
    } else {
      soundToggleBtn.classList.remove('is-playing');
      if (soundLabel) soundLabel.textContent = 'เปิดเสียงดนตรี';
      if (soundIconContainer) soundIconContainer.innerHTML = '<i data-lucide="volume-x" id="soundIcon"></i>';
    }
    if (window.lucide && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }
  }

  async function togglePlay() {
    if (!isPlaying) {
      try {
        await bgmAudio.play();
        isPlaying = true;
        updateUI(true);
        fadeTo(targetVolume);
      } catch (err) {
        console.warn('Audio playback failed or was blocked by browser policy:', err);
      }
    } else {
      isPlaying = false;
      updateUI(false);
      fadeOut(500, () => {
        bgmAudio.pause();
      });
    }
  }

  soundToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePlay();
  });

  if (soundVolumeSlider) {
    soundVolumeSlider.addEventListener('input', (e) => {
      userVolume = parseFloat(e.target.value) / 100;
      targetVolume = userVolume * ambienceFactor;
      if (isPlaying) {
        fadeTo(targetVolume, 220);
      }
    });

    soundVolumeSlider.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // Data-heavy sections use a softer bed so narration and reading stay in focus.
  const quietSections = Array.from(document.querySelectorAll(
    '.page-wrapper, .white-section, .global-demand-section, .foodtype-section'
  ));

  function updateSectionVolume() {
    const readingLine = window.innerHeight * 0.52;
    const isReadingDenseSection = quietSections.some(section => {
      const rect = section.getBoundingClientRect();
      return rect.top <= readingLine && rect.bottom >= readingLine;
    });
    const nextFactor = isReadingDenseSection ? 0.55 : 1;
    if (nextFactor === ambienceFactor) return;
    ambienceFactor = nextFactor;
    targetVolume = userVolume * ambienceFactor;
    if (isPlaying) fadeTo(targetVolume, 700);
  }

  window.addEventListener('scroll', updateSectionVolume, { passive: true });
  updateSectionVolume();
})();
