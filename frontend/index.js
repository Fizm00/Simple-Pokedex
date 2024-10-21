let pokemonData = [];

// Fetch data dari mock API
async function fetchPokemon() {
  try {
    const response = await fetch("http://localhost:3000/pokemon");
    if (!response.ok) {
      throw new Error("HTTP request failed");
    }
    const data = await response.json();
    pokemonData = data; // langsung akses data pokemon
    renderApp();
  } catch (error) {
    console.error("Failed to fetch Pokemon data:", error);
    pokemonData.error = "Gagal mengambil data Pokémon. Coba lagi nanti."; // Menambahkan pesan error
    renderApp(); // Tetap render meskipun gagal, bisa untuk pesan error
  }
}

// Function to handle search input
function handleSearch() {
  const searchQuery = document.getElementById("searchBar").value.toLowerCase();
  const filteredData = pokemonData.filter(pokemon => pokemon.name.toLowerCase().includes(searchQuery));
  renderApp(filteredData); // Render hasil filter
}

// Component tipe Pokemon
function PokemonType({ type }) {
  const typeClass = `type-${type.toLowerCase()}`;
  return React.createElement(
    "span",
    {
      className: `${typeClass} text-white px-4 py-4 rounded-lg text-sm font-semibold`, // Tambah padding dan radius
      style: { minWidth: '80px', textAlign: 'center' } // Sesuaikan ukuran kotak
    },
    type
  );
}


// Component kartu Pokemon
function PokemonCard({ name, types, image }) {
  return React.createElement(
    "div",
    {
      className: "pokemon-card max-w-xs m-4 p-4 rounded-lg shadow-lg text-white transition-transform duration-300 border-2 border-gray-700",
      style: { width: "240px", height: "380px", backgroundColor: '#1E293B', position: 'relative' }
    },
    React.createElement("img", {
      src: image,
      alt: name,
      className: "w-full h-44 object-contain mb-7"
    }),
    React.createElement(
      "h2",
      { className: "text-xl font-bold text-center" },
      name
    ),
    React.createElement(
      "div",
      { className: "flex justify-center space-x-5 absolute bottom-8 left-0 right-0" }, // Mengatur jarak antar tipe dan posisi lebih ke bawah
      types.map(type => React.createElement(PokemonType, { key: type, type }))
    )
  );
}

// Component daftar Pokemon
function PokemonList({ pokemon }) {
  if (pokemon.length === 0) {
    return React.createElement(
      "div",
      { className: "text-center text-white text-xl" },
      React.createElement("div", { className: "spinner" }), // Spinner saat loading
      " No Pokémon found..."
    );
  }

  if (pokemon.error) {
    return React.createElement(
      "div",
      { className: "text-center text-red-500 text-xl" },
      pokemon.error // Menampilkan pesan error
    );
  }

  return React.createElement(
    "div",
    { className: "flex flex-wrap justify-center" },
    pokemon.map((poke) =>
      React.createElement(PokemonCard, {
        key: poke.id,
        name: poke.name,
        types: poke.types,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png`, // Mengambil gambar dari URL ini
      })
    )
  );
}

// App component
function App({ pokemon }) {
  return React.createElement(
    "div",
    { className: "" },
    React.createElement(PokemonList, { pokemon })
  );
}

// Render aplikasi
function renderApp(filteredData = pokemonData) {
  ReactDOM.render(React.createElement(App, { pokemon: filteredData }), document.getElementById("root"));
}

// Fetch data Pokemon ketika aplikasi dimuat
fetchPokemon();
