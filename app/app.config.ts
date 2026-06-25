export default defineAppConfig({
  site: {
    name: 'zig.guide',
    description: 'Get started with the Zig programming language.',
    githubRepo: 'https://github.com/sobeston/zig.guide',
    mastodon: 'https://hachyderm.io/@sobeston',
    versions: [
      { slug: '0.13', label: '0.13.0' },
      { slug: '0.12', label: '0.12.0' },
      { slug: '0.11', label: '0.11.0' }
    ]
  }
})
