import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ReportService from '../../../services/admin/ReportService';

export const fetchAllReports = createAsyncThunk('adminReport/fetchAll', async (_, thunkAPI) => {
    try {
        const res = await ReportService.getAllReports();
        return res.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.message);
    }
});

export const fetchReportDetail = createAsyncThunk('adminReport/fetchDetail', async (id, thunkAPI) => {
    try {
        const res = await ReportService.getReportDetail(id);
        return res.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.message);
    }
});

export const updateReportStatus = createAsyncThunk('adminReport/updateStatus', async ({ id, status }, thunkAPI) => {
    try {
        await ReportService.updateReportStatus(id, status);
        return { id, status };
    } catch (err) {
        return thunkAPI.rejectWithValue(err.message);
    }
});

const reportSlice = createSlice({
    name: 'adminReport',
    initialState: {
        reports: [],
        reportDetail: null,
        loading: false,
        error: null,
        updateSuccess: false,
    },
    reducers: {
        clearReportDetail: (state) => {
            state.reportDetail = null;
        },
        resetUpdateStatus: (state) => {
            state.updateSuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllReports.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllReports.fulfilled, (state, action) => {
                state.loading = false;
                state.reports = action.payload;
            })
            .addCase(fetchAllReports.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchReportDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReportDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.reportDetail = action.payload;
            })
            .addCase(fetchReportDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateReportStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.updateSuccess = false;
            })
            .addCase(updateReportStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.updateSuccess = true;
                if (state.reportDetail && state.reportDetail.id === action.payload.id) {
                    state.reportDetail.status = action.payload.status;
                }
            })
            .addCase(updateReportStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearReportDetail, resetUpdateStatus } = reportSlice.actions;
export default reportSlice.reducer; 