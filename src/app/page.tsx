import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white shadow-xl rounded-xl p-10 flex flex-col items-center max-w-md w-full">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-4 drop-shadow">Sahmino</h1>
        <p className="text-lg text-gray-600 mb-8 text-center">Your Next.js + Tailwind CSS project is ready!</p>
        <div className="flex gap-4 w-full justify-center">
          <Link href="/items" className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition">View All Items</Link>
          <Link href="/items/create" className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg font-semibold shadow hover:bg-green-700 transition">Create New Item</Link>
          <Link href="/items/totals" className="flex-1 bg-purple-600 text-white px-4 py-3 rounded-lg font-semibold shadow hover:bg-purple-700 transition">GVT Totals</Link>
        </div>
      </div>
    </main>
  );
}
