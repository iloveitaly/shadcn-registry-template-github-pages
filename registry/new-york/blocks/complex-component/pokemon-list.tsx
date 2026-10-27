"use client"

import { PokemonCard } from "@/registry/new-york/blocks/complex-component/components/pokemon-card"
import { usePokemonList } from "@/registry/new-york/blocks/complex-component/hooks/use-pokemon"

export default function PokemonList() {
  const { pokemonList, loading, error } = usePokemonList(12)
  if (loading) return <p role="status">Loading Pokémon…</p>
  if (error || !pokemonList)
    return <p role="alert">Unable to load Pokémon. Please try again later.</p>

  return (
    <div className="grid w-full grid-cols-2 gap-4 py-6 sm:grid-cols-3 md:grid-cols-4">
      {pokemonList.results.map((pokemon) => (
        <PokemonCard key={pokemon.name} name={pokemon.name} />
      ))}
    </div>
  )
}
