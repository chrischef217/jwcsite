// KV 데이터 접근 유틸리티

export async function getLogoUrl(kv: KVNamespace): Promise<string> {
  return '/jwc-logo.png'; // 정적 로고 사용
}

export async function getHeroImages(kv: KVNamespace) {
  try {
    const list = await kv.list({ prefix: 'images:' });
    const images = [];
    
    for (const key of list.keys) {
      const item = await kv.get(key.name, 'json') as any;
      if (item && item.type === 'heroSlider') {
        images.push(item);
      }
    }
    
    // order_index로 정렬
    return images.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
  } catch (error) {
    console.error('Hero images fetch error:', error);
    return [];
  }
}

export async function getPageHero(kv: KVNamespace, page: string) {
  try {
    const list = await kv.list({ prefix: 'images:' });
    
    for (const key of list.keys) {
      const item = await kv.get(key.name, 'json') as any;
      if (item && item.type === 'pageHero' && item.page === page) {
        return item;
      }
    }
    return null;
  } catch (error) {
    console.error('Page hero fetch error:', error);
    return null;
  }
}

export async function getSetting(kv: KVNamespace, key: string, defaultValue: any = null) {
  try {
    const list = await kv.list({ prefix: 'settings:' });
    
    for (const kvKey of list.keys) {
      const item = await kv.get(kvKey.name, 'json') as any;
      if (item && item.key === key) {
        try {
          return JSON.parse(item.value);
        } catch {
          return item.value;
        }
      }
    }
    return defaultValue;
  } catch (error) {
    console.error('Setting fetch error:', error);
    return defaultValue;
  }
}
