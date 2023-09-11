import Head from "next/head";
import { useSession, signIn } from "next-auth/react";
import GroupList from "@/components/GroupList";
import GroupPosts from "@/components/GroupPosts";
import { FacebookGroup, FacebookGroupPost, FromUser } from "@/types";
import { filterParticipants } from "@/utils";
import { useMemo, useState } from "react";

type Nullable<T> = T | null;

export default function Home() {
  const [selectedGroup, setSelectedGroup] =
    useState<Nullable<FacebookGroup>>(null);
  const [selectedPost, setSelectedPost] =
    useState<Nullable<FacebookGroupPost>>(null);
  const [raffleWinner, setRaffleWinner] = useState<Nullable<FromUser>>(null);
  const session = useSession();

  const handleGroupSelect = (group: FacebookGroup) => {
    setSelectedGroup(group);
  };

  const handlePostSelect = (post: FacebookGroupPost) => {
    setSelectedPost(post);
  };

  const participants = useMemo<Array<FromUser>>(() => {
    if (!selectedPost) return [];

    return filterParticipants(
      selectedPost.comments.data.map((comment) => comment.from),
      selectedPost.reactions.data.map(({ id, name }) => ({
        id,
        name,
      }))
    );
  }, [selectedPost]);

  const raffleUsers = (users: FromUser[]) => {
    if (users.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * users.length);
    const winner = users[randomIndex];

    setRaffleWinner(winner);

    return winner;
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>PrizePal - Your Raffle Friend</title>
      </Head>
      <div className="max-w-sm">
        <div className="mb-3 pt-0">
          <p>A group administrator needs to sign in</p>
        </div>
        {session.status === "unauthenticated" && (
          <div className="text-center">
            <button
              onClick={() => signIn()}
              className="bg-indigo-500 text-white active:bg-indigo-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
            >
              Authorize
            </button>
          </div>
        )}
        {session.status === "authenticated" && (
          <GroupList onGroupSelect={handleGroupSelect} />
        )}
        {selectedGroup && (
          <GroupPosts group={selectedGroup} onPostSelect={handlePostSelect} />
        )}
        {selectedPost && (
          <>
            <p className="text-center">Selected Post: {selectedPost.id}</p>
            <button
              onClick={() => raffleUsers(participants)}
              className="bg-indigo-500 text-white active:bg-indigo-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 w-full"
              type="button"
            >
              Raffle Now!
            </button>
            <p className="text-center">Участници</p>
            <ul>
              {participants.map((user) => (
                <li key={user.id}>{user.name}</li>
              ))}
            </ul>
          </>
        )}
        {raffleWinner && (
          <div className="text-center my-4">
            <div className="text-2xl">And the winner is</div>
            <div className="text-3xl">
              {raffleWinner.name} (#{raffleWinner.id})
            </div>
          </div>
        )}
      </div>
    </>
  );
}
