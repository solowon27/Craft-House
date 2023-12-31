import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_LIKED_USERS } from '../utils/queries';

function Likes({ DIYId }) {
  const { loading, error, data } = useQuery(GET_LIKED_USERS, {
    variables: { DIYId },
  });

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8">Error! {error.message}</div>;

  const likedUsers = data.getLikedUsers;

  const uniqueUsernames = new Set();

  likedUsers.forEach((likedUser) => {
    uniqueUsernames.add(likedUser.username);
  });

  const uniqueUsernamesArray = Array.from(uniqueUsernames);

  const totalLikes = likedUsers.length;

  return (
    <div className="ml-2">
      {totalLikes === 0 ? (
        <p className="text-gray-300">0 likes</p>
      ) : (
        <>
          {uniqueUsernamesArray.length === 1 ? (
            <p className="text-gray-600"> {uniqueUsernamesArray[0]} likes this</p>
          ) : (
            <p className="text-gray-600"> {uniqueUsernamesArray[0]} and {uniqueUsernamesArray.length - 1} others liked this</p>
          )}
        </>
      )}
    </div>
  );
}

export default Likes;
