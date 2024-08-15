import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "./components/api";
import PostView from "./PostView";
import LoadingIndicator from "./components/LoadingIndicator";

function SinglePostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/api/v1/post/${postId}`);
        if (response.data.data) {
          setPost(response.data.data);
        } else {
          throw new Error("Failed to fetch post.");
        }
      } catch (error) {
        console.error("Failed to fetch post:", error);
        setError("Failed to fetch post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleClose = () => {
    navigate("/post");
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!post) {
    return <div className="text-center">Failed to fetch post.</div>;
  }

  return (
    <PostView
      postId={postId}
      setIsPostViewModalOpen={() => {}}
      setEditingPostId={() => {}}
      setIsUploadModalOpen={() => {}}
      refreshPosts={() => {}}
      setIsPostStatusChanged={() => {}}
      setLoadingPostId={() => {}}
      isSinglePostPage={true}
      onClose={handleClose}
    />
  );
}

export default SinglePostPage;
