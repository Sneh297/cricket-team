import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCricketData = createAsyncThunk(
  'cricket/fetchData',
  async () => {
    const response = await fetch('/api');
    if (!response.ok) throw new Error('Failed to fetch data');
    return response.json();
  }
);

const cricketSlice = createSlice({
  name: 'cricket',
  initialState: {
    data: [],
    loading: false,
    error: null,
    teams: [[]],
    currentTeam: 0,
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCricketData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCricketData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.statsData;
      })
      .addCase(fetchCricketData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { addPlayer, removePlayer, addNewTeam, setCurrentTeam } =
  cricketSlice.actions;

export default cricketSlice.reducer;
