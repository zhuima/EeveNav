import { defineCollection, z } from 'astro:content'

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    cover: z.string(),
    category: z.string().default('unsorted'),
    tags: z.array(z.string()).default([]),
  }),
})

export const collections = {
  blog: blogCollection,
}
