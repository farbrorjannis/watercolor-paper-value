import { useMemo, useState } from "react";

const A4_AREA = 210 * 297;

const DEFAULT_STORES = [
  { id: "ib_wahlstrom", name: "IB Wahlström", city: "Stockholm", country: "SE", currency: "SEK" },
  { id: "kreatima", name: "Kreatima", city: "Stockholm", country: "SE", currency: "SEK" },
  { id: "kck", name: "Konstnärernas Centralinköp", city: "Stockholm", country: "SE", currency: "SEK" },
  { id: "jordi", name: "Konstnärshandeln Jordi", city: "Stockholm", country: "SE", currency: "SEK" }
];

const DEFAULT_OFFERS = [
  {
    id: "arches_kreatima",
    storeId: "kreatima",
    name: "Arches Cold Press 300gsm Block",
    width: 300,
    height: 400,
    sheets: 20,
    price: 899,
    efficiency: 0.95
  },
  {
    id: "canson_ib",
    storeId: "ib_wahlstrom",
    name: "Canson XL Watercolor Pad",
    width: 210,
    height: 297,
    sheets: 30,
    price: 249,
    efficiency: 0.95
  }
];

function calcOffer(o) {
  const area = o.width * o.height;
  const totalArea = area * o.sheets * o.efficiency;
  const a4Units = totalArea / A4_AREA;
  return {
    totalArea,
    a4Units,
    pricePerA4: o.price / a4Units
  };
}

export default function App() {
  const [stores, setStores] = useState(DEFAULT_STORES);
  const [offers] = useState(DEFAULT_OFFERS);

  const enriched = useMemo(() => {
    return offers.map(o => ({ ...o, ...calcOffer(o) }));
  }, [offers]);

  const [newStore, setNewStore] = useState({ name: "", city: "", country: "", currency: "" });

  function addStore() {
    setStores([
      ...stores,
      { id: newStore.name.toLowerCase().replace(/\s/g, "_"), ...newStore }
    ]);
    setNewStore({ name: "", city: "", country: "", currency: "" });
  }

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">Akvarellskiss Paper Value Tool</h1>

      <div className="mb-6">
        <h2 className="font-semibold">Stores</h2>
        <ul className="text-sm">
          {stores.map(s => (
            <li key={s.id}>{s.name} ({s.city})</li>
          ))}
        </ul>
      </div>

      <div className="mb-6 border p-3 rounded">
        <h2 className="font-semibold mb-2">Add your own store</h2>
        <input placeholder="Name" value={newStore.name} onChange={e => setNewStore({ ...newStore, name: e.target.value })} className="border p-1 m-1" />
        <input placeholder="City" value={newStore.city} onChange={e => setNewStore({ ...newStore, city: e.target.value })} className="border p-1 m-1" />
        <input placeholder="Country" value={newStore.country} onChange={e => setNewStore({ ...newStore, country: e.target.value })} className="border p-1 m-1" />
        <input placeholder="Currency" value={newStore.currency} onChange={e => setNewStore({ ...newStore, currency: e.target.value })} className="border p-1 m-1" />
        <button onClick={addStore} className="bg-black text-white px-3 py-1 ml-2">Add</button>
      </div>

      <h2 className="font-semibold mb-2">Offers (A4 normalized)</h2>

      <div className="space-y-3">
        {enriched.map(o => {
          const store = stores.find(s => s.id === o.storeId);
          return (
            <div key={o.id} className="border p-3 rounded">
              <div className="font-semibold">{o.name}</div>
              <div className="text-sm opacity-70">{store?.name}</div>
              <div className="text-sm">Price: {o.price} {store?.currency}</div>
              <div className="text-sm">A4 units: {o.a4Units.toFixed(2)}</div>
              <div className="text-sm font-bold">Price per A4: {o.pricePerA4.toFixed(2)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
