import { FromUser } from "./types";

export const filterParticipants = (commented: FromUser[], liked: FromUser[]) =>
  commented.filter((commenter) =>
    liked.some((liker) => commenter.id === liker.id)
  );
