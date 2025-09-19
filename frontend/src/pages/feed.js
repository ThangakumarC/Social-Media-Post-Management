import React from "react";

function Feed({ username, userId, posts, onLike }) {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Welcome, {username}!</h1>
      <h2 className="text-2xl font-semibold mb-4">Your Feed</h2>

      <div className="flex flex-col gap-4">
        {posts.map((post, index) => {
          const liked = (post.likes || []).includes(userId);

          return (
            <div
              key={post._id || index}
              className="bg-white p-4 rounded-lg shadow"
            >
              <h3 className="text-xl font-bold mb-2">{post.user}</h3>
              <p className="mb-2">{post.content}</p>
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
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Feed;