export default function Header() {
  return (
    <header className="bg-dark-card border-b border-dark-border shadow-xl">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-4xl">⛳</div>
            <div>
              <h1 className="text-3xl font-mono font-bold text-golf-green">
                GOLF TRACKER
              </h1>
              <p className="text-gray-500 text-sm font-mono">AI-Powered Round Management</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
