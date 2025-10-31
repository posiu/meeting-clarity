import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(_req: Request, { params }: { params: { id: string }}) {
  const meeting = await prisma.meeting.findUnique({
    where: { id: params.id },
    include: { topics: { orderBy: { order: 'asc' } }, participants: true, decisions: true, Team: true },
  });
  if (!meeting) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const decisions = meeting.decisions.filter(d => d.type === 'DECISION');
  const actions   = meeting.decisions.filter(d => d.type === 'ACTION_ITEM');

  const text = [
    `Meeting: ${meeting.title}`,
    '',
    'Decisions:',
    ...decisions.map(d => `- ${d.text}`),
    '',
    'Action Items:',
    ...actions.map(a => `- ${a.text} — Owner: ${a.ownerEmail}${a.dueDate ? ` — Due: ${new Date(a.dueDate).toLocaleDateString()}` : ''}`),
    '',
    `Participants: ${meeting.participants.map(p => p.email).join(', ')}`,
    '',
    `View online: ${process.env.NEXT_PUBLIC_APP_URL}/m/${meeting.shareToken}`,
  ].join('\n');

  const html = `
  <h1>${meeting.title} — Summary</h1>
  <h2>Decisions</h2>
  <ul>${decisions.map(d => `<li>${d.text}</li>`).join('')}</ul>
  <h2>Action Items</h2>
  <ul>${actions.map(a => `<li>${a.text} — <strong>${a.ownerEmail}</strong>${a.dueDate ? ` — Due: ${new Date(a.dueDate).toLocaleDateString()}` : ''}</li>`).join('')}</ul>
  <p><strong>Participants:</strong> ${meeting.participants.map(p => p.email).join(', ')}</p>
  <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/m/${meeting.shareToken}">Open the summary</a></p>
  `;

  await prisma.meeting.update({
    where: { id: meeting.id },
    data: { status: 'CLOSED', closedAt: new Date(), summaryText: text, summaryHtml: html },
  });

  return NextResponse.redirect(new URL(`/m/${meeting.shareToken}`, process.env.NEXT_PUBLIC_APP_URL));
}
