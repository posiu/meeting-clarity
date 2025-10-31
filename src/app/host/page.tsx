import { prisma } from '@/lib/db';

export default async function HostPage({ params }: { params: { hostToken: string }}) {
  const meeting = await prisma.meeting.findFirst({
    where: { hostToken: params.hostToken },
    include: { topics: { orderBy: { order: 'asc' } }, participants: true, decisions: true },
  });
  if (!meeting) return <main className="p-6">Not found.</main>;

  const emails = meeting.participants.map(p => p.email);

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">{meeting.title} — Capture</h1>

      <section className="space-y-2">
        <h2 className="font-medium">Topics for decision</h2>
        <ul className="list-disc ml-6">
          {meeting.topics.map(t => <li key={t.id}>{t.prompt}</li>)}
        </ul>
      </section>

      <form className="space-y-2" action={`/api/meetings/${meeting.id}/decisions`} method="post">
        <div className="flex gap-2">
          <select name="type" className="border rounded p-2">
            <option value="ACTION_ITEM">Action Item</option>
            <option value="DECISION">Decision</option>
          </select>
          <input name="text" className="border rounded p-2 flex-1" placeholder="What was decided?" required />
        </div>
        <div className="flex gap-2">
          <input name="ownerEmail" className="border rounded p-2 flex-1" placeholder="owner@example.com" list="emails" required />
          <input type="date" name="dueDate" className="border rounded p-2" />
        </div>
        <datalist id="emails">
          {emails.map(e => <option key={e} value={e} />)}
        </datalist>
        <button className="px-3 py-2 bg-gray-900 text-white rounded">Add</button>
      </form>

      <section className="space-y-2">
        <h2 className="font-medium">Current entries</h2>
        <ul className="list-disc ml-6">
          {meeting.decisions.map(d => (
            <li key={d.id}>
              <span className="px-2 py-0.5 text-xs rounded border mr-2">{d.type}</span>
              {d.text} — <strong>{d.ownerEmail}</strong> {d.dueDate ? `(due ${new Date(d.dueDate).toLocaleDateString()})` : ''}
            </li>
          ))}
        </ul>
      </section>

      <form action={`/api/meetings/${meeting.id}/close`} method="post">
        <button className="px-4 py-2 bg-black text-white rounded">Close & generate summary</button>
      </form>

      <p className="text-sm">Public summary link (after close): <code>/m/{meeting.shareToken}</code></p>
    </main>
  );
}
