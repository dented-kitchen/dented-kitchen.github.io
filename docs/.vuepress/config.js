module.exports = {
  title: 'Dented Kitchen',
  themeConfig: {
    smoothScroll: true,
    nav: [
      { text: 'Replicake', link: '/' },
      { text: 'Pantry', link: '/pantry/' },
      { text: 'Github', link: 'https://www.github.com/dented-kitchen' },
    ],
    sidebar: [
      {
        title: 'Guide',
        collapsable: false,
        children: [
          '/',
          '/guide/installation',
        ],
      },
      {
        title: 'Class Reference',
        collapsable: false,
        children: [
          '/replicake/equipment',
          '/replicake/ingredient',
          '/replicake/instruction',
          '/replicake/quantity',
          '/replicake/recipe',
          '/replicake/technique',
        ],
      },
    ],
  },
};
