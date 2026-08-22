import { Navigate, NavLink, Route, Routes } from "react-router";

import { appRoutes, defaultRoute } from "../../routes/routes";

export function App() {
  return (
    <main className="grid min-h-screen grid-cols-[240px_1fr] bg-background text-foreground">
      <aside className="border-r border-border bg-card">
        <div className="border-b border-border p-5">
          <p className="text-xs font-bold uppercase text-accent-foreground">AI Studio</p>
          <h1 className="mt-1 text-lg font-semibold">Workspace</h1>
        </div>

        <nav className="grid gap-1 p-3" aria-label="Primary">
          {appRoutes.map((route) => (
            <NavLink
              className={({ isActive }) =>
                [
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                ].join(" ")
              }
              key={route.path}
              to={route.path}
            >
              {route.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <section className="min-w-0 p-8">
        <div className="mx-auto w-full max-w-5xl">
          <Routes>
            <Route element={<Navigate replace to={defaultRoute} />} path="/" />
            {appRoutes.map((route) => {
              const Page = route.element;

              return <Route element={<Page />} key={route.path} path={route.path} />;
            })}
            <Route element={<Navigate replace to={defaultRoute} />} path="*" />
          </Routes>
        </div>
      </section>
    </main>
  );
}
