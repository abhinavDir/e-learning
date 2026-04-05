import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  courses: [],
  enrolledCourses: [],
  loading: false,
  error: null,
};

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess: (state, action) => {
      state.loading = false;
      state.courses = action.payload;
    },
    fetchEnrolledSuccess: (state, action) => {
      state.loading = false;
      state.enrolledCourses = action.payload;
    },
    fetchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchStart, fetchSuccess, fetchEnrolledSuccess, fetchFailure } = courseSlice.actions;
export default courseSlice.reducer;
