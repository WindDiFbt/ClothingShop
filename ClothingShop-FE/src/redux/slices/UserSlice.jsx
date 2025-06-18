import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUsers, getUserById, updateUserStatus, updateUserRole, updateUser } from "../../services/UserService";

// Async thunks
export const fetchUsers = createAsyncThunk(
    "user/fetchUsers",
    async (_, thunkAPI) => {
        try {
            const response = await getUsers();
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const fetchUserById = createAsyncThunk(
    "user/fetchUserById",
    async (id, thunkAPI) => {
        try {
            const response = await getUserById(id);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const changeUserStatus = createAsyncThunk(
    "user/changeUserStatus",
    async ({ id, status }, thunkAPI) => {
        try {
            const response = await updateUserStatus(id, status);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const changeUserRole = createAsyncThunk(
    "user/changeUserRole",
    async ({ id, roleId }, thunkAPI) => {
        try {
            const response = await updateUserRole(id, roleId);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const updateUserInfo = createAsyncThunk(
    "user/updateUser",
    async ({ id, userData }, thunkAPI) => {
        try {
            const response = await updateUser(id, userData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const initialState = {
    users: [],
    selectedUser: null,
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearSelectedUser: (state) => {
            state.selectedUser = null;
        },
        clearUsers: (state) => {
            state.users = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Users
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.users = action.payload;
                state.loading = false;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch User By Id
            .addCase(fetchUserById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.selectedUser = action.payload;
                state.loading = false;
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Change User Status
            .addCase(changeUserStatus.fulfilled, (state, action) => {
                const index = state.users.findIndex(user => user.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
                if (state.selectedUser?.id === action.payload.id) {
                    state.selectedUser = action.payload;
                }
            })
            // Change User Role
            .addCase(changeUserRole.fulfilled, (state, action) => {
                const index = state.users.findIndex(user => user.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
                if (state.selectedUser?.id === action.payload.id) {
                    state.selectedUser = action.payload;
                }
            })
            // Update User
            .addCase(updateUserInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserInfo.fulfilled, (state, action) => {
                const index = state.users.findIndex(user => user.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
                if (state.selectedUser?.id === action.payload.id) {
                    state.selectedUser = action.payload;
                }
                state.loading = false;
            })
            .addCase(updateUserInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearSelectedUser, clearUsers } = userSlice.actions;
export default userSlice.reducer; 