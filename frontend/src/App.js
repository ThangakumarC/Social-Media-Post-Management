import React, { useEffect, useState, useCallback } from "react";
import Feed from "./pages/feed";
import Login from "./pages/login";
import Home from "./pages/home";

function App() {
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("feed");

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (data.status === "success") {
        setUsername(username);
        setUserId(data.userId);
        fetchFeed();
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddPost = async (content, tags) => {
    if (!content) return;

    try {
      await fetch("http://localhost:5000/addPost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          content,
          tags: Array.isArray(tags) ? tags : [],
        }),
      });

      fetchFeed();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFeed = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      setPosts(
        data.map((post) => ({
          ...post,
          likes: Array.isArray(post.likes) ? post.likes : [],
        }))
      );
    } catch (error) {
      console.error(error);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) fetchFeed();
  }, [userId, fetchFeed]);

  const handleLike = async (postId) => {
    try {
      const post = posts.find((p) => p._id === postId);
      const liked = post.likes.includes(userId);

      await fetch("http://localhost:5000/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, postId }),
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: liked
                  ? post.likes.filter((id) => id.toString() !== userId.toString())
                  : [...post.likes, userId.toString()],
              }
            : post
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await fetch("http://localhost:5000/deletePost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, postId }),
      });
      fetchFeed();
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    setUsername(null);
    setUserId(null);
    setPosts([]);
  };

  return (
    <div>
      {!username ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          {/* Top Navigation Tabs */}
          <div className="flex justify-around bg-white p-4 shadow mb-4">
            <button
              onClick={() => setActiveTab("feed")}
              className={`px-4 py-2 rounded-lg ${
                activeTab === "feed" ? "bg-gray-500 text-white" : "bg-gray-200"
              }`}
            >
              Feed
            </button>
            <button
              onClick={() => setActiveTab("home")}
              className={`px-4 py-2 rounded-lg ${
                activeTab === "home" ? "bg-gray-500 text-white" : "bg-gray-200"
              }`}
            >
              Home
            </button>
          </div>

          {/*  Page Switch */}
          {activeTab === "home" ? (
            <Home
              userId={userId}
              username={username}
              posts={posts}
              onLike={handleLike}
              onAddPost={handleAddPost}
              onLogout={handleLogout}
              onDeletePost={handleDeletePost}
            />
          ) : (
            <Feed
              userId={userId}
              username={username}
              posts={posts}
              onLike={handleLike}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
