import Link from 'next/link';

export default function LeftNavBar() {
  return (
    <nav className="fixed left-0 top-0 h-full w-48 flex flex-col items-start p-6 space-y-4" style={{ backgroundColor: '#006e64' }}>
      <h1 className="text-white">Tools</h1>
      <Link href="/">Home</Link>
      <div className="flex flex-col text-xl space-y-4 text-white">
        <button>Værktøj 1</button>
        <button>Værktøj 2</button>
        <button>Værktøj 3</button>
        <button>Værktøj 4</button>
      </div>
    </nav>
  );
}


