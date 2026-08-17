import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const SPONSORS_FILE = path.join(process.cwd(), 'src/data/sponsors.json');

const DEFAULT_SPONSORS = [
  { id: 'sp_appziio', name: 'Appziio Technologies', websiteUrl: 'https://appziio.com', tier: 'gold', logoUrl: '' },
  { id: 'sp_cahcet_alumni', name: 'CAHCET IT Alumni', websiteUrl: 'https://cahcet.in', tier: 'gold', logoUrl: '' },
  { id: 'sp_codeforge', name: 'CodeForge Studio', websiteUrl: 'https://codeforge.dev', tier: 'silver', logoUrl: '' },
  { id: 'sp_cloudscale', name: 'CloudScale Systems', websiteUrl: 'https://cloudscale.io', tier: 'silver', logoUrl: '' },
  { id: 'sp_devmatrix', name: 'DevMatrix Labs', websiteUrl: 'https://devmatrix.org', tier: 'bronze', logoUrl: '' },
  { id: 'sp_hackindia', name: 'Hackathon India', websiteUrl: 'https://hackathonindia.com', tier: 'partner', logoUrl: '' },
];

async function readSponsors(): Promise<any[]> {
  try {
    const raw = await fs.readFile(SPONSORS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return DEFAULT_SPONSORS;
  } catch {
    // If file doesn't exist, create it with default sponsors
    try {
      await fs.mkdir(path.dirname(SPONSORS_FILE), { recursive: true });
      await fs.writeFile(SPONSORS_FILE, JSON.stringify(DEFAULT_SPONSORS, null, 2), 'utf-8');
    } catch {}
    return DEFAULT_SPONSORS;
  }
}

async function writeSponsors(sponsors: any[]): Promise<void> {
  await fs.mkdir(path.dirname(SPONSORS_FILE), { recursive: true });
  await fs.writeFile(SPONSORS_FILE, JSON.stringify(sponsors, null, 2), 'utf-8');
}

// GET all sponsors
export async function GET() {
  try {
    const sponsors = await readSponsors();
    return NextResponse.json({ success: true, sponsors });
  } catch (error: any) {
    console.error('Fetch sponsors API error:', error);
    return NextResponse.json({ success: true, sponsors: DEFAULT_SPONSORS });
  }
}

// POST: Add, Update, Delete, or Seed Sponsors
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const currentList = await readSponsors();

    // 1. Delete Action
    if (body.action === 'delete') {
      const { id } = body;
      if (!id) {
        return NextResponse.json({ error: 'Sponsor ID is required for deletion' }, { status: 400 });
      }
      const updated = currentList.filter((s) => s.id !== id);
      await writeSponsors(updated);
      return NextResponse.json({ success: true, deleted: id, count: updated.length });
    }

    // 2. Seed Defaults Action
    if (body.action === 'seed') {
      const defaults = (body.sponsors && body.sponsors.length > 0) ? body.sponsors : DEFAULT_SPONSORS;
      const formatted = defaults.map((s: any, idx: number) => ({
        id: s.id || `sp_${Date.now()}_${idx}`,
        name: s.name,
        websiteUrl: s.websiteUrl || '',
        tier: s.tier || 'gold',
        logoUrl: s.logoUrl || '',
      }));
      await writeSponsors(formatted);
      return NextResponse.json({ success: true, count: formatted.length, sponsors: formatted });
    }

    // 3. Create or Update Sponsor
    const { id, name, websiteUrl, tier, logoUrl } = body;
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Sponsor name is required' }, { status: 400 });
    }

    const itemToSave = {
      id: id && !id.startsWith('default-') ? id : `sp_${Date.now()}`,
      name: name.trim(),
      websiteUrl: (websiteUrl || '').trim(),
      tier: tier || 'gold',
      logoUrl: (logoUrl || '').trim(),
      updatedAt: new Date().toISOString(),
    };

    let updatedList: any[];
    const existingIndex = currentList.findIndex((s) => s.id === itemToSave.id);

    if (existingIndex >= 0) {
      updatedList = [...currentList];
      updatedList[existingIndex] = { ...currentList[existingIndex], ...itemToSave };
    } else {
      updatedList = [itemToSave, ...currentList];
    }

    await writeSponsors(updatedList);
    return NextResponse.json({ success: true, sponsor: itemToSave, sponsors: updatedList });
  } catch (error: any) {
    console.error('Save sponsor API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
