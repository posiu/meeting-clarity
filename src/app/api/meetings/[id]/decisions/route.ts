import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { token } from '@/lib/id';

export async function POST(req: Request, { params }: { params: { id: string }}) {
  const form = await req.formData();
  const type = String(form.get('type'));
  const text = String(form.get('text'));
  const ownerEmail = String(form.get('ownerEmail'));
  const dueDate = form.get('dueDate') ? new Date(String(form.get('dueDate'))) : null;

  const decision = await prisma.decision.create({
    data: {
      meetingId: params.id,
      type: type as any,
      text,
      ownerEmail,
      dueDate: dueDate ?? undefined,
      assignments: { create: [{ assigneeEmail: ownerEmail, ackToken: token(16) }] },
    },
  });

  const meeting = await prisma.meeting.findUnique({ where: { id: params.id }});
  return NextResponse.redirect(new URL(`/host/${meeting!.hostToken}`, process.env.NEXT_PUBLIC_APP_URL));
}
