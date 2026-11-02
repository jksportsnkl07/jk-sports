document.addEventListener('DOMContentLoaded', function () {
  /* ════ STICKY HEADER SCROLL ════ */
  var header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        header.style.padding = '0.5rem 1.25rem';
      } else {
        header.style.padding = '1rem 1.25rem';
      }
    });
  }

  /* ════ SCROLL REVEAL ANIMATION ════ */
  var observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.sport-item, .testi-card, .zone-card, .product-card, .tip-card, .order-card').forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
});

/* ════ ESCAPE KEY CLOSES MODALS ════ */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    if (typeof closeModal === 'function') closeModal();
  }
});

/* ════ FAQ ACCORDION ════ */
function toggleFaq(el) {
  var item   = el.parentElement;
  var isOpen = item.classList.contains('active');
  document.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('active'); });
  if (!isOpen) item.classList.add('active');
}
window.toggleFaq = toggleFaq;

/* ════ SPORT SEARCH & FILTER ════ */
function updateSportsGroupHeadings() {
  document.querySelectorAll('.sports-grid').forEach(function (grid) {
    var hasVisible = Array.prototype.some.call(
      grid.querySelectorAll('.sport-item'),
      function (item) { return item.style.display !== 'none'; }
    );
    var heading = grid.previousElementSibling;
    if (heading && heading.classList.contains('sports-group-heading')) {
      heading.style.display = hasVisible ? '' : 'none';
    }
    grid.style.display = hasVisible ? '' : 'none';
  });
}

function filterSports() {
  var q = document.getElementById('sportSearch').value.toLowerCase();
  document.querySelectorAll('.sport-item').forEach(function (item) {
    var name = item.querySelector('.sport-name').textContent.toLowerCase();
    item.style.display = name.includes(q) ? '' : 'none';
  });
  updateSportsGroupHeadings();
}
window.filterSports = filterSports;

function filterByTag(tag, el) {
  document.querySelectorAll('.pill').forEach(function (p) { p.classList.remove('active'); });
  el.classList.add('active');
  document.querySelectorAll('.sport-item').forEach(function (item) {
    item.style.display = (tag === 'all' || item.dataset.tag === tag) ? '' : 'none';
  });
  document.getElementById('sportSearch').value = '';
  updateSportsGroupHeadings();
}
window.filterByTag = filterByTag;

/* ════ GEAR RECOMMENDER ════ */
function getRecommendation() {
  var sport = document.getElementById('recSport').value;
  var style = document.getElementById('recStyle').value;
  var age   = parseInt(document.getElementById('recAge').value, 10);
  var el    = document.getElementById('recResult');

  if (!sport || !style) {
    el.textContent = '⚠️ Please choose a sport and playing style.';
    return;
  }

  var recs = {
    'Cricket':       { Casual: 'Tennis-ball bat + soft ball kit',             Competitive: 'SG / SS Kashmir willow bat + leather ball', Professional: 'English willow bat + full match kit' },
    'Badminton':     { Casual: 'Entry-level Yonex racket + feather shuttles', Competitive: 'Yonex Arcsaber + high-tension strings',      Professional: 'Yonex Nanoray + premium grip set' },
    'Football':      { Casual: 'Size 4 TPU ball + shin guards',               Competitive: 'Match ball + cleats',                       Professional: 'FIFA-approved ball + full kit' },
    'Basketball':    { Casual: 'Indoor rubber ball + knee support',            Competitive: 'Spalding outdoor ball + ankle support',      Professional: 'Full practice kit + court shoes' },
    'Tennis':        { Casual: 'Beginner graphite racket + pressureless balls',Competitive: 'Mid-weight 100sq racket + premium balls',   Professional: 'Pro-staff series + dampeners' },
    'Gym / Fitness': { Casual: 'Resistance bands + yoga mat',                  Competitive: 'Dumbbell set + lifting belt',               Professional: 'Full gym equipment bundle' }
  };

  var rec     = (recs[sport] && recs[sport][style]) ? recs[sport][style] : 'Visit our store for personalised guidance!';
  var ageNote = (age && age < 14) ? ' (Junior sizing recommended)' : (age && age > 50) ? ' (Lightweight options available)' : '';

  el.innerHTML =
    '✅ Recommended for <strong>' + sport + ' – ' + style + '</strong>:<br/>' +
    rec + ageNote +
    '<br/><small style="color:#666;font-size:0.78rem;">Visit any JK Sports branch for expert fitting &amp; selection.</small>';
}
window.getRecommendation = getRecommendation;

/* ════ SPORT CATALOG MODAL ════
   Each sport/category maps to a LIST of related products.
   Clicking any sport image opens a catalog showing every
   product available for that sport — not just one item.

   NOTE: Chess and Carrom used to both point at a shared 'indoor'
   catalog entry, so clicking either card opened the same modal.
   They now have their own dedicated 'chess' and 'carrom' entries.
*/
var CATALOG = {
  cricket: {
    title: 'Cricket Gear',
    tag:   'CRICKET ZONE',
    desc:  'Everything you need for cricket — bats, balls, protective gear, and accessories.',
    items: [
      { img: 'https://images.jdmagicbox.com/comp/namakkal/b2/9999p4286.4286.210910111823.j4b2/catalogue/-hn65ksaxy5-250.jpg', name: 'Premium Cricket Bat', desc: 'Kashmir & English willow, Grade 1–3', stock: true },
      { img: 'assets/stanford_cricket_ball.webp', name: 'Match-Grade Ball', desc: 'SG, Kookaburra & local leather balls', stock: true },
      { img: 'https://images.unsplash.com/photo-1646282814550-f521d9b57a59?w=400&auto=format&fit=crop', name: 'Sri Lankan Turf Bats', desc: 'Premium Ceylon willow, turf wickets', stock: true },
      { img: 'assets/white_cricket_test_pad.webp', name: 'Batting Pads & Gloves', desc: 'Protective gear for batsmen', stock: true },
      { img: 'assets/blue_cricket_helmet.webp', name: 'Cricket Helmets', desc: 'ICC-spec protective helmets', stock: true },
      { img: 'assets/cricket_stemp.webp', name: 'Cricket Stumps', desc: 'Kox Tons wooden stumps for practice & matches', stock: true },
      { img: 'https://images.unsplash.com/photo-1644984785457-facabdba5b16?w=400&auto=format&fit=crop', name: 'Wicket Keeping Kit', desc: 'Gloves, pads & inner gloves', stock: true }
    ]
  },
  badminton: {
    title: 'Badminton Gear',
    tag:   'BADMINTON ZONE',
    desc:  'Yonex rackets, shuttles, and accessories for every skill level.',
    items: [
      { img: 'assets/yonex_badminton_racket.webp', name: 'Yonex Racket Pro', desc: 'Arcsaber / Astrox / Nanoray series', stock: true },
      { img: 'assets/yonex_mavis_350_shuttlecocks.webp', name: 'Feather Shuttlecocks', desc: 'Tournament & practice grade', stock: true },
      { img: 'https://images.unsplash.com/photo-1708312604109-16c0be9326cd?w=400&auto=format&fit=crop', name: 'Grip Tape & Overgrips', desc: 'Sweat-absorbent racket grips', stock: true },
      { img: 'assets/hycourt_neon_yellow_court_shoes.webp', name: 'Badminton Shoes', desc: 'Non-marking court soles', stock: true },
      { img: 'assets/yonex_bg80_bg65_ti_strings.webp', name: 'Racket Stringing Service', desc: 'Custom tension stringing in-store', stock: true }
    ]
  },
  football: {
    title: 'Football & Ball Sports',
    tag:   'BALL SPORTS ZONE',
    desc:  'Match balls and gear for football, volleyball, kabaddi, basketball and hockey.',
    items: [
      { img: 'assets/nivia_football.webp', name: 'Match-Grade Football', desc: 'Size 4 & 5, TPU and leather', stock: true },
      { img: 'assets/mayor_club_shin_guards.webp', name: 'Shin Guards', desc: 'Lightweight protective guards', stock: true },
      { img: 'assets/nivia_blue_football_boots.webp', name: 'Football Boots / Cleats', desc: 'Firm-ground & turf studs', stock: true },
      { img: 'assets/nivia_carbonite_goalkeeper_gloves.webp', name: 'Nivia Carbonite Goalkeeper Gloves', desc: 'Carbonite range with reinforced palm grip', stock: true },
      { img: 'assets/golden_football_boot_trophy.webp', name: 'Golden Football Boot Trophy', desc: 'Golden boot award trophy for tournaments', stock: true },
      { img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&auto=format&fit=crop', name: 'Goal Nets & Cones', desc: 'Training equipment for clubs', stock: true }
    ]
  },
  basketball: {
    title: 'Basketball Gear',
    tag:   'BALL SPORTS ZONE',
    desc:  'Indoor and outdoor basketballs plus support gear.',
    items: [
      { img: 'assets/nivia_europa_basketball.webp', name: 'Nivia Europa Basketball', desc: 'Durable rubber outdoor ball', stock: true },
      { img: 'https://images.unsplash.com/photo-1519861531473-9200626188a1?w=400&auto=format&fit=crop', name: 'Indoor Rubber Ball', desc: 'Indoor court grip ball', stock: true },
      { img: 'https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?w=400&auto=format&fit=crop', name: 'Ankle Support Guards', desc: 'Compression ankle braces', stock: true }
    ]
  },
  volleyball: {
    title: 'Volleyball Gear',
    tag:   'BALL SPORTS ZONE',
    desc:  'Match volleyballs and knee support gear.',
    items: [
      { img: 'assets/nivia_white_green_ball.webp', name: 'Match Volleyball', desc: 'Official size & weight', stock: true },
      { img: 'https://images.unsplash.com/photo-1616347853803-5bc49f9e4e27?w=400&auto=format&fit=crop', name: 'Knee Pads', desc: 'Cushioned protective pads', stock: true }
    ]
  },
  kabaddi: {
    title: 'Kabaddi Gear',
    tag:   'BALL SPORTS ZONE',
    desc:  'Local favourite — court gear and accessories for kabaddi teams.',
    items: [
      { img: 'https://images.unsplash.com/photo-1568234928966-359c35dd8327?w=400&auto=format&fit=crop', name: 'Kabaddi Mat / Court Marking', desc: 'Standard court setup kit', stock: true },
      { img: 'https://images.unsplash.com/photo-1655089131279-8029e8a21ac6?w=400&auto=format&fit=crop', name: 'Team Jerseys', desc: 'Custom printed team kits', stock: true }
    ]
  },
  hockey: {
    title: 'Hockey Gear',
    tag:   'BALL SPORTS ZONE',
    desc:  'Sticks, balls, and protective gear for hockey players.',
    items: [
      { img: 'assets/punch_flash_field_hockey_stick.webp', name: 'Hockey Stick', desc: 'Composite & wooden sticks', stock: true },
      { img: 'assets/triumph_dimpled_ball.webp', name: 'Hockey Ball', desc: 'Hard plastic match ball', stock: true },
      { img: 'assets/red_captain_shin_guards.webp', name: 'Hockey Shin Guards', desc: 'Protective shin guards for hockey players', stock: true }
    ]
  },
  tennis: {
    title: 'Tennis Gear',
    tag:   'RACKET ZONE',
    desc:  'Rackets and balls for casual to professional play.',
    items: [
      { img: 'assets/head_ti_instinct_comp_tennis_racket.webp', name: 'Graphite Tennis Racket', desc: 'Beginner to pro-staff series', stock: true },
      { img: 'assets/wilson_tour_premier_tennis_balls.webp', name: 'Pressureless Tennis Balls', desc: 'Practice & match cans', stock: true },
      { img: 'https://images.unsplash.com/photo-1612364741797-c3c1756afb91?w=400&auto=format&fit=crop', name: 'Vibration Dampeners', desc: 'String vibration control', stock: true },
      { img: 'assets/weighted-tennis-racket.jpg', name: 'Weighted Training Racket', desc: 'Extra-weight racket for strength & swing training', stock: true }
    ]
  },
  tabletennis: {
    title: 'Table Tennis Gear',
    tag:   'RACKET ZONE',
    desc:  'Paddles, balls and table accessories.',
    items: [
      { img: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=400&auto=format&fit=crop', name: 'TT Paddle / Racket', desc: 'Rubber-faced paddles, all grades', stock: true },
      { img: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?w=400&auto=format&fit=crop', name: 'TT Balls (3-Star)', desc: 'Tournament-grade balls', stock: true }
    ]
  },
  fitness: {
    title: 'Gym & Fitness Equipment',
    tag:   'GYM EQUIPMENT AVAILABLE',
    desc:  'Dumbbells, barbells, benches, resistance bands, and full home-gym sets from trusted brands.',
    items: [
      { img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&auto=format&fit=crop', name: 'Dumbbell Sets', desc: 'Adjustable & fixed weight options', stock: true },
      { img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop', name: 'Barbells & Weight Plates', desc: 'Olympic & standard bars', stock: true },
      { img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d45?w=400&auto=format&fit=crop', name: 'Resistance Bands', desc: 'Multiple resistance levels', stock: true },
      { img: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&auto=format&fit=crop', name: 'Gym Benches', desc: 'Flat & adjustable incline benches', stock: true },
      { img: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&auto=format&fit=crop', name: 'Pull-Up Bars', desc: 'Wall-mounted & doorway bars', stock: true }
    ]
  },
  yoga: {
    title: 'Yoga & Wellness',
    tag:   'WELLNESS ZONE',
    desc:  'Mats and accessories for yoga and wellness routines.',
    items: [
      { img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&auto=format&fit=crop', name: 'Yoga Mats', desc: 'Non-slip, multiple thicknesses', stock: true },
      { img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&auto=format&fit=crop', name: 'Yoga Blocks & Straps', desc: 'Support props for practice', stock: true }
    ]
  },
  athletics: {
    title: 'Athletics Gear',
    tag:   'ATHLETICS ZONE',
    desc:  'Track and field essentials for athletes.',
    note:  'All types of athletics products are available',
    items: [
      { img: 'https://images.unsplash.com/photo-1547941126-3d5322b218b0?w=400&auto=format&fit=crop', name: 'Running Spikes', desc: 'Track shoes for sprint & distance', stock: true },
      { img: 'https://images.unsplash.com/photo-1761225291317-6bbf383011f2?w=400&auto=format&fit=crop', name: 'Stopwatches & Batons', desc: 'Relay & timing equipment', stock: true },
      { img: 'https://images.unsplash.com/photo-1579156618441-0f9f420e2a25?w=400&auto=format&fit=crop', name: 'Javelins', desc: 'Competition & training javelins, all weights', stock: true },
      { img: 'https://images.unsplash.com/photo-1742111281708-407b8f75da6f?w=400&auto=format&fit=crop', name: 'Shot Put', desc: 'Indoor & outdoor shot put balls, various weights', stock: true },
      { img: 'https://images.unsplash.com/photo-1742495212062-eace5ce3b532?w=400&auto=format&fit=crop', name: 'Discus', desc: 'Training & competition discus', stock: true },
      { img: 'https://images.unsplash.com/photo-1774748863093-f6935b7f49f8?w=400&auto=format&fit=crop', name: 'Hurdles', desc: 'Adjustable height training hurdles', stock: true },
      { img: 'https://images.unsplash.com/photo-1526676317768-d9b14f15615a?w=400&auto=format&fit=crop', name: 'Starting Blocks', desc: 'Sprint starting blocks for track meets', stock: true },
      { img: 'https://images.unsplash.com/photo-1776705865346-3f32edc23b60?w=400&auto=format&fit=crop', name: 'Long & High Jump Gear', desc: 'Measuring tapes, landing mats & crossbars', stock: true }
    ]
  },
  chess: {
    title: 'Chess',
    tag:   'INDOOR ZONE',
    desc:  'Chess boards and sets for casual play, clubs and tournaments.',
    items: [
      { img: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400&auto=format&fit=crop', name: 'Wooden Chess Set', desc: 'Classic wooden board with weighted pieces', stock: true },
      { img: 'https://images.unsplash.com/photo-1585856262121-33f7c37eb2c3?w=400&auto=format&fit=crop', name: 'Tournament Chess Set', desc: 'Vinyl roll-up board, tournament-standard pieces', stock: true },
      { img: 'https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=400&auto=format&fit=crop', name: 'Chess Clock', desc: 'Digital & analog timers for competitive play', stock: true }
    ]
  },
  carrom: {
    title: 'Carrom',
    tag:   'INDOOR ZONE',
    desc:  'Carrom boards, coins and accessories for home and club play.',
    items: [
      { img: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400&auto=format&fit=crop', name: 'Standard Carrom Board', desc: 'Full-size board with coins & striker', stock: true },
      { img: 'https://images.unsplash.com/photo-1590490350977-a5b6f1f1a1b6?w=400&auto=format&fit=crop', name: 'Tournament Carrom Board', desc: 'Championship-grade board, smooth finish', stock: true },
      { img: 'https://images.unsplash.com/photo-1622037022824-0c71d511ee3c?w=400&auto=format&fit=crop', name: 'Carrom Powder & Coins', desc: 'Boric powder, coin & striker refill sets', stock: true }
    ]
  },
  swimming: {
    title: 'Swimming Gear',
    tag:   'AQUATICS ZONE',
    desc:  'Goggles, caps and accessories for swimmers.',
    items: [
      { img: 'https://images.unsplash.com/photo-1560090995-01632a28895b?w=400&auto=format&fit=crop', name: 'Swimming Goggles', desc: 'Anti-fog, UV protection', stock: true },
      { img: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=400&auto=format&fit=crop', name: 'Swim Caps', desc: 'Silicone caps, all sizes', stock: true },
      { img: 'assets/swimming-jacket.jpg', name: 'Swimming Jackets', desc: 'Buoyancy & thermal swim jackets, all sizes', stock: true }
    ]
  },
  boxing: {
    title: 'Boxing Gear',
    tag:   'COMBAT SPORTS ZONE',
    desc:  'Gloves, pads, and training gear for boxing.',
    items: [
      { img: 'https://images.unsplash.com/photo-1716307043003-dbe6a5cc496e?w=400&auto=format&fit=crop', name: 'Boxing Gloves', desc: 'Training & sparring gloves, all sizes', stock: true },
      { img: 'https://images.unsplash.com/photo-1716307043224-f5b67e3f64a8?w=400&auto=format&fit=crop', name: 'Punching Bags', desc: 'Heavy bags & speed bags', stock: true },
      { img: 'https://images.unsplash.com/photo-1734104378584-d4e5bff97e56?w=400&auto=format&fit=crop', name: 'Hand Wraps', desc: 'Wrist & knuckle support wraps', stock: true },
      { img: 'https://images.unsplash.com/photo-1708073088059-3e0c7a0e6d18?w=400&auto=format&fit=crop', name: 'Focus Pads & Mitts', desc: 'Coach training pads', stock: true }
    ]
  },
  turfbats: {
    title: 'Sri Lankan Turf Bats',
    tag:   'PREMIUM TURF BATS',
    desc:  'Premium Ceylon willow turf bats, built for turf wicket cricket.',
    items: [
      { img: 'assets/srilunken-turf-bat.webp', name: 'Sri Lankan Turf Bat', desc: 'Premium Ceylon willow, turf wickets', stock: true },
      { img: 'assets/71d5E8EJizL._AC_UF894,1000_QL80_.jpg', name: 'SL Turf Bat — Pro Grade', desc: 'Heavier profile for power hitters', stock: true },
      { img: 'assets/photo-1593766788306-28561086694e.jpg', name: 'SL Turf Bat — Lightweight', desc: 'Quicker pick-up, junior to club level', stock: true }
    ]
  },
  skating: {
    title: 'Skating Gear',
    tag:   'JONEX SKATING ZONE',
    desc:  'Jonex skates for training, fitness and everyday practice.',
    items: [
      { img: 'assets/reagan-m-Q68s5Vf40GM-unsplash.jpg', name: 'Jonex Tenacity Skates', desc: 'Durable Jonex Tenacity quad skates for training & recreational use', stock: true },
      { img: 'assets/susan-weber-9RuN5pzalr4-unsplash.jpg', name: 'Jonex Fix Body Professional Skates', desc: 'Jonex Fix Body Professional — reinforced fixed-body skates for serious skaters', stock: true },
      { img: 'assets/indira-tjokorda-Y-VYK0SDLxs-unsplash.jpg', name: 'Inline Skates', desc: 'All-purpose inline skates, beginner to intermediate levels', stock: true }
    ]
  },
  accessories: {
    title: 'Sports Accessories',
    tag:   'ACCESSORIES ZONE',
    desc:  'Caps, bands, bags and everyday essentials to complete your sports kit.',
    items: [
      { img: 'assets/sonu-kumar-8XZBP38QJFM-unsplash.jpg', name: 'Sports Caps', desc: 'Breathable caps for sun and sweat protection', stock: true },
      { img: 'assets/luigi-estuye-lucreative-4w1353S-Drs-unsplash.jpg', name: 'Wrist Bands', desc: 'Sweat-absorbent wrist bands for training and matches', stock: true },
      { img: 'assets/nathan-dumlao-4GLI-k4wmFg-unsplash.jpg', name: 'Sweat Bands', desc: 'Elastic sweat bands for active wear', stock: true },
      { img: 'assets/brett-wharton-ZgwoBY6CwGI-unsplash.jpg', name: 'Head Bands', desc: 'Non-slip head bands for everyday training', stock: true },
      { img: 'assets/andriyko-podilnyk-sGRJ36ogml8-unsplash.jpg', name: 'Sports Bags', desc: 'Durable kit bags for gear and equipment', stock: true },
      { img: 'assets/joan-tran-reEySFadyJQ-unsplash.jpg', name: 'Water Bottles', desc: 'Sports water bottles, multiple sizes', stock: true },
      { img: 'assets/anton-savinov-Q5t8eNYgDsA-unsplash.jpg', name: 'Air Pumps', desc: 'Ball and tube air pumps with needles', stock: true },
      { img: 'assets/arm-bands.jpg', name: 'Arm Bands', desc: 'Elastic arm bands for training and everyday wear', stock: true },
      { img: 'assets/trophy_collection_display.webp', name: 'Trophy Collection', desc: 'Trophies & awards for tournaments and events', stock: true }
    ]
  }
};

var CATALOG_FALLBACK_IMAGE =
  'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 800 500%22%3E%3Crect width=%22800%22 height=%22500%22 fill=%22%23dbeafe%22/%3E%3Crect x=%2220%22 y=%2220%22 width=%22760%22 height=%22460%22 rx=%2228%22 fill=%22%23eff6ff%22 stroke=%22%2393c5fd%22 stroke-width=%224%22/%3E%3Ctext x=%22400%22 y=%22240%22 text-anchor=%22middle%22 font-family=%22Arial%2Csans-serif%22 font-size=%2232%22 fill=%22%2307304a%22%3EImage unavailable%3C/text%3E%3C/svg%3E';

function getAssetPath(src) {
  if (!src) return src;
  if (/^(data:|blob:|assets\/)/i.test(src)) return src;

  var cleanSrc = String(src).split('?')[0].split('#')[0];
  var fileName = cleanSrc.substring(cleanSrc.lastIndexOf('/') + 1);
  if (!fileName) return src;
  if (!/\.[a-z0-9]+$/i.test(fileName)) fileName += '.jpg';

  return 'assets/' + fileName;
}

function normalizeCatalogImages(catalog) {
  Object.keys(catalog || {}).forEach(function (categoryKey) {
    var category = catalog[categoryKey];
    var items = category && category.items;
    if (!Array.isArray(items)) return;

    items.forEach(function (item) {
      if (!item || typeof item !== 'object') return;
      var src = item.img || item.image || item.src;
      if (src) item.img = getAssetPath(src);
    });
  });
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isBrokenImagePath(src) {
  return !src;
}

function getCatalogImage(item, categoryKey, itemIndex) {
  var src = item && (item.img || item.image || item.src);
  if (isBrokenImagePath(src)) {
    return CATALOG_FALLBACK_IMAGE;
  }
  return getAssetPath(src);
}

function renderCatalogItem(item, categoryKey, itemIndex) {
  var imgSrc = getCatalogImage(item, categoryKey, itemIndex);
  var itemName = escapeHtml(item && item.name ? item.name : 'Untitled product');
  var itemDesc = escapeHtml(item && item.desc ? item.desc : '');

  return (
    '<div class="catalog-item">' +
      '<img src="' + imgSrc + '" alt="' + itemName + '" loading="lazy" />' +
      '<div class="catalog-item-body">' +
        '<h4>' + itemName + '</h4>' +
        '<p>' + itemDesc + '</p>' +
        (item && item.stock
          ? '<span class="catalog-stock">✅ In Stock</span>'
          : '<span class="catalog-stock" style="color:#a15c00;background:rgba(245,197,24,0.18);">📞 Enquire</span>') +
      '</div>' +
    '</div>'
  );
}

function scanCatalogImageIssues(catalog) {
  var issues = [];
  Object.keys(catalog || {}).forEach(function (categoryKey) {
    var category = catalog[categoryKey] || {};
    (category.items || []).forEach(function (item, itemIndex) {
      var src = item && (item.img || item.image || item.src);
      if (isBrokenImagePath(src)) {
        issues.push({
          category: categoryKey,
          index: itemIndex,
          name: item && item.name,
          src: src || null
        });
      }
    });
  });
  return issues;
}

normalizeCatalogImages(CATALOG);
var catalogImageIssues = scanCatalogImageIssues(CATALOG);
window.catalogImageIssues = catalogImageIssues;
if (catalogImageIssues.length && typeof console !== 'undefined' && console.warn) {
  console.warn('JK Sports catalog image issues detected', catalogImageIssues);
}

var CATALOG_SOURCE_URL = 'catalog.json?v=20261108';

function refreshCatalogIssues() {
  catalogImageIssues = scanCatalogImageIssues(CATALOG);
  window.catalogImageIssues = catalogImageIssues;
  if (catalogImageIssues.length && typeof console !== 'undefined' && console.warn) {
    console.warn('JK Sports catalog image issues detected', catalogImageIssues);
  }
}

function loadCatalogFromJson() {
  if (typeof fetch !== 'function') return;

  fetch(CATALOG_SOURCE_URL, { cache: 'no-store' })
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Failed to load catalog.json: ' + response.status);
      }
      return response.json();
    })
    .then(function (data) {
      if (data && typeof data === 'object') {
        CATALOG = data;
        normalizeCatalogImages(CATALOG);
        refreshCatalogIssues();
      }
    })
    .catch(function (error) {
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('Falling back to embedded catalog data', error);
      }
    });
}

loadCatalogFromJson();

function openCatalog(key) {
  var c = CATALOG[key];
  if (!c) return;

  var titleEl = document.getElementById('catalogTitle');
  var tagEl   = document.getElementById('catalogTag');
  var descEl  = document.getElementById('catalogDesc');
  var itemsEl = document.getElementById('catalogItems');
  var noteEl  = document.getElementById('catalogNote');
  var modalEl = document.getElementById('catalogModal');

  if (titleEl) titleEl.textContent = c.title;
  if (tagEl)   tagEl.textContent   = c.tag;
  if (descEl)  descEl.textContent  = c.desc;

  if (noteEl) {
    if (c.note) {
      noteEl.textContent = c.note;
      noteEl.hidden = false;
    } else {
      noteEl.textContent = '';
      noteEl.hidden = true;
    }
  }

  if (itemsEl) {
    itemsEl.innerHTML = c.items.map(function (item, itemIndex) {
      return renderCatalogItem(item, key, itemIndex);
    }).join('');
  }

  if (modalEl) {
    modalEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}
window.openCatalog = openCatalog;

function closeModal() {
  var modalEl = document.getElementById('catalogModal');
  if (modalEl) {
    modalEl.classList.remove('open');
    document.body.style.overflow = '';
  }
}
window.closeModal = closeModal;

/* close on backdrop click */
var catalogModalEl = document.getElementById('catalogModal');
if (catalogModalEl) {
  catalogModalEl.addEventListener('click', function (e) {
    if (e.target === this) closeModal();
  });
}

var catalogCloseBtn = document.getElementById('catalogCloseBtn');
if (catalogCloseBtn) catalogCloseBtn.addEventListener('click', closeModal);

var catalogStoreCTA = document.getElementById('catalogStoreCTA');
if (catalogStoreCTA) catalogStoreCTA.addEventListener('click', closeModal);

/* keyboard accessibility for role="button" cards */
document.querySelectorAll('[role="button"]').forEach(function (el) {
  el.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
  });
});

/* ════════════════════════════════════════
   ORDER ZONE — PRODUCTS & CART & CHECKOUT & ADMIN
════════════════════════════════════════ */
var ORDER_PRODUCTS = [
  /* ── JK Sports signature products ── */
  {
    id: 'turf-bats',
    name: 'Sri Lunken Turf Bats',
    price: 2500,
    img: 'assets/srilunken-turf-bat.webp',
    gallery: [
      'assets/products/srilunken_turf_cricket_bats/front.png',
      'assets/products/srilunken_turf_cricket_bats/side.png',
      'assets/products/srilunken_turf_cricket_bats/back.png'
    ],
    desc: 'Premium Ceylon willow, perfect for turf wicket matches',
    badge: 'BESTSELLER'
  },
  {
    id: 'kids-bats',
    name: 'Kids Plastic Bats',
    price: 450,
    img: 'assets/kids-plastic-bats.webp',
    gallery: [
      'assets/products/vinex_cricket_set/front.png',
      'assets/products/vinex_cricket_set/side.png',
      'assets/products/vinex_cricket_set/back.png'
    ],
    desc: 'Durable plastic bats for young cricketers',
    badge: 'FOR KIDS'
  },
  {
    id: 'sublimation-jersey',
    name: 'Sublimation Jercy',
    price: 800,
    img: 'assets/photo-1773355579207-4bc7a0915e74.jpg',
    desc: 'Custom sublimation printed jerseys for teams',
    badge: 'CUSTOM'
  },

  /* ── Badminton ── */
  {
    id: 'yonex-badminton-racket',
    name: 'Yonex Badminton Racket',
    price: 3500,
    img: 'assets/yonex_badminton_racket.webp',
    gallery: [
      'assets/products/yonex_badminton_racket/front.png',
      'assets/products/yonex_badminton_racket/side.png',
      'assets/products/yonex_badminton_racket/back.png'
    ],
    desc: 'Yonex racket for club and tournament play',
    badge: 'BADMINTON'
  },
  {
    id: 'hycourt-court-shoes',
    name: 'HyCourt Neon Yellow Court Shoes',
    price: 2200,
    img: 'assets/hycourt_neon_yellow_court_shoes.webp',
    gallery: [
      'assets/products/yellow_sports_shoes/front.png',
      'assets/products/yellow_sports_shoes/side.png',
      'assets/products/yellow_sports_shoes/back.png'
    ],
    desc: 'Non-marking court shoes for badminton and indoor play',
    badge: 'BADMINTON'
  },

  /* ── Football ── */
  {
    id: 'nivia-football',
    name: 'Nivia Football',
    price: 900,
    img: 'assets/nivia_football.webp',
    gallery: [
      'assets/products/nivia_football/front.png',
      'assets/products/nivia_football/side.png',
      'assets/products/nivia_football/back.png'
    ],
    desc: 'Match-ready Nivia football for training and games',
    badge: 'FOOTBALL'
  },
  {
    id: 'nivia-blue-football-boots',
    name: 'Nivia Blue Football Boots',
    price: 1600,
    img: 'assets/nivia_blue_football_boots.webp',
    gallery: [
      'assets/products/blue_football_shoes/front.png',
      'assets/products/blue_football_shoes/side.png',
      'assets/products/blue_football_shoes/back.png'
    ],
    desc: 'Firm-ground football boots with a secure fit',
    badge: 'FOOTBALL'
  },
  {
    id: 'mayor-club-shin-guards',
    name: 'Mayor Club Shin Guards',
    price: 450,
    img: 'assets/mayor_club_shin_guards.webp',
    gallery: [
      'assets/products/mayor_shin_guards/front.png',
      'assets/products/mayor_shin_guards/side.png',
      'assets/products/mayor_shin_guards/back.png'
    ],
    desc: 'Lightweight shin guards for club players',
    badge: 'FOOTBALL'
  },
  {
    id: 'red-captain-shin-guards',
    name: 'Red Captain Shin Guards',
    price: 400,
    img: 'assets/red_captain_shin_guards.webp',
    gallery: [
      'assets/products/captain_shin_guards/front.png',
      'assets/products/captain_shin_guards/side.png',
      'assets/products/captain_shin_guards/back.png'
    ],
    desc: 'Protective shin guards for match play',
    badge: 'FOOTBALL'
  },
  {
    id: 'nivia-carbonite-goalkeeper-gloves',
    name: 'Nivia Carbonite Goalkeeper Gloves',
    price: 1400,
    img: 'assets/nivia_carbonite_goalkeeper_gloves.webp',
    gallery: [
      'assets/products/nivia_goalkeeper_gloves/front.png',
      'assets/products/nivia_goalkeeper_gloves/side.png',
      'assets/products/nivia_goalkeeper_gloves/back.png'
    ],
    desc: 'Carbonite range with reinforced palm grip',
    badge: 'FOOTBALL'
  },

  /* ── Basketball / Volleyball ── */
  {
    id: 'nivia-europa-basketball',
    name: 'Nivia Europa Basketball',
    price: 1300,
    img: 'assets/nivia_europa_basketball.webp',
    gallery: [
      'assets/products/nivia_europa_basketball/front.png',
      'assets/products/nivia_europa_basketball/side.png',
      'assets/products/nivia_europa_basketball/back.png'
    ],
    desc: 'Durable basketball for indoor and outdoor courts',
    badge: 'BASKETBALL'
  },
  {
    id: 'nivia-volleyball',
    name: 'Nivia White & Green Volleyball',
    price: 800,
    img: 'assets/nivia_white_green_ball.webp',
    gallery: [
      'assets/products/nivia_volleyball/front.png',
      'assets/products/nivia_volleyball/side.png',
      'assets/products/nivia_volleyball/back.png'
    ],
    desc: 'Match volleyball with a soft, grippy cover',
    badge: 'VOLLEYBALL'
  },

  /* ── Tennis ── */
  {
    id: 'head-tennis-racket',
    name: 'Head Ti. Instinct Comp Tennis Racket',
    price: 4500,
    img: 'assets/head_ti_instinct_comp_tennis_racket.webp',
    gallery: [
      'assets/products/head_tennis_racket/front.png',
      'assets/products/head_tennis_racket/side.png',
      'assets/products/head_tennis_racket/back.png'
    ],
    desc: 'Head titanium tennis racket for all-court play',
    badge: 'TENNIS'
  },
  {
    id: 'wilson-tennis-balls',
    name: 'Wilson Tour Premier Tennis Balls',
    price: 450,
    img: 'assets/wilson_tour_premier_tennis_balls.webp',
    gallery: [
      'assets/products/wilson_tennis_balls/front.png',
      'assets/products/wilson_tennis_balls/side.png',
      'assets/products/wilson_tennis_balls/back.png'
    ],
    desc: 'Tournament-grade tennis balls',
    badge: 'TENNIS'
  },

  /* ── Trophies ── */
  {
    id: 'golden-football-boot-trophy',
    name: 'Golden Football Boot Trophy',
    price: 2500,
    img: 'assets/golden_football_boot_trophy.webp',
    gallery: [
      'assets/products/gold_football_trophy/front.png',
      'assets/products/gold_football_trophy/side.png',
      'assets/products/gold_football_trophy/back.png'
    ],
    desc: 'Golden boot award trophy for tournaments',
    badge: 'TROPHY'
  },
  {
    id: 'trophy-collection-display',
    name: 'Trophy Collection Display',
    price: 5000,
    img: 'assets/trophy_collection_display.webp',
    gallery: [
      'assets/products/trophy_collection/front.png',
      'assets/products/trophy_collection/side.png',
      'assets/products/trophy_collection/back.png'
    ],
    desc: 'Trophies and awards for tournaments and events',
    badge: 'TROPHY'
  }
];

var STORE_WHATSAPP = '919786722444';
var CART_KEY = 'jk_sports_cart';
var ORDERS_KEY = 'jk_sports_orders';
var ADMIN_PASSWORD = 'jkadmin123';

/* ── RENDER ORDER PRODUCTS ── */
function renderOrderProducts() {
  var grid = document.getElementById('orderGrid');
  if (!grid) return;
  grid.innerHTML = ORDER_PRODUCTS.map(function (p) {
    var hasGallery = Array.isArray(p.gallery) && p.gallery.length > 1;
    return (
      '<div class="order-card">' +
        '<div class="order-img-wrap' + (hasGallery ? ' has-gallery' : '') + '"' +
          (hasGallery
            ? ' role="button" tabindex="0" data-gallery-id="' + p.id + '"' +
              ' aria-label="View all angles of ' + escapeHtml(p.name) + '"'
            : '') +
        '>' +
          '<img src="' + p.img + '" alt="' + escapeHtml(p.name) + '" loading="lazy" decoding="async" />' +
          (p.badge ? '<span class="order-badge">' + p.badge + '</span>' : '') +
          (hasGallery
            ? '<span class="order-views-badge">' +
                '<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                  '<circle cx="12" cy="12" r="3.2"></circle>' +
                  '<path d="M2.5 12s3.6-6.5 9.5-6.5S21.5 12 21.5 12s-3.6 6.5-9.5 6.5S2.5 12 2.5 12z"></path>' +
                '</svg>' +
                p.gallery.length + ' Views' +
              '</span>'
            : '') +
        '</div>' +
        '<div class="order-info">' +
          '<h4>' + escapeHtml(p.name) + '</h4>' +
          '<p class="order-price">₹' + p.price.toLocaleString('en-IN') + '</p>' +
          '<p class="order-desc-text">' + escapeHtml(p.desc) + '</p>' +
          '<div class="order-actions">' +
            '<button class="btn-add-cart" data-id="' + p.id + '">Add to Cart</button>' +
            '<button class="btn-buy-now" data-id="' + p.id + '">Buy Now</button>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }).join('');
}

/* ── PRODUCT 3-VIEW GALLERY ── */
var GALLERY_LABELS = ['Front view', 'Side view', 'Back view'];
var galleryProduct = null;
var galleryIndex = 0;

function findOrderProduct(id) {
  return ORDER_PRODUCTS.find(function (p) { return p.id === id; });
}

function openGallery(productId) {
  var p = findOrderProduct(productId);
  if (!p || !Array.isArray(p.gallery) || !p.gallery.length) return;

  galleryProduct = p;
  galleryIndex = 0;

  var titleEl = document.getElementById('galleryTitle');
  var priceEl = document.getElementById('galleryPrice');
  var thumbsEl = document.getElementById('galleryThumbs');
  var modalEl = document.getElementById('galleryModal');

  if (titleEl) titleEl.textContent = p.name;
  if (priceEl) priceEl.textContent = '₹' + p.price.toLocaleString('en-IN');

  if (thumbsEl) {
    thumbsEl.innerHTML = p.gallery.map(function (src, i) {
      return '<button type="button" class="gallery-thumb" data-index="' + i + '" aria-label="' +
        (GALLERY_LABELS[i] || 'View ' + (i + 1)) + '">' +
        '<img src="' + src + '" alt="" loading="lazy" decoding="async" />' +
      '</button>';
    }).join('');
  }

  updateGalleryView();

  if (modalEl) {
    modalEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function updateGalleryView() {
  if (!galleryProduct) return;

  var mainEl = document.getElementById('galleryMain');
  var labelEl = document.getElementById('galleryViewLabel');
  var prevBtn = document.getElementById('galleryPrev');
  var nextBtn = document.getElementById('galleryNext');
  var thumbs = document.querySelectorAll('#galleryThumbs .gallery-thumb');
  var total = galleryProduct.gallery.length;

  if (mainEl) {
    mainEl.src = galleryProduct.gallery[galleryIndex];
    mainEl.alt = galleryProduct.name + ' — ' + (GALLERY_LABELS[galleryIndex] || 'View ' + (galleryIndex + 1));
  }
  if (labelEl) {
    labelEl.textContent = (GALLERY_LABELS[galleryIndex] || 'View ' + (galleryIndex + 1)) +
      ' · ' + (galleryIndex + 1) + '/' + total;
  }
  if (prevBtn) prevBtn.disabled = galleryIndex === 0;
  if (nextBtn) nextBtn.disabled = galleryIndex === total - 1;

  thumbs.forEach(function (btn, i) {
    btn.classList.toggle('active', i === galleryIndex);
  });
}

function stepGallery(delta) {
  if (!galleryProduct) return;
  var total = galleryProduct.gallery.length;
  galleryIndex = (galleryIndex + delta + total) % total;
  updateGalleryView();
}

function closeGallery() {
  var modalEl = document.getElementById('galleryModal');
  if (modalEl) modalEl.classList.remove('open');
  document.body.style.overflow = '';
  galleryProduct = null;
}
window.openGallery = openGallery;
window.closeGallery = closeGallery;

/* ── CART STATE ── */
function getCart() {
  try {
    var data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  var cart = getCart();
  var count = cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
  var el = document.getElementById('cartCount');
  if (el) el.textContent = count;
}

function addToCart(productId) {
  var product = ORDER_PRODUCTS.find(function (p) { return p.id === productId; });
  if (!product) return;

  var cart = getCart();
  var existing = cart.find(function (item) { return item.id === productId; });
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      qty: 1
    });
  }
  saveCart(cart);
  openCartDrawer();
}

function removeFromCart(productId) {
  var cart = getCart().filter(function (item) { return item.id !== productId; });
  saveCart(cart);
  renderCartItems();
}

function updateQty(productId, delta) {
  var cart = getCart();
  var item = cart.find(function (i) { return i.id === productId; });
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(function (i) { return i.id !== productId; });
  }
  saveCart(cart);
  renderCartItems();
}

function getCartTotal() {
  return getCart().reduce(function (sum, item) { return sum + item.price * item.qty; }, 0);
}

/* ── CART DRAWER ── */
function openCartDrawer() {
  renderCartItems();
  var drawer = document.getElementById('cartDrawer');
  var overlay = document.getElementById('cartOverlay');
  if (drawer) drawer.classList.add('open');
  if (overlay) overlay.classList.add('open');
}

function closeCartDrawer() {
  var drawer = document.getElementById('cartDrawer');
  var overlay = document.getElementById('cartOverlay');
  if (drawer) drawer.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
}

function renderCartItems() {
  var container = document.getElementById('cartItems');
  var emptyMsg = document.getElementById('cartEmpty');
  var cart = getCart();

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
    var totalEl = document.getElementById('cartTotal');
    if (totalEl) totalEl.textContent = '₹0';
    return;
  }

  container.innerHTML = cart.map(function (item) {
    return (
      '<div class="cart-item">' +
        '<img src="' + item.img + '" alt="' + escapeHtml(item.name) + '" class="cart-item-img" />' +
        '<div class="cart-item-info">' +
          '<div class="cart-item-name">' + escapeHtml(item.name) + '</div>' +
          '<div class="cart-item-price">₹' + item.price.toLocaleString('en-IN') + ' each</div>' +
          '<div class="cart-item-qty">' +
            '<button class="qty-btn" onclick="updateQty(\'' + item.id + '\', -1)">−</button>' +
            '<span>' + item.qty + '</span>' +
            '<button class="qty-btn" onclick="updateQty(\'' + item.id + '\', 1)">+</button>' +
          '</div>' +
        '</div>' +
        '<button class="cart-item-remove" onclick="removeFromCart(\'' + item.id + '\')" aria-label="Remove">&times;</button>' +
      '</div>'
    );
  }).join('');

  var totalEl = document.getElementById('cartTotal');
  if (totalEl) totalEl.textContent = '₹' + getCartTotal().toLocaleString('en-IN');
}

/* ── WHATSAPP ORDER ── */
function buildWhatsAppMessage(cartItems, customerInfo) {
  var lines = ['Hello JK Sports! I want to place an order:\n'];
  var total = 0;
  cartItems.forEach(function (item, i) {
    var lineTotal = item.price * item.qty;
    total += lineTotal;
    lines.push((i + 1) + '. ' + item.name + ' — ₹' + item.price.toLocaleString('en-IN') + ' x ' + item.qty + ' = ₹' + lineTotal.toLocaleString('en-IN'));
  });
  lines.push('\nTotal: ₹' + total.toLocaleString('en-IN'));
  if (customerInfo) {
    if (customerInfo.name) lines.push('Name: ' + customerInfo.name);
    if (customerInfo.phone) lines.push('Phone: ' + customerInfo.phone);
    if (customerInfo.address) lines.push('Address: ' + customerInfo.address);
  }
  return lines.join('\n');
}

function openWhatsApp(message) {
  var url = 'https://wa.me/' + STORE_WHATSAPP + '?text=' + encodeURIComponent(message);
  window.open(url, '_blank');
}

/* ── BUY NOW (single product to WhatsApp) ── */
function buyNow(productId) {
  var product = ORDER_PRODUCTS.find(function (p) { return p.id === productId; });
  if (!product) return;
  var message = buildWhatsAppMessage([{ name: product.name, price: product.price, qty: 1 }], null);
  openWhatsApp(message);
}

/* ── CHECKOUT ── */
function openCheckout() {
  var cart = getCart();
  if (cart.length === 0) {
    alert('Your cart is empty. Add some products first.');
    return;
  }
  closeCartDrawer();

  var summaryItems = document.getElementById('orderSummaryItems');
  var summaryTotal = document.getElementById('orderSummaryTotal');
  if (summaryItems) {
    summaryItems.innerHTML = cart.map(function (item) {
      return (
        '<div class="order-summary-item">' +
          '<span>' + escapeHtml(item.name) + ' x' + item.qty + '</span>' +
          '<span>₹' + (item.price * item.qty).toLocaleString('en-IN') + '</span>' +
        '</div>'
      );
    }).join('');
  }
  if (summaryTotal) {
    summaryTotal.textContent = '₹' + getCartTotal().toLocaleString('en-IN');
  }

  var modal = document.getElementById('checkoutModal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeCheckout() {
  var modal = document.getElementById('checkoutModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function placeOrder(e) {
  if (e) e.preventDefault();
  var cart = getCart();
  if (cart.length === 0) return;

  var name = document.getElementById('custName').value.trim();
  var phone = document.getElementById('custPhone').value.trim();
  var address = document.getElementById('custAddress').value.trim();

  if (!name || !phone) {
    alert('Please enter your name and phone number.');
    return;
  }

  var customerInfo = { name: name, phone: phone, address: address };
  var message = buildWhatsAppMessage(cart, customerInfo);

  /* Save order to localStorage for admin */
  var orders = getOrders();
  var order = {
    id: 'ORD-' + Date.now().toString(36).toUpperCase(),
    date: new Date().toISOString(),
    items: cart.map(function (item) {
      return { name: item.name, price: item.price, qty: item.qty };
    }),
    total: getCartTotal(),
    customer: customerInfo,
    status: 'pending'
  };
  orders.unshift(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

  /* Clear cart and open WhatsApp */
  saveCart([]);
  closeCheckout();
  openWhatsApp(message);
}

/* ── ADMIN ORDER MANAGEMENT ── */
function getOrders() {
  try {
    var data = localStorage.getItem(ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function renderAdminOrders() {
  var container = document.getElementById('adminOrders');
  if (!container) return;
  var orders = getOrders();

  if (orders.length === 0) {
    container.innerHTML = '<div class="admin-empty">No orders yet</div>';
    return;
  }

  container.innerHTML = orders.map(function (order) {
    var date = new Date(order.date);
    var dateStr = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ' ' + date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    return (
      '<div class="admin-order-card" data-order-id="' + order.id + '">' +
        '<div class="admin-order-header">' +
          '<div>' +
            '<span class="admin-order-id">' + order.id + '</span> ' +
            '<span class="admin-order-date">' + dateStr + '</span>' +
          '</div>' +
          '<span class="admin-order-status ' + order.status + '">' + order.status + '</span>' +
        '</div>' +
        '<div class="admin-order-items">' +
          order.items.map(function (item) {
            return (
              '<div class="admin-order-item">' +
                '<span>' + escapeHtml(item.name) + ' x' + item.qty + '</span>' +
                '<span>₹' + (item.price * item.qty).toLocaleString('en-IN') + '</span>' +
              '</div>'
            );
          }).join('') +
        '</div>' +
        '<div class="admin-order-total">Total: ₹' + order.total.toLocaleString('en-IN') + '</div>' +
        '<div class="admin-order-customer">' +
          '<strong>Customer:</strong> ' + escapeHtml(order.customer.name) +
          ' | <strong>Phone:</strong> ' + escapeHtml(order.customer.phone) +
          (order.customer.address ? ' | <strong>Address:</strong> ' + escapeHtml(order.customer.address) : '') +
        '</div>' +
        '<div class="admin-order-actions">' +
          (order.status === 'pending' ? '<button class="admin-btn-confirm" onclick="updateOrderStatus(\'' + order.id + '\', \'confirmed\')">Confirm</button>' : '') +
          (order.status === 'confirmed' ? '<button class="admin-btn-deliver" onclick="updateOrderStatus(\'' + order.id + '\', \'delivered\')">Mark Delivered</button>' : '') +
          '<button class="admin-btn-delete" onclick="deleteOrder(\'' + order.id + '\')">Delete</button>' +
        '</div>' +
      '</div>'
    );
  }).join('');
}

function updateOrderStatus(orderId, status) {
  var orders = getOrders();
  var order = orders.find(function (o) { return o.id === orderId; });
  if (order) {
    order.status = status;
    saveOrders(orders);
    renderAdminOrders();
  }
}

function deleteOrder(orderId) {
  if (!confirm('Delete this order?')) return;
  var orders = getOrders().filter(function (o) { return o.id !== orderId; });
  saveOrders(orders);
  renderAdminOrders();
}

/* ── ADMIN ACCESS ── */
function checkAdminAccess() {
  var hash = window.location.hash;
  if (hash === '#admin') {
    var entered = prompt('Enter admin password:');
    if (entered === ADMIN_PASSWORD) {
      document.getElementById('adminSection').style.display = 'block';
      document.getElementById('hero').style.display = 'none';
      document.querySelector('header').style.display = 'none';
      document.querySelector('footer').style.display = 'none';
      /* Hide all other sections */
      document.querySelectorAll('section:not(#adminSection)').forEach(function (s) {
        s.style.display = 'none';
      });
      renderAdminOrders();
      window.scrollTo(0, 0);
    } else {
      alert('Wrong password');
      window.location.hash = '';
    }
  }
}

/* ── EVENT LISTENERS ── */
document.addEventListener('DOMContentLoaded', function () {
  renderOrderProducts();
  updateCartCount();

  /* Cart button */
  var cartBtn = document.getElementById('cartBtn');
  if (cartBtn) cartBtn.addEventListener('click', openCartDrawer);

  var cartCloseBtn = document.getElementById('cartCloseBtn');
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCartDrawer);

  var cartOverlay = document.getElementById('cartOverlay');
  if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);

  /* Checkout */
  var checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckout);

  var checkoutCloseBtn = document.getElementById('checkoutCloseBtn');
  if (checkoutCloseBtn) checkoutCloseBtn.addEventListener('click', closeCheckout);

  var checkoutModal = document.getElementById('checkoutModal');
  if (checkoutModal) {
    checkoutModal.addEventListener('click', function (e) {
      if (e.target === this) closeCheckout();
    });
  }

  var checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) checkoutForm.addEventListener('submit', placeOrder);

  /* Order Zone button clicks (event delegation) */
  var orderGrid = document.getElementById('orderGrid');
  if (orderGrid) {
    orderGrid.addEventListener('click', function (e) {
      var addBtn = e.target.closest('.btn-add-cart');
      var buyBtn = e.target.closest('.btn-buy-now');
      var galleryEl = e.target.closest('[data-gallery-id]');
      if (addBtn) {
        addToCart(addBtn.dataset.id);
      } else if (buyBtn) {
        buyNow(buyBtn.dataset.id);
      } else if (galleryEl) {
        openGallery(galleryEl.dataset.galleryId);
      }
    });

    orderGrid.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var galleryEl = e.target.closest('[data-gallery-id]');
      if (!galleryEl) return;
      e.preventDefault();
      openGallery(galleryEl.dataset.galleryId);
    });
  }

  /* 3-view gallery controls */
  var galleryModal = document.getElementById('galleryModal');
  if (galleryModal) {
    galleryModal.addEventListener('click', function (e) {
      if (e.target === this) closeGallery();
    });
  }
  var galleryCloseBtn = document.getElementById('galleryCloseBtn');
  if (galleryCloseBtn) galleryCloseBtn.addEventListener('click', closeGallery);

  var galleryPrev = document.getElementById('galleryPrev');
  if (galleryPrev) galleryPrev.addEventListener('click', function () { stepGallery(-1); });

  var galleryNext = document.getElementById('galleryNext');
  if (galleryNext) galleryNext.addEventListener('click', function () { stepGallery(1); });

  var galleryThumbs = document.getElementById('galleryThumbs');
  if (galleryThumbs) {
    galleryThumbs.addEventListener('click', function (e) {
      var thumb = e.target.closest('.gallery-thumb');
      if (!thumb) return;
      galleryIndex = parseInt(thumb.dataset.index, 10) || 0;
      updateGalleryView();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!galleryProduct) return;
    if (e.key === 'Escape') {
      closeGallery();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      stepGallery(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      stepGallery(1);
    }
  });

  /* Admin access check */
  checkAdminAccess();
  window.addEventListener('hashchange', checkAdminAccess);
});
