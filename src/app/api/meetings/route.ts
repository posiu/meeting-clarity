import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { token } from '@/lib/id';

export async function POST(req: Request) {
  const body = await req.json();
  const { title, teamName, participants, topics } = body as {
    title: string; teamName: string; participants: string[]; topics: string[];
  };

  const shareToken = token(16);
  const hostToken = token(16);

  const team = await prisma.team.create({ data: { name: teamName } });

  const meeting = await prisma.meeting.create({
    data: {
      title,
      teamId: team.id,
      status: 'OPEN',
      shareToken,
      hostToken,
      participants: { create: participants.map(email => ({ email })) },
      topics: { create: topics.map((prompt, i) => ({ prompt, order: i })) },
    },
  });

  return NextResponse.json({ id: meeting.id, shareToken, hostToken });
}
