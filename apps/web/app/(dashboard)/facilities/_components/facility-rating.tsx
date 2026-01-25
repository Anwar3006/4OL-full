import React, { useState } from "react";
import {
  Star,
  MessageSquare,
  Trophy,
  Send,
  UserCircle,
  ShieldCheck,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { usePerformFacilityReview } from "@/hooks/supabase-calls/useReviews";
import { Badge } from "@/components/ui/badge";

type Props = {
  facility: any;
  adminId: string;
  // This now expects the structure: { myReviews: [], summary: { avgRating, totalReviews } }
  auditData: any;
};

export function FacilityRatingSection({ facility, adminId, auditData }: Props) {
  const [comment, setComment] = useState("");
  const { mutate: submitAction, isPending } = usePerformFacilityReview();

  const { myReviews, summary } = auditData || {
    myReviews: [],
    summary: { avgRating: 0, totalReviews: 0 },
  };

  // Handle both Comment submission and Status Toggles
  const handleAction = (overrides?: { isTopRated?: boolean }) => {
    submitAction(
      {
        adminId,
        facilityId: facility.id,
        // If we are just toggling, use the new value; otherwise use current state
        isTopRated: overrides?.isTopRated ?? facility.is_top_rated,
        comment: comment || null,
        rating: null, // Admins bypass rating requirement
        parentId: null,
      },
      {
        onSuccess: () => setComment(""),
      },
    );
  };

  return (
    <div className="space-y-8 mt-10">
      {/* 1. Summary Header */}
      <div className="flex items-center justify-between bg-primary/5 p-6 rounded-2xl border border-primary/10">
        <div className="flex items-center gap-4">
          <div className="bg-primary text-white p-4 rounded-xl shadow-lg">
            <span className="text-2xl font-black">
              {summary.avgRating?.toFixed(1) || "0.0"}
            </span>
          </div>
          <div>
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={16}
                  fill={s <= Math.round(summary.avgRating) ? "#facc15" : "none"}
                  stroke={
                    s <= Math.round(summary.avgRating) ? "#facc15" : "#94a3b8"
                  }
                />
              ))}
            </div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Total {summary.totalReviews} Reviews
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-700">
              Top-Rated Status
            </span>
            <Switch
              disabled={isPending}
              checked={facility.is_top_rated}
              onCheckedChange={(val) => handleAction({ isTopRated: val })}
            />
          </div>
          {facility.is_top_rated && (
            <Badge className="bg-amber-100 text-amber-700 border-amber-200 gap-1 animate-in fade-in zoom-in">
              <Trophy size={12} /> Featured
            </Badge>
          )}
        </div>
      </div>

      {/* 2. Admin Interaction Box */}
      <div className="relative group">
        <div className="absolute -top-3 left-4 px-2 bg-background text-[10px] font-bold text-primary uppercase tracking-widest z-10">
          Admin Audit Note
        </div>
        <Textarea
          placeholder="Log an internal observation or follow-up note..."
          className="min-h-32 rounded-2xl border-slate-200 focus:border-primary focus:ring-primary/20 transition-all resize-none p-4 pt-5 bg-slate-50/30"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button
          onClick={() => handleAction()}
          disabled={!comment || isPending}
          className="absolute bottom-3 right-3 rounded-xl gap-2 shadow-md"
        >
          {isPending ? (
            <span className="animate-spin text-lg">...</span>
          ) : (
            <Send size={16} />
          )}
          Post Note
        </Button>
      </div>

      {/* 3. Threaded Personal History List */}
      <div className="space-y-4">
        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/70 flex items-center gap-2">
          <ShieldCheck size={16} className="text-primary" /> Your Internal
          History
        </h4>

        {myReviews.length > 0 ? (
          <div className="grid gap-4">
            {myReviews.map((review: any) => (
              <ReviewBox key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="py-10 text-center border-2 border-dashed rounded-2xl">
            <p className="text-sm text-muted-foreground">
              No personal audit history for this facility.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewBox({ review }: { review: any }) {
  const isInternalNote = !review.rating;

  return (
    <div className="group relative bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-lg hover:border-primary/20 transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
          <UserCircle size={24} />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h5 className="text-sm font-bold text-slate-800">You</h5>
              {isInternalNote && (
                <Badge
                  variant="outline"
                  className="text-[9px] uppercase tracking-tighter h-4 px-1.5 bg-slate-50 font-bold"
                >
                  Internal Audit
                </Badge>
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              {formatDistanceToNow(new Date(review.created_at), {
                addSuffix: true,
              })}
            </span>
          </div>

          {review.rating && (
            <div className="flex gap-0.5 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  fill={i < review.rating ? "#facc15" : "none"}
                  stroke="#facc15"
                />
              ))}
            </div>
          )}

          <p className="text-sm text-slate-600 leading-relaxed">
            {review.comment_text || (
              <span className="text-slate-300 italic">
                Updated facility status.
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
