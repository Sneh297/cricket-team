import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCricketData,
  addPlayer,
  removePlayer,
  addNewTeam,
  setCurrentTeam,
} from '../src/store/cricketSlice';

export default function Players() {
  const dispatch = useDispatch();
  const { data, loading, error, teams, currentTeam } = useSelector(
    (state) => state.cricket
  );
  const [view, setView] = useState('teams'); // 'teams' or 'players'

  useEffect(() => {
    if (data.length === 0) {
      dispatch(fetchCricketData());
    }
  }, [dispatch, data.length]);

  const handleAddPlayer = (player) => {
    dispatch(addPlayer(player));
  };

  const handleRemovePlayer = (player) => {
    dispatch(removePlayer(player));
  };

  const handleAddNewTeam = () => {
    dispatch(addNewTeam());
  };

  const handleSetCurrentTeam = (index) => {
    dispatch(setCurrentTeam(index));
  };

  const calculateTotalRuns = (team) => {
    return team.reduce(
      (total, player) =>
        total + (player.runs === '-' ? 0 : parseInt(player.runs)),
      0
    );
  };

  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center bg-[#0A0F1C]'>
        <div className='relative w-16 h-16'>
          <div className='absolute top-0 left-0 right-0 bottom-0 animate-ping rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-20'></div>
          <div className='absolute top-2 left-2 right-2 bottom-2 animate-spin rounded-full border-t-2 border-l-2 border-violet-500'></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-[#0A0F1C] flex items-center justify-center p-4'>
        <div className='bg-gradient-to-br from-red-500/10 to-red-500/5 backdrop-blur-xl rounded-xl border border-red-500/20 p-6 max-w-md w-full'>
          <div className='flex items-center space-x-3'>
            <svg
              className='h-6 w-6 text-red-400'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                clipRule='evenodd'
              />
            </svg>
            <p className='text-red-200'>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#0A0F1C] bg-gradient-to-b from-[#0A0F1C] to-[#1A1F2C] p-4'>
      <div className='max-w-md mx-auto'>
        {/* Header */}
        <div className='text-center mb-6'>
          <h1 className='text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent'>
            Multi-team Cricket Builder
          </h1>
          <p className='text-sm text-slate-400'>Build multiple dream teams</p>
        </div>

        {/* View Toggle */}
        <div className='flex justify-center mb-4'>
          <button
            onClick={() => setView('teams')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              view === 'teams'
                ? 'bg-violet-500 text-white'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            Teams
          </button>
          <button
            onClick={() => setView('players')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              view === 'players'
                ? 'bg-violet-500 text-white'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            Players
          </button>
        </div>

        {view === 'teams' ? (
          <>
            {/* Team Selection */}
            <div className='mb-4 flex flex-wrap gap-2'>
              {teams.map((team, index) => (
                <button
                  key={index}
                  onClick={() => handleSetCurrentTeam(index)}
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    currentTeam === index
                      ? 'bg-violet-500 text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Team {index + 1}
                </button>
              ))}
              <button
                onClick={handleAddNewTeam}
                className='px-3 py-1 text-xs font-medium rounded-full bg-emerald-500 text-white'
              >
                + New Team
              </button>
            </div>

            {/* Current Team */}
            <div className='bg-[#151921] border border-slate-800/60 rounded-lg overflow-hidden'>
              <div className='bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 px-4 py-2 border-b border-slate-800/50'>
                <h2 className='text-lg font-semibold text-slate-200'>
                  Team {currentTeam + 1}{' '}
                  <span className='text-emerald-400'>
                    ({teams[currentTeam]?.length || 0} players)
                  </span>
                </h2>
              </div>
              <div className='p-4'>
                {teams[currentTeam]?.map((player) => (
                  <div
                    key={player.player}
                    className='bg-slate-800/40 rounded-lg p-3 mb-2 flex justify-between items-center'
                  >
                    <div>
                      <h3 className='font-semibold text-slate-200'>
                        {player.player}
                      </h3>
                      <p className='text-sm text-slate-400'>
                        Runs:{' '}
                        <span className='text-emerald-400'>
                          {player.runs === '-' ? 0 : player.runs}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemovePlayer(player)}
                      className='px-2 py-1 text-xs bg-red-500/20 text-red-300 rounded'
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {teams[currentTeam]?.length > 0 && (
                  <div className='mt-4 p-3 bg-slate-800/40 rounded-lg'>
                    <h3 className='text-md font-semibold text-slate-200 mb-1'>
                      Team Statistics
                    </h3>
                    <p className='text-emerald-400 font-medium'>
                      Total Runs: {calculateTotalRuns(teams[currentTeam])}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Available Players */
          <div className='bg-[#151921] border border-slate-800/60 rounded-lg overflow-hidden'>
            <div className='bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 px-4 py-2 border-b border-slate-800/50'>
              <h2 className='text-lg font-semibold text-slate-200'>
                Available Players
              </h2>
            </div>
            <div className='p-4'>
              {data.map((player) => (
                <div
                  key={player.player}
                  className='bg-slate-800/40 rounded-lg p-3 mb-2 flex justify-between items-center'
                >
                  <div>
                    <h3 className='font-semibold text-slate-200'>
                      {player.player}
                    </h3>
                    <p className='text-sm text-slate-400'>
                      Runs:{' '}
                      <span className='text-violet-400'>
                        {player.runs === '-' ? 0 : player.runs}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleAddPlayer(player)}
                    disabled={teams[currentTeam]?.some(
                      (p) => p.player === player.player
                    )}
                    className={`px-2 py-1 text-xs rounded ${
                      teams[currentTeam]?.some(
                        (p) => p.player === player.player
                      )
                        ? 'bg-slate-800/50 text-slate-500'
                        : 'bg-violet-500/20 text-violet-300'
                    }`}
                  >
                    {teams[currentTeam]?.some((p) => p.player === player.player)
                      ? 'Added'
                      : 'Add'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
