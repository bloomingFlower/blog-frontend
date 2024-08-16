import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "./components/api";
import PostView from "./PostView";
import LoadingIndicator from "./components/LoadingIndicator";

function SinglePostPage() {
  const { postId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false);
  }, [postId]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <PostView
      postId={postId}
      setEditingPostId={() => { }}
      setIsUploadModalOpen={() => { }}
      refreshPosts={() => { }}
      setIsPostStatusChanged={() => { }}
      setLoadingPostId={() => { }}
      isSinglePostPage={true}
    />
  );
}

export default SinglePostPage;