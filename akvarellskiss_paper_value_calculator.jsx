<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Akvarellskiss Paper Value Tool</title>

<style>
body{
  font-family: Arial, sans-serif;
  margin:0;
  background:#f6f3ef;
  color:#1f1f1f;
}
header{
  padding:18px 20px;
  background:#ffffff;
  border-bottom:1px solid #e7e2dc;
}
h1{font-size:18px;margin:0}
.sub{font-size:12px;opacity:.7;margin-top:4px}

.container{
  padding:16px;
  max-width:900px;
  margin:auto;
}

.card{
  background:#fff;
  border-radius:12px;
  padding:12px;
  margin-bottom:10px;
  box-shadow:0 2px 8px rgba(0,0,0,0.06);
}

.grid{
  display:grid;
  grid-template-columns:1fr;
  gap:10px;
}

label{font-size:12px;opacity:.8;display:block;margin-top:6px}

input,select{
  width:100%;
  padding:8px;
  border:1px solid #ddd;
  border-radius:8px;
  margin-top:4px;
  background:#fff;
}

button{
  margin-top:10px;
  padding:8px 12px;
  border:none;
  border-radius:8px;
  background:#1f1f1f;
  color:#fff;
  cursor:pointer;
}

button:hover{opacity:.9}

.badge{
  display:inline-block;
  font-size:11px;
  padding:3px 8px;
  border-radius:20px;
  background:#eee;
  margin-left:6px;
}

.value-best{background:#d7f5dd}
.value-ok{background:#fff6d6}
.value-expensive{background:#ffe0e0}

.small{font-size:12px;opacity:.7}

</style>
</head>

<body>

<header>
  <h1>Akvarellskiss Paper Value Tool</h1>
  <div class="sub">Compare watercolor paper in real cost per usable A4 surface</div>
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
  <select id="storeFilter">
    <option value="all">All stores</option>
  </select>
</div>

<div class="card">
  <strong>Add your store</strong>

  <input id="name" placeholder="Store name"/>
  <input id="city" placeholder="City"/>
  <input id="country" placeholder="Country"/>
  <input id="currency" placeholder="Currency (SEK/EUR/GBP)"/>

  <button onclick="addStore()">Add store</button>
</div>

<div id="stores" class="card"></div>

<h2 style="font-size:16px">Offers</h2>
<div id="offers"></div>

</div>

<script>
const A4 = 210 * 297;

let stores = [
  {id:"ib",name:"IB Wahlström",city:"Stockholm",country:"SE",currency:"SEK"},
  {id:"kreatima",name:"Kreatima",city:"Stockholm",country:"SE",currency:"SEK"},
  {id:"kck",name:"KCK",city:"Stockholm",country:"SE",currency:"SEK"},
  {id:"jordi",name:"Jordi",city:"Stockholm",country:"SE",currency:"SEK"}
];

let offers = [
  {id:"a",name:"Arches Block",storeId:"kreatima",w:300,h:400,sheets:20,price:899,eff:0.95,material:"cotton",surface:"cold"},
  {id:"b",name:"Canson XL Pad",storeId:"ib",w:210,h:297,sheets:30,price:249,eff:0.95,material:"cellulose",surface:"cold"}
];

function calc(o){
  let area=o.w*o.h;
  let total=area*o.sheets*o.eff;
  let a4=total/A4;
  let pricePerA4=o.price/a4;
  return {a4,pricePerA4};
}

function score(pricePerA4){
  if(pricePerA4<15) return "best";
  if(pricePerA4<30) return "ok";
  return "expensive";
}

function renderStores(){
  let sel=document.getElementById("storeFilter");
  sel.innerHTML='<option value="all">All stores</option>';
  stores.forEach(s=>{
    sel.innerHTML+=`<option value="${s.id}">${s.name}</option>`;
  });
}

function renderOffers(){
  let el=document.getElementById("offers");
  el.innerHTML="";

  let sf=document.getElementById("surface").value;
  let mf=document.getElementById("material").value;
  let st=document.getElementById("storeFilter").value;

  offers
  .filter(o=> (sf=="all"||o.surface==sf))
  .filter(o=> (mf=="all"||o.material==mf))
  .filter(o=> (st=="all"||o.storeId==st))
  .forEach(o=>{

    let s=stores.find(x=>x.id===o.storeId);
    let c=calc(o);
    let sc=score(c.pricePerA4);

    el.innerHTML+=`
      <div class="card">
        <strong>${o.name}</strong>
        <span class="badge ${"value-"+sc}">${sc.toUpperCase()}</span>
        <div class="small">${s.name} • ${o.material} • ${o.surface}</div>
        <div>Price: ${o.price} ${s.currency}</div>
        <div>A4 units: ${c.a4.toFixed(2)}</div>
        <div><strong>Price / A4: ${c.pricePerA4.toFixed(2)}</strong></div>
      </div>
    `;

  });
}

function addStore(){
  let s={
    id:document.getElementById("name").value.toLowerCase().replace(/\s/g,"_"),
    name:document.getElementById("name").value,
    city:document.getElementById("city").value,
    country:document.getElementById("country").value,
    currency:document.getElementById("currency").value
  };
  stores.push(s);
  renderStores();
  renderOffers();
}

document.querySelectorAll("select").forEach(s=>{
  s.addEventListener("change",renderOffers);
});

renderStores();
renderOffers();
</script>

</body>
</html>
