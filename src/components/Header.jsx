export default function Header() {
  return (
    <header className="bg-golf-green text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-4xl">⛳</div>
            <div>
              <h1 className="text-3xl font-bold">Golf Tracker</h1>
              <p className="text-green-200 text-sm">AI-Powered Round Management</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
