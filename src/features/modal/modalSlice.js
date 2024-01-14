const { createSlice } = require("@reduxjs/toolkit");


// Slice initial state
const initialState = {
  showCreateTaskModal: false,
  updateTaskModal: {
    show: false,
    task: null,
  },
};
// Creating modal slice
const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    toggleCreateTaskModal: (state) => {
      state.showCreateTaskModal = !state.showCreateTaskModal;
    },
    toggleUpdateTaskModal: (state, action) => {
      const { task } = action.payload;
      state.updateTaskModal.show = !state.updateTaskModal.show;
      state.updateTaskModal.task = task;
    },
  },
});

export const modalActions = modalSlice.actions;
export default modalSlice.reducer;
