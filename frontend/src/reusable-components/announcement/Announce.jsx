import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import ExpandedAnnounce from "./ExpandedAnnounce";
import { URL } from "../../App";

export default function Announce({
  userUserId,
  userUsername,
  userFullName,
  announceId,
  fullname,
  username,
  content,
  date,
  liked,
  likeCount,
  likeId,
  commentCount,
  isInDosAnnounce,
  category,
}) {
  const token = Cookies.get("token");
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(liked);
  const [likeCounts, setlikeCounts] = useState(likeCount);
  const [commentCounts, setCommentCount] = useState(commentCount);
  const [announceLikeId, setLikeId] = useState(likeId);
  const [likeInProgress, setLikeInProgress] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [comments, setComments] = useState([]);

  const toggleReadMore = () => {
    setIsCollapsed(!isCollapsed);
  };

  async function handleLike() {
    if (likeInProgress) return;
    setLikeInProgress(true);
    try {
      if (!isLiked) {
        setIsLiked(!isLiked);
        setlikeCounts(likeCounts + 1);
        const likeAnnounce = {
          announcementId: announceId,
          userId: userUserId,
          username: userUsername,
        };

        const likeRes = await axios.post(
          `${URL}/announcement/like`,
          likeAnnounce,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        setLikeId(likeRes.data.like._id);
      } else {
        setIsLiked(!isLiked);
        setlikeCounts(likeCounts - 1);
        await axios.delete(
          `${URL}/announcement/like/unlike?announcementId=${announceId}&userId=${userUserId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setLikeId(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLikeInProgress(false);
    }
  }

  const formatDate = (inputDate) => {
    const postDate = new Date(inputDate);
    const currentDate = new Date();
    const timeDifference = Math.abs(currentDate - postDate) / 1000;

    const timeIntervals = {
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    let timeAgo = Math.floor(timeDifference);
    let timeUnit = "";

    for (let interval in timeIntervals) {
      if (timeAgo >= timeIntervals[interval]) {
        timeUnit = interval;
        timeAgo = Math.floor(timeAgo / timeIntervals[interval]);
        break;
      }
    }

    if (timeUnit === "day" && timeAgo >= 1) {
      if (timeAgo === 1) {
        const options = {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        };
        return `Yesterday at ${postDate.toLocaleTimeString(
          undefined,
          options
        )}`;
      } else {
        const options = {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        };
        return postDate.toLocaleString(undefined, options);
      }
    }

    if (timeUnit === "") {
      return "Just now";
    }

    return `${timeAgo} ${timeUnit}${timeAgo > 1 ? "s" : ""} ago`;
  };

  return (
    <>
      <div className="post">
        <div className="post-content-container">
          <div className="post-details">
            <div className="post-author-info">
              <div className="post-header">
                <div className="profile-pic"></div>
                <div className="post-author">
                  <p className="display-name">{fullname}</p>
                  <p className="username">
                    <Link to={`/${username}`}>@{username}</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              isInDosAnnounce ? "post-content" : "post-content --announce"
            }
          >
            <p className="category">
              #
              {category === "66e6f45ce181020d4c6fd0bd"
                ? "DOS"
                : category === "66e6f464e181020d4c6fd0c0"
                ? "PUP"
                : category === "66e702294e3516f54be26c7a" && "CCIS"}
            </p>
            {content.split("\n").map((line, index) => (
              <p key={index} style={{ fontSize: "0.95rem" }}>
                {isCollapsed ? line.slice(0, 119) : line}
              </p>
            ))}
            {content.length > 120 && (
              <p className="read-more" onClick={toggleReadMore}>
                {isCollapsed ? "...read more" : "...show less"}
              </p>
            )}
          </div>
        </div>
        <div className="post-interaction">
          <div className="like-container">
            <div
              className={
                isLiked
                  ? "announcement-like --isAnnouncementLiked"
                  : "announcement-like"
              }
              // style={{
              //   width: "1.3rem",
              //   height: "1.3rem",
              // }}
              onClick={handleLike}
            ></div>
            <p className="announce-like-count" style={{ marginTop: "0.3rem" }}>
              {likeCounts}
            </p>
          </div>
          <div className="comment-container">
            <div
              className="comment-icon"
              style={{
                width: "1.2rem",
                height: "1.2rem",
              }}
              onClick={() => {
                setIsPostOpen(!isPostOpen);
              }}
            ></div>
            <p
              className="announce-comment-count"
              style={{ marginTop: "0.3rem" }}
            >
              {commentCounts > 1
                ? `${commentCounts} Comments `
                : `${commentCounts} Comment`}
            </p>
          </div>
        </div>
        <div className="date announcement-date">{formatDate(date)}</div>
      </div>
      {isPostOpen && (
        <>
          <ExpandedAnnounce
            token={token}
            announceId={announceId}
            userUserId={userUserId}
            userUsername={userUsername}
            userFullName={userFullName}
            content={content}
            username={username}
            category={category}
            date={formatDate(date)}
            fullname={fullname}
            onCloseExpandedPost={() => {
              setIsPostOpen(!isPostOpen);
            }}
            liked={isLiked}
            likeId={announceLikeId}
            likeCount={likeCounts}
            onLike={(aLikeId) => {
              isLiked
                ? setlikeCounts(likeCounts - 1)
                : setlikeCounts(likeCounts + 1);
              setIsLiked(!isLiked);
              setLikeId(aLikeId);
            }}
            onCommentUpdate={() => {
              setCommentCount(commentCounts + 1);
            }}
            hasComments={commentCounts > 0 ? true : false}
            fetchedComments={comments}
            onFetchedComments={(comment) => {
              setComments(comment);
            }}
          />{" "}
          <div className="overlay"></div>
        </>
      )}
    </>
  );
}
