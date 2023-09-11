import { FacebookGroup, FacebookGroupPost } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Preloader from "./Preloader";
import OutlinedButton from "./OutlinedButton";

const GroupPosts = ({
  group,
  onPostSelect,
}: {
  group: FacebookGroup;
  onPostSelect?: (post: FacebookGroupPost) => void;
}) => {
  const { isLoading, data = [] } = useQuery<FacebookGroupPost[]>({
    queryKey: [`${group.id}-posts`],
    queryFn: async () => {
      const res = (await (
        await fetch(`/api/posts/${group.id}`)
      ).json()) as FacebookGroupPost[];

      return res.filter(
        (post) => post.comments && post.comments.data?.length > 0
      );
    },
  });

  const handlePostSelect = (post: FacebookGroupPost) => {
    if (onPostSelect) {
      onPostSelect(post);
    }
  };

  return isLoading ? (
    <div className="flex items-center justify-center">
      <Preloader />
    </div>
  ) : (
    <>
      <p className="text-center">Posts from last 90 days</p>
      <ul>
        {data.map((post) => (
          <li key={post.id}>
            <OutlinedButton
              type="button"
              onClick={() => handlePostSelect(post)}
            >
              {post.from.name} - {post.message}
            </OutlinedButton>
          </li>
        ))}
      </ul>
    </>
  );
};

export default GroupPosts;
