import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch(query);
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search activities by URL or domain..."
        className="w-full px-4 py-2.5 bg-[rgb(var(--color-surface))] border rounded-lg text-[rgb(var(--color-text))] placeholder-[rgb(var(--color-text-muted))] focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </form>
  );
}