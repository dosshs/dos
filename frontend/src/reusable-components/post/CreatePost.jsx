import { useState } from "react";
import "./CreatePost.css";
import axios from "axios";
import Cookies from "js-cookie";
import { URL } from "../../App";

export default function CreatePost({
  fullname,
  username,
  userId,
  onPostCreated,
  onModalClose,
}) {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("66e6f39de181020d4c6fd0aa");
  const [isPosting, setIsPosting] = useState("Post");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [posting, setPosting] = useState(false);

  async function handlePostSubmit(e) {
    e.preventDefault();
    if (posting) return;
    if (!content) return;

    const trimmedPost = content.trim();
    const validatedPost = trimmedPost.replace(/\u2800/g, "");
    if (!validatedPost) {
      return;
    }

    setPosting(true);
    setIsPosting("Post");

    const post = {
      userId: userId,
      username: username,
      fullname: fullname,
      content: content,
      category: category,
      isAnonymous: isAnonymous,
      dateCreated: Date.now(),
    };

    try {
      setIsPosting("Posting...");
      const token = Cookies.get("token");
      const savedPost = await axios.post(`${URL}/post`, post, {
        headers: {
          Authorization: token,
        },
      });
      onModalClose();
      onPostCreated(savedPost.data.savedPost);
    } catch (e) {
      setIsPosting("Post");
      console.error("error:", e);
    } finally {
      setPosting(false);
    }
  }

  function closeModal() {
    onModalClose();
  }

  return (
    <>
      <form
        className="create-post-announcement-modal"
        onSubmit={handlePostSubmit}
      >
        <div>
          <div className="post-announcement-modal-header">
            <h2>Create Post</h2>
          </div>
          <div className="post-announcement-modal-content">
            <div className="post-author-info">
              <div className="post-header">
                <div className="profile-pic"></div>
                <div className="post-author">
                  <p
                    className="display-name --white-text"
                    style={{ fontWeight: 500 }}
                  >
                    {fullname}
                  </p>
                  <p className="username --white-text">@{username}</p>
                </div>
              </div>
            </div>
            <textarea
              className="create-post-announce-content"
              placeholder="What would you like to post?"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
            ></textarea>
            <div className="post-category">
              <select
                className="select"
                onClick={(e) => {
                  setCategory(e.target.value);
                }}
              >
                <option value="66e6f39de181020d4c6fd0aa">General</option>
                <option value="66e6f3e9e181020d4c6fd0ae">PUP</option>
                <option value="66e6f3fbe181020d4c6fd0b1">Question</option>
                <option value="66e6f408e181020d4c6fd0b4">Rant</option>
                <option value="66e6f395e181020d4c6fd0a7">Confession</option>
              </select>
              <div className="anonymous-btn w-auto gap-2">
                <input
                  type="checkbox"
                  id="isAnonymous"
                  value={isAnonymous}
                  onClick={(e) => {
                    setIsAnonymous(e.target.checked);
                  }}
                />
                <label htmlFor="isAnonymous">Post Anonymously</label>
              </div>
            </div>
          </div>
        </div>
        <div className="btn-container">
          <button className="submit-post">{isPosting}</button>
        </div>
        <p className="close-btn" onClick={closeModal}>
          &times;
        </p>
      </form>
      <div className="overlay"></div>
    </>
  );
}
