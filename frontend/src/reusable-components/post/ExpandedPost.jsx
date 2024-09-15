import "./ExpandedPost.css";
import Reply from "./Reply";
import CommentSkeleton from "../skeletonloading/CommentsSkeleton";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { URL } from "../../App";

export default function ExpandedPost({
  token,
  postId,
  userUserId,
  userUsername,
  userFullName,
  category,
  content,
  username,
  date,
  isAnonymous,
  fullname,
  onCloseExpandedPost,
  liked,
  likeId,
  likeCount,
  onCommentUpdate,
  onLike,
  hasComments,
  fetchedComments,
  onFetchedComments,
}) {
  const [comment, setComment] = useState("");
  const [commenting, setCommenting] = useState(false);
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(liked);
  const [postLikeId, setLikeId] = useState(likeId);
  const [likeCounts, setlikeCounts] = useState(likeCount);
  const [likeInProgress, setLikeInProgress] = useState(false);
  const [isCommentFetching, setIsCommentFetching] = useState(true);
  const [isReplyAnonymous, setIsReplyAnonymous] = useState(false);

  async function handleLike() {
    if (likeInProgress) return;

    setLikeInProgress(true);

    try {
      if (!isLiked) {
        const likePost = {
          postId: postId,
          userId: userUserId,
          username: userUsername,
        };
        const likeRes = await axios.post(`${URL}/post/like`, likePost, {
          headers: {
            Authorization: token,
          },
        });
        setLikeId(likeRes.data.like._id);
        onLike(likeRes.data.like._id);
        setIsLiked(!isLiked);
        setlikeCounts(likeCounts + 1);
      } else {
        await axios.delete(
          `${URL}/post/like/unlike?postId=${postId}&userId=${userUserId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setLikeId(null);
        onLike(null);
        setIsLiked(!isLiked);
        setlikeCounts(likeCounts - 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLikeInProgress(false);
    }
  }

  const fetchComments = async () => {
    if (fetchedComments.length > 0) {
      setIsCommentFetching(false);
      return setComments(fetchedComments);
    }

    try {
      const commentsRes = await axios.get(
        `${URL}/post/comment/c?postId=${postId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setIsCommentFetching(false);
      setComments(commentsRes.data.comments.reverse());
      onFetchedComments(commentsRes.data.comments);
    } catch (err) {
      return console.error(err);
    }
  };

  const submitComment = async () => {
    if (commenting) return;
    if (!comment) return;

    const trimmedComment = comment.trim();
    const validatedComment = trimmedComment.replace(/\u2800/g, "");
    if (!validatedComment) {
      return;
    }

    setCommenting(true);

    const commentObj = {
      profilePicture: "",
      userId: userUserId,
      fullname: userFullName,
      username: userUsername,
      postId: postId,
      content: comment,
    };
    try {
      const res = await axios.post(`${URL}/post/comment`, commentObj, {
        headers: {
          Authorization: token,
        },
      });

      onCommentUpdate();
      if (comments.length > 0) {
        onFetchedComments([res.data.comment, ...comments]);
        setComments((prevComments) => [res.data.comment, ...prevComments]);
      } else {
        setComments((prevComments) => [res.data.comment, ...prevComments]);
        onFetchedComments([res.data.comment]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setComment("");
      setCommenting(false);
    }
  };

  useEffect(() => {
    if (hasComments) fetchComments();
    else {
      setIsCommentFetching(false);
    }
  }, []);

  return (
    <div className="expanded-post-modal-background">
      <div className="expanded-post-modal">
        <div className="post-details">
          <div className="post-author-info">
            <div className="post-header">
              <div
                className="profile-pic"
                style={{ width: "3.5rem", height: "3.5rem" }}
              ></div>
              <div className="post-author">
                <p className="display-name">
                  {isAnonymous ? "Anonymous" : fullname}
                </p>
                <p className="username">
                  {!isAnonymous && <Link to={`/${username}`}>@{username}</Link>}
                </p>
                <p className="date">{date}</p>
              </div>
            </div>
            <div className="delete" onClick={onCloseExpandedPost}></div>
          </div>
          <div className="report-post-container"></div>
        </div>
        <div className=" post-content" style={{ padding: "1rem 0 0" }}>
          <div className="contents">
            <p className="pl-4 category">
              #
              {category === "66e2581e0df49e37167eccfe"
                ? "General"
                : category === "66e259e9561b417005c970e0"
                ? "PUP"
                : category === "66e259ff561b417005c970f1"
                ? "Question"
                : category === "66e25a0d561b417005c970f4"
                ? "Rant"
                : category === "66e25a1b561b417005c970f7" && "Confession"}
            </p>
            {content.split("\n").map((line, index) => (
              <p
                key={index}
                className="pl-4 pb-4 "
                style={{ fontSize: "0.95rem" }}
              >
                {line}
              </p>
            ))}
          </div>
          <div
            className="post-interaction"
            style={{
              borderBottom: " 1px solid rgb(93, 93, 93)",
              padding: "1.5rem 0",
            }}
          >
            <div className="like-container">
              <div
                className={isLiked ? "like-icon --isLiked" : "like-icon"}
                // style={{
                //   background-image: isLiked
                //     ? "url(../../assets/images/heart-filled.png)"
                //     : "url(../../assets/images/heart.png)",
                // }}
                onClick={handleLike}
              ></div>
              <p className="like-count">{likeCounts}</p>
            </div>
            <div className="comment-container">
              <div
                className="comment-icon"
                // onClick={() => {
                //   setIsPostOpen(!isPostOpen);
                // }}
              ></div>
              <p className="comment-count">
                {comments.length > 1
                  ? `${comments.length} Comments `
                  : `${comments.length} Comment`}
              </p>
            </div>
          </div>
          <div className="reply-to-post">
            <div className="user-reply">
              <div className="profile-pic"></div>
              <textarea
                placeholder="Post your reply"
                className="reply-textarea"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
              ></textarea>
            </div>
            <div className="mr-4">
              <input
                type="checkbox"
                id="isAnonymous"
                className="m-1"
                value={isReplyAnonymous}
                onClick={(e) => {
                  setIsReplyAnonymous(e.target.checked);
                }}
              />
              <label htmlFor="isAnonymous">Post Anonymously</label>
            </div>
            <button className="reply-btn" onClick={submitComment}>
              Reply
            </button>
          </div>
          <div className="replies-container">
            {/* <CommentSkeleton cards={1} /> */}
            {isCommentFetching ? (
              <CommentSkeleton cards={1} />
            ) : (
              comments.map((comment) => (
                <Reply
                  key={comment._id}
                  commentId={comment._id}
                  userUsername={userUsername}
                  fullname={comment.fullname}
                  username={comment.username}
                  content={comment.content}
                  date={comment.dateCreated}
                  userFullName={userFullName}
                  isPost={true}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
