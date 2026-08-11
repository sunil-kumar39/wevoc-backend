import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { getBookmarkedVoices } from "../api/bookmark.api";

export default function BookmarksPage() {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadBookmarks = async () => {
            try {
                setLoading(true);

                const response = await getBookmarkedVoices();

                console.log("BOOKMARK RESPONSE:", response);

                setBookmarks(response?.data || []);

            } catch (err) {
                console.error("Bookmark fetch error:", err);
                setError(
                    err.message || "Failed to load saved voices"
                );
            } finally {
                setLoading(false);
            }
        };

        loadBookmarks();
    }, []);

    return (
        <div className="page-anim">

            <div className="feed-header bookmarks-header">
                <div className="feed-header-inner page-title-header">
                    <div className="page-title-stack">
                        <div className="page-top-title bookmarks-page-title">
                            Saved
                        </div>
                    </div>
                </div>
            </div>


            {loading && (
                <div className="empty-state">
                    <div className="empty-title">
                        Loading saved voices...
                    </div>
                </div>
            )}


            {!loading && error && (
                <div className="empty-state">
                    <div className="empty-ico">
                        ⚠️
                    </div>

                    <div className="empty-title">
                        Failed to load saved voices
                    </div>

                    <div className="empty-sub">
                        {error}
                    </div>
                </div>
            )}


            {!loading &&
                !error &&
                bookmarks.length === 0 && (

                    <div className="empty-state">

                        <div className="empty-ico">
                            🔖
                        </div>

                        <div className="empty-title">
                            Nothing saved yet
                        </div>

                        <div className="empty-sub">
                            Tap 🔖 on any voice to save it here.
                        </div>

                    </div>
                )}


            {!loading &&
                !error &&
                bookmarks.length > 0 && (

                    bookmarks.map((item) => {

                        if (!item.voice) {
                            return null;
                        }

                        return (
                            <PostCard
                                key={item._id}
                                post={item.voice}
                                className="saved-post-card"
                            />
                        );

                    })

                )}

        </div>
    );
}