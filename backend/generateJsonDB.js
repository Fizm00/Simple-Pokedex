const fs = require("fs");
const { config } = require("process");
const { types } = require("util");

async function generateJsonDB() {
  try {
    // TODO: fetch data pokemon api dan buatlah JSON data sesuai dengan requirement.
    // json file bernama db.json. pastikan ketika kalian menjalankan npm run start
    // dan ketika akses url http://localhost:3000/pokemon akan muncul seluruh data
    // pokemon yang telah kalian parsing dari public api pokemon
    const pokemonApiURL = "https://pokeapi.co/api/v2/pokemon/?limit=500";
    const pokemonList = await fetch(pokemonApiURL).then((res) => res.json());
    const payload = [];
    for (let index = 0; index < pokemonList.results.length; index++) {
      const pokemon = pokemonList.results[index];
      const detailPokemon = await fetch(pokemon.url).then((res) => res.json());
      const species = await fetch(detailPokemon.species.url).then((res) =>
        res.json()
      );
      const evo = await fetch(species.evolution_chain.url).then((res) =>
        res.json()
      );

      const evolutionChains = [evo.chain.species.name];
      let evolveTo = evo.chain.evolves_to[0];
      while (evolveTo) {
        evolutionChains.push(evolveTo.species.name);
        evolveTo = evolveTo.evolves_to[0];
      }
      const item = {
        id: detailPokemon.id,
        name: pokemon.name,
        height: detailPokemon.height,
        weight: detailPokemon.weight,
        cries: detailPokemon.cries,
        abilities: detailPokemon.abilities.map((ab) => ab.ability.name),
        types: detailPokemon.types.map((ty) => ty.type.name),
        evolutionChains,
      };
      payload.push(item);
      console.log(detailPokemon);
    }
    fs.writeFileSync(
      "./db.json",
      JSON.stringify({ pokemon: payload }, null, 2),
      "utf-8"
    );
    console.log(payload);
  } catch (error) {
    console.error("Failed to fetch Pokemon data:", error);
  }
}

generateJsonDB();
