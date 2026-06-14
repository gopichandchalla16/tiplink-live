'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Creator {
  username: string;
  displayName: string;
  bio: string;
  walletAddress: string;
  avatarUrl?: string;
  totalTips: number;
  tipCount: number;
}

export default function TipPage() {
  const params = useParams();
  const username = params?.username as string;
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('0.1');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (!username) return;
    fetch(`/api/creators`)
      .then((r) => r.json())
      .then((data) => {
        const found = data.creators?.find((c: Creator) => c.username === username);
        setCreator(found ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [username]);

  async function handleTip() {
    setStatus('sending');
    try {
      const res = await fetch(`/api/actions/tip/${username}?amount=${amount}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account: 'demo_sender_address', message }),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-purple-400 text-xl animate-pulse">Loading creator...</div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-white text-2xl font-bold">Creator not found</h1>
          <p className="text-gray-400 mt-2">@{username} has not registered on TipLink Live yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md border border-purple-500/30 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-3xl mx-auto mb-3">
            {creator.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={creator.avatarUrl} alt={creator.displayName} className="w-20 h-20 rounded-full object-cover" />
            ) : (
              creator.displayName[0]?.toUpperCase() ?? '?'
            )}
          </div>
          <h1 className="text-white text-2xl font-bold">{creator.displayName}</h1>
          <p className="text-purple-400">@{creator.username}</p>
          {creator.bio && <p className="text-gray-400 mt-2 text-sm">{creator.bio}</p>}
          <div className="flex justify-center gap-6 mt-3 text-sm">
            <div className="text-center">
              <div className="text-cyan-400 font-bold">{creator.totalTips.toFixed(2)}</div>
              <div className="text-gray-500">SOL received</div>
            </div>
            <div className="text-center">
              <div className="text-purple-400 font-bold">{creator.tipCount}</div>
              <div className="text-gray-500">Tips</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-gray-300 text-sm block mb-1">Amount (SOL)</label>
            <div className="flex gap-2 mb-2">
              {['0.1', '0.5', '1'].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmount(preset)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                    amount === preset
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {preset} SOL
                </button>
              ))}
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0.01"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              placeholder="Custom amount"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm block mb-1">Message (optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 resize-none"
              rows={3}
              placeholder="Leave a kind message..."
            />
          </div>

          {status === 'success' && (
            <div className="bg-green-900/40 border border-green-500/40 rounded-lg p-3 text-green-400 text-sm text-center">
              🎉 Tip sent successfully!
            </div>
          )}
          {status === 'error' && (
            <div className="bg-red-900/40 border border-red-500/40 rounded-lg p-3 text-red-400 text-sm text-center">
              Something went wrong. Please try again.
            </div>
          )}

          <button
            onClick={handleTip}
            disabled={status === 'sending'}
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all text-lg"
          >
            {status === 'sending' ? 'Sending...' : `Send ${amount} SOL 💜`}
          </button>
        </div>

        <p className="text-center text-gray-600 text-xs mt-4">
          Powered by TipLink Live — Solana Blinks
        </p>
      </div>
    </div>
  );
}
