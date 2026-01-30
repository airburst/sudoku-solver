import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store";
import Header from "@/components/Header";
import { HighlightProvider } from "@/features/puzzle/HighlightContext";

export const Route = createRootRoute({
  component: () => (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HighlightProvider>
          <Header />
          <Outlet />
        </HighlightProvider>
      </PersistGate>
    </Provider>
  ),
});
