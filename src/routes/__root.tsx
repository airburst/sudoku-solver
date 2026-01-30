import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store";
import Header from "@/components/Header";

export const Route = createRootRoute({
  component: () => (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Header />
        <Outlet />
      </PersistGate>
    </Provider>
  ),
});
