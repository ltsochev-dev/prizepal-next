import { useQuery } from "@tanstack/react-query";
import { FBQLResponse, FacebookGroup } from "@/types";
import Preloader from "./Preloader";
import OutlinedButton from "./OutlinedButton";

const GroupList = ({
  onGroupSelect,
}: {
  onGroupSelect?: (group: FacebookGroup) => void;
}) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["myGroups"],
    queryFn: async () => {
      const groups = (await (await fetch("/api/me")).json()) as FBQLResponse<
        FacebookGroup[]
      >;

      return groups.data.filter((group) => group.administrator);
    },
  });

  const handleGroupSelect = (group: FacebookGroup) => {
    if (onGroupSelect) {
      onGroupSelect(group);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="flex items-center justify-center">
          <Preloader />
        </div>
      )}
      {Array.isArray(data) && (
        <>
          <p className="text-center">
            Please choose a group that you wish to raffle at.
          </p>
          <ul className="mt-4">
            {data.map((group) => (
              <li key={group.id} className="text-center">
                <OutlinedButton
                  type="button"
                  onClick={() => handleGroupSelect(group)}
                >
                  {group.name}
                </OutlinedButton>
              </li>
            ))}
          </ul>
        </>
      )}
      {Array.isArray(data) && data.length === 0 && (
        <p className="text-blue-400">
          You are not an administrator of any group
        </p>
      )}
    </>
  );
};

export default GroupList;
