export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white text-center px-6">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to CalorieScan</h1>
        <button
          className="mt-6 px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition"
        >
          Get Started
        </button>
      </div>
    </main>
  );
}
