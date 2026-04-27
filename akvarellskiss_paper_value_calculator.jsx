<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Watercolor Paper Value Tool</title>

<style>
body{
  margin:0;
  font-family: Arial, sans-serif;
  background:#f6f3ef;
  color:#1f1f1f;
}
header{
  padding:18px;
  background:#fff;
  border-bottom:1px solid #e7e2dc;
}
h1{font-size:18px;margin:0}
.sub{font-size:12px;opacity:.7;margin-top:4px}
.container{max-width:900px;margin:auto;padding:16px}
.card{
  background:#fff;
  border-radius:12px;
  padding:12px;
  margin-bottom:10px;
  box-shadow:0 2px 8px rgba(0,0,0,0.06);
}
label{font-size:12px;opacity:.7;display:block;margin-top:8px}
select,input{width:100%;padding:8px;margin-top:4px;border:1px solid #ddd;border-radius:8px}
button{margin-top:10px;padding:8px 12px;background:#1f1f1f;color:#fff;border:none;border-radius:8px;cursor:pointer}
button:hover{opacity:0.9}
.badge{font-size:11px;padding:3px 8px;border-radius:20px;margin-left:8px}
.best{background:#d7f5dd}
.ok{background:#fff6d6}
.expensive{background:#ffe0e0}
.small{font-size:12px;opacity:.7}
.section-title{margin-top:18px;font-size:14px;font-weight:bold}
</style>
</head>

<body>

<header>
  <h1>Watercolor Paper Value Tool</h1>
  <div class="sub">Compare real cost per usable A4 surface (global dataset)</div>
</header>

<div class="container">

<div class="card">
  <strong>Filters</strong>

  <label>Surface</label>
  <select id="surface">
    <option value="all">All</option>
    <option value="cold">Cold Press</option>
    <option value="hot">Hot Press</option>
    <option value="rough">Rough</option>
  </select>

  <label>Material</label>
  <select id="material">
    <option value="all">All</option>
    <option value="cotton">100% Cotton</option>
    <option value="cellulose">Cellulose</option>
  </select>

  <label>Store</label>
  <select id="storeFilter"></select>
</div>

<div class="card">
  <strong>Add store (saved in browser)</strong>

  <input id="name" placeholder="Store name"/>
  <input id="city" placeholder="City"/>
  <input id="country" placeholder="Country"/>
  <input id="currency" placeholder="Currency (SEK/USD/EUR/GBP)"/>

  <button onclick="addStore()">Add store</button>
</div>

<div class="card">
  <div class="section-title">Stores</div>
  <div id="stores"></div>
</div>

<div class="card">
  <div class="section-title">Best deals per paper</div>
  <div id="bestDeals"></div>
</div>

<div class="card">
  <div class="section-title">Top 3 cheapest offers</div>
  <div id="topOffers"></div>
</div>

<h2 style="font-size:16px;">All offers</h2>
<div id="offers"></div>

</div>

<script>

const A4 = 210 * 297;

// ---------------- INITIAL DATA (NO EXTERNAL FILES) ----------------
let stores = [
  {id:"ib",name:"IB Wahlström",city:"Stockholm",country:"SE",currency:"SEK"},
  {id:"kreatima",name:"Kreatima",city:"Stockholm",country:"SE",currency:"SEK"},
  {id:"kck",name:"KCK",city:"Stockholm",country:"SE",currency:"SEK"},
  {id:"jordi",name:"Jordi",city:"Stockholm",country:"SE",currency:"SEK"},
  {id:"blick",name:"Blick Art",city:"Zurich",country:"CH",currency:"CHF"},
  {id:"dickblick",name:"Dick Blick",city:"USA",country:"US",currency:"USD"}
];

let products = [
  {id:"arches_cold_300",brand:"Arches",name:"Cold Press 300gsm",material:"cotton",surface:"cold"},
  {id:"canson_xl_300",brand:"Canson",name:"XL Watercolor 300gsm",material:"cellulose",surface:"cold"},
  {id:"fabriano_artistico",brand:"Fabriano",name:"Artistico 300gsm",material:"cotton",surface:"hot"}
];

let offers = [
  {productId:"arches_cold_300",storeId:"kreatima",width:300,height:400,sheets:20,price:899,efficiency:0.95},
  {productId:"arches_cold_300",storeId:"ib",width:300,height:400,sheets:20,price:945,efficiency:0.95},
  {productId:"canson_xl_300",storeId:"ib",width:210,height:297,sheets:30,price:249,efficiency:0.95},
  {productId:"fabriano_artistico",storeId:"kck",width:300,height:400,sheets:10,price:420,efficiency:0.95}
];

// ---------------- LOAD LOCAL STORAGE ADDED STORES ----------------
function loadLocalStores(){
  const saved = localStorage.getItem("userStores");
  if(saved){
    stores = stores.concat(JSON.parse(saved));
  }
}

function saveLocalStores(){
  const systemStores = stores.filter(s => s.system !== true);
  localStorage.setItem("userStores", JSON.stringify(systemStores));
}

// ---------------- CALC ----------------
function calc(o){
  const area = o.width * o.height;
  const total = area * o.sheets * o.efficiency;
  const a4 = total / A4;
  return {...o,a4,pricePerA4:o.price/a4};
}

// ---------------- BUILD DATASET ----------------
function build(){
  return offers.map(o => {
    const product = products.find(p => p.id === o.productId);
    const store = stores.find(s => s.id === o.storeId);
    const enriched = calc(o);
    return {...enriched, product, store};
  });
}

// ---------------- FILTER ----------------
function filter(data){
  const sf=document.getElementById("surface").value;
  const mf=document.getElementById("material").value;
  const st=document.getElementById("storeFilter").value;

  return data
    .filter(d=>sf==="all"||d.product?.surface===sf)
    .filter(d=>mf==="all"||d.product?.material===mf)
    .filter(d=>st==="all"||d.storeId===st);
}

// ---------------- RENDER ----------------
function renderStores(){
  const sel=document.getElementById("storeFilter");
  sel.innerHTML='<option value="all">All stores</option>';

  document.getElementById("stores").innerHTML = stores
    .map(s=>`<div>${s.name} (${s.city}, ${s.country})</div>`)
    .join("");

  stores.forEach(s=>{
    sel.innerHTML+=`<option value="${s.id}">${s.name}</option>`;
  });
}

function renderAll(){
  const full = build();
  const data = filter(full);

  // OFFERS
  document.getElementById("offers").innerHTML = data.map(d=>`
    <div class="card">
      <strong>${d.product?.brand} ${d.product?.name}</strong>
      <div class="small">${d.store?.name}</div>
      <div>Price: ${d.price} ${d.store?.currency}</div>
      <div><strong>${d.pricePerA4.toFixed(2)} per A4</strong></div>
    </div>
  `).join("");

  // BEST PER PRODUCT
  const best = {};
  data.forEach(d=>{
    if(!best[d.productId] || d.pricePerA4 < best[d.productId].pricePerA4){
      best[d.productId]=d;
    }
  });

  document.getElementById("bestDeals").innerHTML = Object.values(best)
    .map(d=>`
      <div class="card">
        <strong>${d.product?.brand} ${d.product?.name}</strong>
        <div class="small">Best: ${d.store?.name}</div>
        <div><strong>${d.pricePerA4.toFixed(2)}</strong></div>
      </div>
    `).join("");

  // TOP 3
  const top=[...data].sort((a,b)=>a.pricePerA4-b.pricePerA4).slice(0,3);
  document.getElementById("topOffers").innerHTML = top
    .map(d=>`<div>${d.product?.name} – ${d.store?.name} – ${d.pricePerA4.toFixed(2)}</div>`)
    .join("");

  renderStores();
}

// ---------------- ADD STORE ----------------
function addStore(){
  const s={
    id:document.getElementById("name").value.toLowerCase().replace(/\s/g,"_"),
    name:document.getElementById("name").value,
    city:document.getElementById("city").value,
    country:document.getElementById("country").value,
    currency:document.getElementById("currency").value,
    system:false
  };

  stores.push(s);
  saveLocalStores();
  renderAll();
}

// ---------------- EVENTS ----------------

document.querySelectorAll("select").forEach(s=>
  s.addEventListener("change",renderAll)
);

// ---------------- INIT ----------------
loadLocalStores();
renderAll();

</script>

</body>
</html>
