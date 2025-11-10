"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center gap-2">
      <p>Contador (renderizado en el cliente):</p>
      <p className="text-xl font-semibold">{count}</p>
      <button
        onClick={() => setCount(count + 1)}
        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
      >
        Incrementar
      </button>
    </div>
  );
}