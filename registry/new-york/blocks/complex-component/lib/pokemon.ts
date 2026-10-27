import { z } from "zod"

export async function getPokemonList({ limit = 10 }: { limit?: number }) {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}`,
  )
  if (!response.ok) throw new Error("Failed to fetch Pokémon list")
  return z
    .object({
      results: z.array(z.object({ name: z.string() })),
    })
    .parse(await response.json())
}

export async function getPokemon(name: string) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)

  if (!response.ok) {
    throw new Error("Failed to fetch pokemon")
  }

  return z
    .object({
      name: z.string(),
      id: z.number(),
      sprites: z.object({
        front_default: z.string(),
      }),
      stats: z.array(
        z.object({
          base_stat: z.number(),
          stat: z.object({
            name: z.string(),
          }),
        }),
      ),
    })
    .parse(await response.json())
}
