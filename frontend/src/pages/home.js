import React, { useState } from "react";

function Home({ username, userId, posts, onLike, onAddPost, onDeletePost, onLogout }) {
  const [showAddPost, setShowAddPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTags, setNewPostTags] = useState("");
  const [activeTab, setActiveTab] = useState("myPosts");

  const myPosts = posts.filter((post) => post.userId.toString() === userId.toString());
  const likedPosts = posts.filter((post) =>
    (post.likes || []).map(String).includes(userId.toString())
  );

  const displayedPosts = activeTab === "myPosts" ? myPosts : likedPosts;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold">{username}</span>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddPost(!showAddPost)}
            className="text-2xl font-bold bg-white px-2 rounded-lg"
          >
            + Add Post
          </button>
          <button
            onClick={onLogout}
            className="text-lg font-bold bg-white px-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Add Post Form */}
      {showAddPost && (
        <div className="add-post-form p-4 bg-white rounded-lg mb-4">
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className="w-full p-2 border rounded-lg mb-2"
            placeholder="What's on your mind?"
          />
          <input
            type="text"
            value={newPostTags}
            onChange={(e) => setNewPostTags(e.target.value)}
            className="w-full p-2 border rounded-lg mb-2"
            placeholder="Tags (comma separated)"
          />
          <button
            onClick={() => {
              onAddPost(
                newPostContent,
                newPostTags.split(",").map((tag) => tag.trim())
              );
              setNewPostContent("");
              setNewPostTags("");
              setShowAddPost(false);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Post
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setActiveTab("myPosts")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "myPosts" ? "bg-gray-500 text-white" : "bg-gray-200"
          }`}
        >
          My Posts
        </button>
        <button
          onClick={() => setActiveTab("likedPosts")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "likedPosts" ? "bg-gray-500 text-white" : "bg-gray-200"
          }`}
        >
          Liked Posts
        </button>
      </div>

      {/* Posts */}
      <div className="flex flex-col gap-6">
        {displayedPosts.map((post, index) => {
          const liked = (post.likes || []).includes(userId);
          return (
            <div
              key={post._id || index}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-bold mb-2">{post.user}</h3>
              <p className="mb-2">{post.content}</p>

              <div className="flex gap-2 items-center">
                <button
                  onClick={() => onLike(post._id)}
                  className={`px-4 py-2 rounded-lg transition ${
                    liked
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  ❤️ {post.likes.length || 0}
                </button>

                {post.userId === userId && (
                  <button
                    onClick={() => onDeletePost(post._id)}
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;