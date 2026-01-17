import { CardContent } from "@/components/ui/card";
import { UserCard } from "./UserCard";
import { Button } from "@/components/ui/button";
import { Heart, Info, X } from "lucide-react";
import { UserProfileModal } from "@/components/user-profile-modal";

export default function CardsDisplay({
  visibleCards,
  currentUser,
  handleSwipeLeft,
  handleSwipeRight,
  handleViewMore,
  handlePass,
  likingUserId,
  viewingUser,
  showProfileModal,
  setShowProfileModal,
}: {
  visibleCards: any[];
  currentUser: any;
  handleSwipeLeft: () => void;
  handleSwipeRight: () => void;
  handleViewMore: () => void;
  handlePass: (userId: string) => void;
  likingUserId: string | null;
  viewingUser: any;
  showProfileModal: boolean;
  setShowProfileModal: (open: boolean) => void;
}) {
  return (
    <CardContent>
      <div className="relative h-[80vh] w-full max-w-md mx-auto">
        {visibleCards.map((user, idx) => (
          <UserCard
            key={user.id}
            user={user}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            onViewMore={handleViewMore}
            isActive={idx === 0}
          />
        ))}

        {/* Action Buttons */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 z-30">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full w-14 h-14 bg-white shadow-lg hover:bg-red-50 hover:border-red-500"
            onClick={() => {
              if (currentUser) {
                handlePass(currentUser.user_id);
              }
            }}
          >
            <X className="w-6 h-6 text-red-500" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full w-14 h-14 bg-white shadow-lg hover:bg-blue-50 hover:border-blue-500"
            onClick={handleViewMore}
          >
            <Info className="w-6 h-6 text-blue-500" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full w-14 h-14 bg-white shadow-lg hover:bg-green-50 hover:border-green-500"
            onClick={handleSwipeRight}
            disabled={likingUserId === currentUser?.user_id}
          >
            <Heart className="w-6 h-6 text-green-500" />
          </Button>
        </div>
      </div>

      <UserProfileModal
        user={viewingUser}
        open={showProfileModal}
        onOpenChange={setShowProfileModal}
      />
    </CardContent>
  );
}
