export const ME = {
  _id: 'me123',
  name: 'Aryan Sharma',
  username: 'aryan_iitd',
  email: 'aryan@iitd.ac.in',
  college: 'IIT Delhi',
  bio: '3rd year CSE · building things that matter 🎧 · music obsessed',
  friends: ['u2', 'u3'],
  friendRequests: ['u4'],
  bookmarks: ['p1', 'p3'],
  postsCount: 24,
  createdAt: '2024-01-15T00:00:00Z',
};

export const USERS = [
  { _id: 'u2', name: 'Priya Mehta', username: 'priya_m', college: 'IIT Bombay', bio: 'Designer & dreamer ✨', friends: ['me123'], postsCount: 18, createdAt: '2024-02-01T00:00:00Z' },
  { _id: 'u3', name: 'Rahul Gupta', username: 'rahul_g', college: 'NIT Trichy', bio: 'Code. Coffee. Repeat ☕', friends: ['me123'], postsCount: 31, createdAt: '2024-03-10T00:00:00Z' },
  { _id: 'u4', name: 'Sneha Patel', username: 'sneha_p', college: 'BITS Pilani', bio: 'Poet at heart 🌸', friends: [], postsCount: 9, createdAt: '2024-04-05T00:00:00Z' },
  { _id: 'u5', name: 'Karan Verma', username: 'karan_v', college: 'IIT Kharagpur', bio: 'Startup founder wannabe 🚀', friends: [], postsCount: 42, createdAt: '2024-01-20T00:00:00Z' },
  { _id: 'u6', name: 'Ananya Roy', username: 'ananya_r', college: 'Delhi University', bio: 'Literature lover 📚', friends: [], postsCount: 15, createdAt: '2024-02-28T00:00:00Z' },
  { _id: 'u7', name: 'Dev Malhotra', username: 'dev_m', college: 'IIT Madras', bio: 'AI researcher | open source 🤖', friends: [], postsCount: 67, createdAt: '2024-01-05T00:00:00Z' },
];

export const POSTS = [
  { _id: 'p1', user: { _id: 'u2', name: 'Priya Mehta', username: 'priya_m', college: 'IIT Bombay' }, caption: 'Campus life hits different at 3am 🌙 — recorded this sitting outside the library, the silence is unreal', isAnonymous: false, likes: ['me123', 'u3', 'u5'], replyCount: 4, score: 11, duration: '0:28', createdAt: '2025-05-10T02:30:00Z' },
  { _id: 'p2', user: null, caption: 'This exam season is literally destroying my soul. Five subjects in four days. I haven\'t slept properly in a week and I genuinely don\'t know how people do this.', isAnonymous: true, likes: ['me123', 'u2', 'u3', 'u4', 'u6'], replyCount: 12, score: 27, duration: '0:45', createdAt: '2025-05-09T18:00:00Z' },
  { _id: 'p3', user: { _id: 'u3', name: 'Rahul Gupta', username: 'rahul_g', college: 'NIT Trichy' }, caption: 'Finally placed at my dream company 🎉 I cried. Not gonna lie. Four years of grind and this moment made it all worth it.', isAnonymous: false, likes: ['u2', 'u4', 'u5', 'u6'], replyCount: 8, score: 20, duration: '1:02', createdAt: '2025-05-09T10:00:00Z' },
  { _id: 'p4', user: { _id: 'u2', name: 'Priya Mehta', username: 'priya_m', college: 'IIT Bombay' }, caption: 'Anyone up for a jam session this weekend? Looking for a guitarist and a drummer. We\'ve got vocals and keys covered.', isAnonymous: false, likes: ['me123', 'u3'], replyCount: 2, score: 8, duration: '0:19', createdAt: '2025-05-08T16:00:00Z' },
  { _id: 'p5', user: null, caption: 'Hot take: the canteen food has genuinely gotten worse every single year and nobody at admin seems to care. The dal was literally grey yesterday.', isAnonymous: true, likes: ['me123', 'u2', 'u3', 'u4', 'u5', 'u6'], replyCount: 19, score: 37, duration: '0:32', createdAt: '2025-05-08T08:00:00Z' },
  { _id: 'p6', user: { _id: 'u5', name: 'Karan Verma', username: 'karan_v', college: 'IIT Kharagpur' }, caption: 'First startup pitch done. Terrifying but worth it. The investors actually liked our idea — third slide got real engagement 📊', isAnonymous: false, likes: ['u2', 'u6'], replyCount: 3, score: 9, duration: '0:54', createdAt: '2025-05-07T14:00:00Z' },
  { _id: 'p7', user: { _id: 'u7', name: 'Dev Malhotra', username: 'dev_m', college: 'IIT Madras' }, caption: 'Just published my first paper on transformer efficiency. Took 8 months. The feeling of seeing your name on arxiv is indescribable 🤯', isAnonymous: false, likes: ['me123', 'u2', 'u3', 'u5'], replyCount: 6, score: 18, duration: '0:38', createdAt: '2025-05-07T09:00:00Z' },
  { _id: 'p8', user: { _id: 'u6', name: 'Ananya Roy', username: 'ananya_r', college: 'Delhi University' }, caption: 'Read Dostoevsky for the first time this semester. Crime & Punishment wrecked me in the best way possible. Raskolnikov stays with you.', isAnonymous: false, likes: ['u2', 'u4'], replyCount: 5, score: 11, duration: '0:41', createdAt: '2025-05-06T20:00:00Z' },
];

export const NOTIFICATIONS = [
  { _id: 'n1', type: 'like', from: { name: 'Priya Mehta', username: 'priya_m' }, postPreview: 'Campus life hits different...', createdAt: '2025-05-10T03:00:00Z', read: false },
  { _id: 'n2', type: 'friend_request', from: { name: 'Sneha Patel', username: 'sneha_p' }, createdAt: '2025-05-09T20:00:00Z', read: false },
  { _id: 'n3', type: 'reply', from: { name: 'Rahul Gupta', username: 'rahul_g' }, postPreview: 'Finally placed at my dream company...', createdAt: '2025-05-09T12:00:00Z', read: true },
  { _id: 'n4', type: 'like', from: { name: 'Karan Verma', username: 'karan_v' }, postPreview: 'Anyone up for a jam session...', createdAt: '2025-05-08T18:00:00Z', read: true },
  { _id: 'n5', type: 'friend_accepted', from: { name: 'Dev Malhotra', username: 'dev_m' }, createdAt: '2025-05-07T10:00:00Z', read: true },
];

export const DMS = [
  { _id: 'dm1', with: { _id: 'u2', name: 'Priya Mehta', username: 'priya_m' }, messages: [
    { id: 'm1', from: 'u2', duration: '0:08', time: '2025-05-10T01:00:00Z' },
    { id: 'm2', from: 'me123', duration: '0:14', time: '2025-05-10T01:02:00Z' },
    { id: 'm3', from: 'u2', duration: '0:05', time: '2025-05-10T01:03:00Z' },
  ], unread: 2 },
  { _id: 'dm2', with: { _id: 'u3', name: 'Rahul Gupta', username: 'rahul_g' }, messages: [
    { id: 'm4', from: 'me123', duration: '0:22', time: '2025-05-09T14:00:00Z' },
    { id: 'm5', from: 'u3', duration: '0:11', time: '2025-05-09T14:05:00Z' },
  ], unread: 0 },
  { _id: 'dm3', with: { _id: 'u7', name: 'Dev Malhotra', username: 'dev_m' }, messages: [
    { id: 'm6', from: 'u7', duration: '0:33', time: '2025-05-07T09:30:00Z' },
  ], unread: 1 },
];

export const COMMUNITIES = [
  { _id: 'c1', name: 'IIT Delhi Confessions', members: 1240, posts: 342, icon: '🔥', tags: ['campus', 'iit'], joined: true },
  { _id: 'c2', name: 'Campus Startups', members: 890, posts: 156, icon: '🚀', tags: ['startup', 'founders'], joined: true },
  { _id: 'c3', name: 'Late Night Grind', members: 2100, posts: 891, icon: '🌙', tags: ['study', 'hustle'], joined: false },
  { _id: 'c4', name: 'Music & Vibes', members: 670, posts: 203, icon: '🎵', tags: ['music', 'jam'], joined: false },
  { _id: 'c5', name: 'Placement Prep', members: 3400, posts: 1200, icon: '💼', tags: ['placement', 'career'], joined: false },
  { _id: 'c6', name: 'Research Corner', members: 540, posts: 98, icon: '🔬', tags: ['research', 'academia'], joined: false },
];

export const TRENDING = [
  { tag: 'ExamSeason', voices: 892, category: 'Campus · Trending' },
  { tag: 'CampusConfessions', voices: 1204, category: 'Trending in India' },
  { tag: 'PlacementPrep', voices: 674, category: 'Career · Trending' },
  { tag: 'NightOwl', voices: 423, category: 'Campus · Trending' },
  { tag: 'CollegeMemes', voices: 2100, category: 'Trending' },
  { tag: 'StartupLife', voices: 318, category: 'Trending in India' },
];
