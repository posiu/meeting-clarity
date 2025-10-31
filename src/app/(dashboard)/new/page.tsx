'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewMeetingPage() {
  const [title, setTitle] = useState('');
  const [teamName, setTeamName] = useState('My Team');
  const [participants, setParticipants] = useState('mike@example.com, phil@example.com');
  const [topics, setTopics] = useState(['What decision A?', 'What decision B?'].join('\n'));
  const router = useRouter();

  async function create() {
    const res = await fetch('/api/meetings', {
      method: 'POST',
      body: JSON.stringify({
        title,
        teamName,
        participants: participants.split(',').map(s => s.trim()).filter(Boolean),
        topics: topics.split('\n').map(s => s.trim()).filter(Boolean),
      }),
    });
    const data = await res.json();
    router.push(`/host/${data.hostToken}`);
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">New Meeting</h1>
      <label className="block">
        <span className="text-sm">Meeting title</span>
        <input className="w-full border p-2 rounded" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Weekly Sync" />
      </label>
      <label className="block">
        <span className="text-sm">Team name</span>
        <input className="w-full border p-2 rounded" value={teamName} onChange={e=>setTeamName(e.target.value)} />
      </label>
      <label className="block">
        <span className="text-sm">Participants (comma-separated emails)</span>
        <input className="w-full border p-2 rounded" value={participants} onChange={e=>setParticipants(e.target.value)} />
      </label>
      <label className="block">
        <span className="text-sm">Topics for decision (one per line)</span>
        <textarea className="w-full border p-2 rounded h-40" value={topics} onChange={e=>setTopics(e.target.value)} />
      </label>
      <button onClick={create} className="px-4 py-2 rounded bg-black text-white disabled:opacity-50" disabled={!title}>
        Create & go to capture
      </button>
    </main>
  );
}
