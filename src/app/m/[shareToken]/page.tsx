import { prisma } from '@/lib/db';

export default async function SummaryPage({ params }: { params: { shareToken: string }}) {
  const meeting = await prisma.meeting.findFirst({
    where: { shareToken: params.shareToken },
    include: { decisions: true, participants: true },
  });

  if (!meeting) return <main className="p-6">Not found.</main>;

  const decisions = meeting.decisions.filter(d => d.type === 'DECISION');
  const actions = meeting.decisions.filter(d => d.type === 'ACTION_ITEM');

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">{meeting.title} — Summary</h1>

      <section>
        <h2 className="font-medium mb-2">Decisions</h2>
        <ul className="list-disc ml-6">
          {decisions.map(d => <li key={d.id}>{d.text}</li>)}
        </ul>
      </section>

      <section>
        <h2 className="font-medium mb-2">Action Items</h2>
        <ul className="list-disc ml-6">
          {actions.map(a => (
            <li key={a.id}>
              {a.text} — <strong>{a.ownerEmail}</strong> {a.dueDate ? `(due ${new Date(a.dueDate).toLocaleDateString()})` : ''}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-medium mb-2">Participants</h2>
        <p>{meeting.participants.map(p => p.email).join(', ')}</p>
      </section>

      {meeting.summaryText ? (
        <section>
          <button
            className="px-3 py-2 rounded bg-black text-white"
            onClick={async () => {
              await navigator.clipboard.writeText(meeting.summaryText!);
              alert('Summary copied to clipboard');
            }}
          >
            Copy summary
          </button>
        </section>
      ) : null}
    </main>
  );
}
