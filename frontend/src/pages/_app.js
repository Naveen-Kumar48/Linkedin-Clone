import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import { Provider } from "react-redux";
import { store } from "@/config/redux/store";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ToastContainer position="top-right" autoClose={3000} />
      <Component {...pageProps} />
    </Provider>
  );
}
