/**
 * RSS fetcher — pulls articles from 30+ feeds, deduplicates, returns a flat list.
 * Called by the nightly generation job.
 */

export interface RssArticle {
  title: string;
  url: string;
  source: string;
  date: string;
  summary: string;
}

// ── Source registry ────────────────────────────────────────────────────────────
// Organised by industry so the generator can filter relevant subsets

export const RSS_SOURCES: Record<string, string[]> = {
  // Universal — AI labs, developer tools, governance
  core: [
    "https://www.anthropic.com/news/rss.xml",
    "https://openai.com/blog/rss.xml",
    "https://deepmind.google/blog/rss/",
    "https://huggingface.co/blog/feed.xml",
    "https://github.blog/feed/",
    "https://techcrunch.com/feed/",
    "https://venturebeat.com/feed/",
    "https://www.wired.com/feed/rss",
    "https://feeds.feedburner.com/oreilly/radar/atom",
    "https://feeds.arstechnica.com/arstechnica/index",
    "https://www.technologyreview.com/feed/",
    "https://www.theverge.com/rss/index.xml",
    "https://import.cdn.thinkific.com/rss/blog",
  ],
  // AI governance & regulation
  governance: [
    "https://www.nist.gov/system/files/rss-feeds/all-news.xml",
    "https://www.regulations.gov/search?rss=true&filter%5BdocketId%5D=AI",
    "https://digital-strategy.ec.europa.eu/en/rss.xml",
    "https://www.ftc.gov/news-events/rss.xml",
    "https://www.sec.gov/news/pressreleases.rss",
  ],
  // Healthcare
  healthcare: [
    "https://www.fiercehealthcare.com/rss/xml",
    "https://www.healthcareitnews.com/rss.xml",
    "https://www.beckershospitalreview.com/rss/rss.html",
    "https://www.modernhealthcare.com/section/technology/rss",
    "https://www.statnews.com/feed/",
  ],
  // Banking & Finance
  "banking-finance": [
    "https://www.americanbanker.com/feed",
    "https://www.risk.net/rss",
    "https://www.ifr.com/rss/news.xml",
    "https://feeds.bloomberg.com/markets/news.rss",
    "https://www.ft.com/technology?format=rss",
  ],
  // Legal & Compliance
  "legal-compliance": [
    "https://www.law360.com/rss/articles",
    "https://feeds.feedburner.com/IterativePath",
    "https://www.jdsupra.com/post/rss.aspx?section=technology&sort=date",
    "https://iapp.org/feed/",
  ],
  // Manufacturing
  manufacturing: [
    "https://www.industryweek.com/rss",
    "https://www.manufacturingdive.com/feeds/news/",
    "https://www.automation.com/en-us/rss-feeds",
  ],
  // Retail & E-commerce
  "retail-ecommerce": [
    "https://www.retaildive.com/feeds/news/",
    "https://nrf.com/rss.xml",
    "https://www.emarketer.com/rss",
  ],
  // Education
  education: [
    "https://www.edsurge.com/news.rss",
    "https://edtechmagazine.com/k12/rss.xml",
    "https://www.chronicle.com/feed",
  ],
  // Real Estate
  "real-estate": [
    "https://www.globest.com/feed/",
    "https://therealdeal.com/feed/",
    "https://www.housingwire.com/feed/",
  ],
  // Insurance
  insurance: [
    "https://www.insurancetechnology.com/rss",
    "https://www.propertycasualty360.com/feed",
    "https://www.insurancejournal.com/rss/",
  ],
  // Government
  government: [
    "https://www.nextgov.com/rss/all/",
    "https://www.fedscoop.com/feed/",
    "https://www.gao.gov/rss/reports.xml",
  ],
};

// ── Fetcher ────────────────────────────────────────────────────────────────────

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim().slice(0, 500);
}

async function fetchFeed(url: string): Promise<RssArticle[]> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "omgskill-crawler/1.0" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const text = await res.text();

    const domain = new URL(url).hostname.replace("www.", "");
    const articles: RssArticle[] = [];

    // Simple XML item parser — no external deps needed
    const itemPattern = /<item[^>]*>([\s\S]*?)<\/item>/gi;
    let match;
    while ((match = itemPattern.exec(text)) !== null) {
      const item = match[1];
      const title = (item.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/) || [])[1]?.trim() ?? "";
      const link = (item.match(/<link[^>]*>([\s\S]*?)<\/link>/) || [])[1]?.trim() ?? "";
      const desc = stripHtml(
        (item.match(/<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/) || [])[1] ?? ""
      );
      const pubDate = (item.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/) || [])[1]?.trim() ?? "";

      if (title && link) {
        articles.push({ title, url: link, source: domain, date: pubDate, summary: desc });
      }
    }
    return articles;
  } catch {
    return [];
  }
}

export interface FetchResult {
  articles: RssArticle[];
  sourceCount: number;
  failedCount: number;
  fetchedAt: string;
}

/**
 * Fetch all sources relevant to an industry (core + industry-specific).
 * Deduplicates by title.
 */
export async function fetchArticlesForIndustry(industryId: string): Promise<FetchResult> {
  const urls = [
    ...(RSS_SOURCES.core ?? []),
    ...(RSS_SOURCES.governance ?? []),
    ...(RSS_SOURCES[industryId] ?? []),
  ];

  const results = await Promise.allSettled(urls.map(fetchFeed));

  let failedCount = 0;
  const all: RssArticle[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") {
      all.push(...r.value);
    } else {
      failedCount++;
    }
  }

  // Deduplicate by title (case-insensitive)
  const seen = new Set<string>();
  const articles = all.filter((a) => {
    const key = a.title.toLowerCase().trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return {
    articles,
    sourceCount: urls.length - failedCount,
    failedCount,
    fetchedAt: new Date().toISOString(),
  };
}
