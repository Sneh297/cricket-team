import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCricketData = createAsyncThunk(
  'cricket/fetchCricketData',
  async () => {
    const response = await fetch('/api');
    if (!response.ok) {
      throw new Error('Failed to fetch cricket data');
    }
    return response.json();
  }
);

const cricketSlice = createSlice({
  name: 'cricket',
  initialState: {
    data: { statsData: [] },
    teams: [[]],
    currentTeam: 0,
    loading: false,
    error: null,
  },
  reducers: {
    addPlayer: (state, action) => {
      state.teams[state.currentTeam].push(action.payload);
    },
    removePlayer: (state, action) => {
      state.teams[state.currentTeam] = state.teams[state.currentTeam].filter(
        (player) => player.player !== action.payload.player
      );
    },
    addNewTeam: (state) => {
      state.teams.push([]);
      state.currentTeam = state.teams.length - 1;
    },
    setCurrentTeam: (state, action) => {
      state.currentTeam = action.payload;
    },
    deleteTeam: (state, action) => {
      const teamIndex = action.payload;
      if (teamIndex >= 0 && teamIndex < state.teams.length) {
        state.teams.splice(teamIndex, 1);
        if (state.teams.length === 0) {
          state.teams.push([]);
        }
        state.currentTeam = Math.min(state.currentTeam, state.teams.length - 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCricketData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCricketData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCricketData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  addPlayer,
  removePlayer,
  addNewTeam,
  setCurrentTeam,
  deleteTeam,
} = cricketSlice.actions;

export default cricketSlice.reducer;
