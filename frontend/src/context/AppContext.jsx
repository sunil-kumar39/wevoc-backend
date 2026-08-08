import { createContext, useContext, useState } from 'react';

const Ctx = createContext(null);

export function AppProvider({ children }) {
  const [page, setPage] = useState('feed');
  const [pageData, setPageData] = useState(null);
  const [stack, setStack] = useState([]);
  const [bookmarks, setBookmarks] = useState(['p1', 'p3']);
  const [theme, setTheme] = useState('light');
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = (nextPage, data = null) => {
    setStack(s => [...s, { page, data: pageData }]);
    setPage(nextPage);
    setPageData(data);
  };

  const goBack = () => {
    if (!stack.length) return;
    const prev = stack[stack.length - 1];
    setStack(s => s.slice(0, -1));
    setPage(prev.page);
    setPageData(prev.data);
  };

  const navTo = (pg) => {
    setStack([]);
    setPage(pg);
    setPageData(null);
  };

  const toggleBookmark = (id) => {
    setBookmarks(b => b.includes(id) ? b.filter(x => x !== id) : [...b, id]);
  };

  const toggleTheme = () => {
    setTheme(t => t === 'light' ? 'dark' : 'light');
  };

  return (
    <Ctx.Provider value={{ page, pageData, navigate, goBack, navTo, bookmarks, toggleBookmark, theme, toggleTheme, searchQuery, setSearchQuery }}>
      {children}
    </Ctx.Provider>
  );
}

export const useApp = () => useContext(Ctx);
