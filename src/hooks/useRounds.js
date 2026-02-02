import { useState, useEffect } from 'react';
import { getRounds, addRound, deleteRound, updateRound } from '../services/firebase';

export const useRounds = () => {
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRounds = async () => {
    setLoading(true);
    setError(null);
    const result = await getRounds();
    if (result.success) {
      setRounds(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRounds();
  }, []);

  const addNewRound = async (roundData) => {
    const result = await addRound(roundData);
    if (result.success) {
      await fetchRounds();
    }
    return result;
  };

  const removeRound = async (roundId) => {
    const result = await deleteRound(roundId);
    if (result.success) {
      await fetchRounds();
    }
    return result;
  };

  const modifyRound = async (roundId, data) => {
    const result = await updateRound(roundId, data);
    if (result.success) {
      await fetchRounds();
    }
    return result;
  };

  return {
    rounds,
    loading,
    error,
    addNewRound,
    removeRound,
    modifyRound,
    refreshRounds: fetchRounds
  };
};
