import { useState } from 'react';
import Header from './components/Header';
import ChatBox from './components/ChatBox';
import Statistics from './components/Statistics';
import RoundsTable from './components/RoundsTable';
import { useRounds } from './hooks/useRounds';

function App() {
  const { rounds, loading, error, addNewRound, removeRound } = useRounds();
  const [saveMessage, setSaveMessage] = useState(null);

  const handleSaveRound = async (data) => {
    const result = await addNewRound(data);
    if (result.success) {
      setSaveMessage({ type: 'success', text: 'Round saved successfully!' });
      setTimeout(() => setSaveMessage(null), 3000);
    } else {
      setSaveMessage({ type: 'error', text: `Error: ${result.error}` });
      setTimeout(() => setSaveMessage(null), 5000);
    }
  };

  const handleDeleteRound = async (roundId) => {
    if (window.confirm('Are you sure you want to delete this round?')) {
      const result = await removeRound(roundId);
      if (result.success) {
        setSaveMessage({ type: 'success', text: 'Round deleted successfully!' });
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        setSaveMessage({ type: 'error', text: `Error: ${result.error}` });
        setTimeout(() => setSaveMessage(null), 5000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />

      {saveMessage && (
        <div className="container mx-auto px-4 mt-4">
          <div className={`rounded-lg p-4 border ${
            saveMessage.type === 'success'
              ? 'bg-green-950/30 border-golf-green text-golf-lightgreen'
              : 'bg-red-950/30 border-red-800 text-red-400'
          }`}>
            {saveMessage.text}
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        <ChatBox onSave={handleSaveRound} />

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-golf-green"></div>
            <p className="mt-4 text-gray-400">Loading your rounds...</p>
          </div>
        ) : error ? (
          <div className="bg-red-950/30 border border-red-800 text-red-400 px-6 py-4 rounded-lg">
            Error loading rounds: {error}
          </div>
        ) : (
          <>
            <Statistics rounds={rounds} />
            <RoundsTable rounds={rounds} onDelete={handleDeleteRound} />
          </>
        )}
      </main>

      <footer className="bg-dark-card border-t border-dark-border text-gray-400 py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>Golf Tracker - Track your rounds with AI</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
