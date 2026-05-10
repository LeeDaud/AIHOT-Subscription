export interface ApiItem {
  id: string;
  title: string;
  title_en: string | null;
  url: string;
  source: string;
  publishedAt: string | null;
  summary: string | null;
  category: string | null;
}

export interface ApiItemsResponse {
  count: number;
  hasNext: boolean;
  nextCursor: string | null;
  items: ApiItem[];
}

export interface DailySectionItem {
  title: string;
  summary: string;
  sourceUrl: string;
  sourceName: string;
}

export interface DailySection {
  label: string;
  items: DailySectionItem[];
}

export interface ApiDailyResponse {
  date: string;
  generatedAt: string;
  windowStart: string;
  windowEnd: string;
  lead: { title: string; leadParagraph: string } | null;
  sections: DailySection[];
  flashes: Array<{ title: string; sourceName: string; sourceUrl: string; publishedAt: string }>;
}

export interface DailySummary {
  date: string;
  generatedAt: string;
  leadTitle: string | null;
  leadParagraph: string | null;
}

export interface ApiDailiesResponse {
  count: number;
  items: DailySummary[];
}
