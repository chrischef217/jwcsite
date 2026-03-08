import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { layout, heroSlider, pageHero } from './views/layout'
import { homeContent } from './views/home'
import { aboutContent } from './views/about'
import { productsContent } from './views/products'
import { contactContent } from './views/contact'
import { getHeroImages, getPageHero, getSetting } from './utils/kv'

type Bindings = {
  KV: KVNamespace;
}

const app = new Hono<{ Bindings: Bindings }>()

// CORS for API routes
app.use('/api/*', cors())

// Logo endpoint - serve from hardcoded data URL
const LOGO_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAAAAAI8CAYAAABvddlvAAAACXBIWXMAAC4jAAAuIwF4pT92AAAgAElEQVR4nOy9B7BlV3nn+1vnnnvv7XxvzjmnVlBACMkkjAkGY2zjHMDGGAw2wcYYYxtjG2OMbYwxtrGNMcYYY4wxJgcJJJCQhBAgkBASQgiEhISE0u10u/Ptc885e633/d+99z3ddLp1u+vcvrerfWv12muv9a1vhf9a/7W+tRYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'

app.get('/jwc-logo.png', async (c) => {
  // Decode base64 and serve as PNG
  const base64Data = LOGO_DATA_URL.split(',')[1]
  const binaryString = atob(base64Data)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  
  return new Response(bytes, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000'
    }
  })
})

// Home page (SSR)
app.get('/', async (c) => {
  const heroImages = await getHeroImages(c.env.KV)
  const heroText = await getSetting(c.env.KV, 'heroText', { title: 'Welcome to JWC', subtitle: 'Premium Cosmetics' })
  
  const content = heroSlider(heroImages, heroText) + homeContent()
  const html = layout(content, 'JWC - Home', 'Home')
  
  return c.html(html)
})

// About page (SSR)
app.get('/about', async (c) => {
  const pageHeroData = await getPageHero(c.env.KV, 'about')
  
  const content = pageHero('About Us', pageHeroData?.data) + aboutContent()
  const html = layout(content, 'JWC - About', 'About')
  
  return c.html(html)
})

// Products page (SSR)
app.get('/products', async (c) => {
  const pageHeroData = await getPageHero(c.env.KV, 'products')
  
  const content = pageHero('Our Products', pageHeroData?.data) + productsContent()
  const html = layout(content, 'JWC - Products', 'Products')
  
  return c.html(html)
})

// Contact page (SSR)
app.get('/contact', async (c) => {
  const pageHeroData = await getPageHero(c.env.KV, 'contact')
  
  const content = pageHero('Contact Us', pageHeroData?.data) + contactContent()
  const html = layout(content, 'JWC - Contact', 'Contact')
  
  return c.html(html)
})

export default app
