import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { fetchTasks, taskActions } from "../task/taskSlice";

// slice initial state
const initialState = {
  user: null,
  isUserLoggedIn: false,
  isAuthLoading: false,
};

export const fetchUser = createAsyncThunk("auth/fetchUser", async (userId) => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  const user = docSnap.data();
  if (!user) throw new Error("user not found");
  return user;
});

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { dispatch }) => {
    const { username, email, password } = userData;
    // Register a new user
    const newUser = await createUserWithEmailAndPassword(auth, email, password);
    // Create a new user inside users collection to hold user infos.
    await setDoc(doc(db, "users", newUser.user.uid), {
      username,
      email,
    });

    // Adding initial tasks for new user
    const colRef = collection(db, "tasks");
    const todayDate = new Date().toISOString().split("T")[0];

    await addDoc(colRef, {
      title: "Registering to our tasks manager app",
      status: "done",
      due: todayDate,
      userId: newUser.user.uid,
    });

    await addDoc(colRef, {
      title: "Checking our cool navigation bar to different tasks status",
      status: "ongoing",
      due: todayDate,
      userId: newUser.user.uid,
    });

    await addDoc(colRef, {
      title: "Creating a new task",
      status: "unfinished",
      due: todayDate,
      userId: newUser.user.uid,
    });
    
    dispatch(fetchTasks(newUser.user.uid)); // to reload tasks after being added
    return { username, email };
  }
);

export const login = createAsyncThunk("auth/login", async (userData) => {
  const { email, password } = userData;
  // Sign in user
  const loggedInUser = await signInWithEmailAndPassword(auth, email, password);
  // Get user data
  const docRef = doc(db, "users", loggedInUser.user.uid);
  const docSnap = await getDoc(docRef);
  const user = docSnap.data();
  if (!user) throw new Error("user not found");
  return user;
});

export const logout = createAsyncThunk(
  "auth/logout",
  async (arg, { dispatch }) => {
    await signOut(auth);
    dispatch(taskActions.clearTaskState());
    return;
  }
);

// Creating auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.user = null;
        state.isUserLoggedIn = false;
        state.isAuthLoading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        const user = action.payload;
        state.user = user;
        state.isUserLoggedIn = true;
        state.isAuthLoading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        const { error = "User not found!" } = action;
        state.user = null;
        state.isUserLoggedIn = false;
        state.isAuthLoading = false;
        toast.error(error.message);
      })
      .addCase(registerUser.pending, (state) => {
        state.user = null;
        state.isUserLoggedIn = false;
        state.isAuthLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const user = action.payload;
        state.user = user;
        state.isUserLoggedIn = true;
        state.isAuthLoading = false;
        toast.success("You are successfully registered");
      })
      .addCase(registerUser.rejected, (state, action) => {
        const { error = "Something went wrong!,try to register again later." } =
          action;
        state.user = null;
        state.isUserLoggedIn = false;
        state.isAuthLoading = false;

        let errorMessage = "";
        if (error.code === "auth/weak-password") {
          errorMessage = "Password is too weak, try another one";
        } else if (error.code === "auth/email-already-in-use") {
          errorMessage = "You are already registered, try to login!";
        } else {
          errorMessage = error.message;
        }
        toast.error(errorMessage);
      })
      .addCase(login.pending, (state) => {
        state.user = null;
        state.isUserLoggedIn = false;
        state.isAuthLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        const user = action.payload;
        state.user = user;
        state.isUserLoggedIn = true;
        state.isAuthLoading = false;

        toast.success("You are successfully logged in");
      })
      .addCase(login.rejected, (state, action) => {
        const { error = "Something went wrong!,try to login again later." } =
          action;

        state.user = null;
        state.isUserLoggedIn = false;
        state.isAuthLoading = false;

        if (error.code === "auth/invalid-login-credentials") {
          toast.error("email or password is not correct");
        } else {
          toast.error(error.message);
        }
      })
      .addCase(logout.pending, (state) => {
        state.isAuthLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isUserLoggedIn = false;
        state.isAuthLoading = false;
        toast.warning("you are logged out");
      })
      .addCase(logout.rejected, (state, action) => {
        state.isAuthLoading = false;
        toast.error(action.error.message);
      });
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
