export default function CreatePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6 py-16 sm:px-10">
      <div className="rounded-[2rem] border border-slate-200 bg-white/85 p-8 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.45)]">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-700">
          Create
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
          This is where the short-link form will live.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
          We have not connected the database yet, so this page is a teaching
          placeholder for now. The next major step is to store each original
          URL, generate a short slug, and save the link under the signed-in
          user.
        </p>
      </div>
    </main>
  );
}
