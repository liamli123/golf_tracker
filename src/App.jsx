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
    <div className="min-h-screen bg-gray-50">
      <Header />

      {saveMessage && (
        <div className="container mx-auto px-4 mt-4">
          <div className={`rounded-lg p-4 ${
            saveMessage.type === 'success'
              ? 'bg-green-100 border border-green-400 text-green-700'
              : 'bg-red-100 border border-red-400 text-red-700'
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
            <p className="mt-4 text-gray-600">Loading your rounds...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            Error loading rounds: {error}
          </div>
        ) : (
          <>
            <Statistics rounds={rounds} />
            <RoundsTable rounds={rounds} onDelete={handleDeleteRound} />
          </>
        )}
      </main>

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>Golf Tracker - Track your rounds with AI</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
