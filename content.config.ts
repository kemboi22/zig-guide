import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: 'page',
      source: '0.13/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        // Order within its folder, used to build the sidebar.
        order: z.number().default(0),
        // Top-level section label shown as a sidebar group heading.
        section: z.string().optional()
      })
    }),
    posts: defineCollection({
      type: 'page',
      source: 'posts/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.string().optional(),
        author: z.string().optional()
      })
    })
  }
})
