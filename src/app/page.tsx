import RoomCanvas from "@/components/RoomCanvas";

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-white">Riley Drake</h1>
          <p className="mt-2 text-white/70">
            Interactive pixel portfolio — navigate by clicking around the isometric room.
          </p>
        </div>

        <RoomCanvas />
      </div>
    </main>
  );
}
