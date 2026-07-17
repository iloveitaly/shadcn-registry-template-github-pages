import { useEffect, useState } from "react"

import {
  getPokemon,
  getPokemonList,
} from "@/registry/new-york/blocks/complex-component/lib/pokemon"

// Totally unnecessary hook, but it's a good example of how to use a hook in a custom registry.

export function usePokemonImage(number: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${number}.png`
}

export function usePokemon(name: string) {
  const [state, setState] = useState<{
    name: string
    pokemon: Awaited<ReturnType<typeof getPokemon>>
    error: Error | null
  } | null>(null)

  useEffect(() => {
    let cancelled = false

    getPokemon(name)
      .then((pokemon) => {
        if (!cancelled) {
          setState({ name, pokemon, error: null })
        }
      })
      .catch((error: Error) => {
        if (!cancelled) {
          setState({ name, pokemon: null, error })
        }
      })

    return () => {
      cancelled = true
    }
  }, [name])

  const loading = state?.name !== name

  return {
    pokemon: loading ? null : (state?.pokemon ?? null),
    loading,
    error: loading ? null : (state?.error ?? null),
  }
}

export function usePokemonList(limit?: number) {
  const [state, setState] = useState<{
    limit: number | undefined
    pokemonList: Awaited<ReturnType<typeof getPokemonList>>
    error: Error | null
  } | null>(null)

  useEffect(() => {
    let cancelled = false

    getPokemonList({ limit })
      .then((pokemonList) => {
        if (!cancelled) {
          setState({ limit, pokemonList, error: null })
        }
      })
      .catch((error: Error) => {
        if (!cancelled) {
          setState({ limit, pokemonList: null, error })
        }
      })

    return () => {
      cancelled = true
    }
  }, [limit])

  const loading = state?.limit !== limit

  return {
    pokemonList: loading ? null : (state?.pokemonList ?? null),
    loading,
    error: loading ? null : (state?.error ?? null),
  }
}
