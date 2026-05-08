export default function sitemap() {
  const baseUrl = 'https://careeros.vercel.app';
  const routes = ['', '/jobs', '/comms', '/prep', '/identity', '/vault'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
