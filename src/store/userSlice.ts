import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
	isLoggedIn: boolean;
	userName: string | null;
	accessToken: string | null;
}

const initialState: UserState = {
	isLoggedIn: false,
	userName: null,
	accessToken: null,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		login(state, action: PayloadAction<{ userName: string; accessToken: string }>) {
			state.isLoggedIn = true;
			state.userName = action.payload.userName;
			state.accessToken = action.payload.accessToken;
		},
		logout(state) {
			state.isLoggedIn = false;
			state.userName = null;
			state.accessToken = null;
		},
	},
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
