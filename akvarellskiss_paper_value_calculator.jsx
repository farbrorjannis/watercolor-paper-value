# 1) akvarellskiss_paper_value_calculator.jsx

```jsx
import React from "react";

export default function AkvarellskissPaperValueCalculator(){
 return (
<div style={{padding:'2rem',fontFamily:'Arial',maxWidth:'900px',margin:'auto'}}>
<h1>Watercolor Paper Value Tool</h1>
<p>Use the GitHub Pages index.html version for live calculator. This React file is a lightweight wrapper mockup.</p>
<ul>
<li>Compares paper cost per A4 equivalent</li>
<li>Uses products.json + offers.json + stores.json</li>
<li>Supports blocks, sheets, rolls and user-added stores</li>
</ul>
</div>
)
}
```

---

# 2) index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Akvarellskiss Paper Value Tool</title>
<style>
body{font-family:Arial;margin:0;background:#f6f3ef}
header{background:#fff;padding:18px;border-bottom:1px solid #ddd}
.container{max-width:980px;margin:auto;padding:16px}
.card{background:#fff;padding:14px;border-radius:12px;margin-bottom:12px}
input,select{width:100%;padding:8px;margin:6px 0}
button{padding:10px 14px;background:#222;color:white;border:none;border-radius:8px}
</style>
</head>
<body>
<header>
<h2>Akvarellskiss Paper Value Tool</h2>
</header>
<div class="container">

<div class="card">
<select id="store"></select>
<select id="material">
<option value="all">All material</option>
<option value="cotton">Cotton</option>
<option value="cellulose">Cellulose</option>
</select>
</div>

<div class="card">
<h3>Add Store</h3>
<input id="name" placeholder="Store name">
<input id="city" placeholder="City">
<input id="country" placeholder="Country">
<input id="currency" placeholder="Currency">
<button onclick="addStore()">Add Store</button>
</div>

<div id="out"></div>

</div>
<script>
const A4=210*297;
let stores=[],products=[],offers=[];

Promise.all([
fetch('stores.json').then(r=>r.json()),
fetch('products.json').then(r=>r.json()),
fetch('offers.json').then(r=>r.json())
]).then(d=>{
stores=d[0];
products=d[1];
offers=d[2];
let userStores=JSON.parse(localStorage.getItem('userStores')||'[]');
stores=stores.concat(userStores);
init();
render();
});

function init(){
renderStores();
document.getElementById('store').onchange=render;
document.getElementById('material').onchange=render;
}

function renderStores(){
let s=document.getElementById('store');
s.innerHTML='<option value="all">All stores</option>';
stores.forEach(x=>{
s.innerHTML+=`<option value="${x.id}">${x.name}</option>`;
});
}

function addStore(){
const name=document.getElementById('name').value.trim();
if(!name) return alert('Store name required');
let ns={
id:name.toLowerCase().replace(/\s+/g,'_'),
name,
city:city.value,
country:country.value,
currency:currency.value
};
let u=JSON.parse(localStorage.getItem('userStores')||'[]');
u.push(ns);
localStorage.setItem('userStores',JSON.stringify(u));
stores.push(ns);
renderStores();
render();
}

function calc(o){
let area=o.width*o.height;
let total=area*o.sheets*o.efficiency;
let a4=total/A4;
return {...o,pp:o.price/a4};
}

function render(){
let mat=material.value;
let st=store.value;
let data=offers.map(o=>{
let p=products.find(x=>x.id===o.p
```
