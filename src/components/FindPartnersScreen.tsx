import { useEffect, useMemo, useState } from "react";
import type { FC } from "react";
import { ChevronLeft, Settings, X, ChevronDown } from "lucide-react";
import { auth } from "../lib/firebase";
import { listenToPartners, type UserProfile } from "../lib/partners";
import { scorePartner } from "../lib/match";
import { useMyProfile } from "../lib/useMyProfile";

type FindPartnersScreenProps = {
  onNavigate: (screen: string) => void;
};

export const FindPartnersScreen: FC<FindPartnersScreenProps> = ({ onNavigate }) => {
  const [partners, setPartners] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissedPartners, setDismissedPartners] = useState<Set<string>>(new Set());

  const user = auth.currentUser;
  const { profile: myProfile } = useMyProfile(user);
  const currentCourse = myProfile?.courses?.[0] || "COMS W4170 - UI Design";

  useEffect(() => {
    setLoading(true);
    const unsub = listenToPartners(
      {
        courseCode: currentCourse.split(" - ")[0],
        excludeUid: auth.currentUser?.uid ?? undefined,
        max: 50,
      },
      (rows) => {
        setPartners(rows);
        setLoading(false);
      },
      (e) => {
        console.error("listenToPartners error:", e);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [currentCourse]);

  const visiblePartners = useMemo(() => {
    return partners.filter((p) => !dismissedPartners.has(p.uid));
  }, [partners, dismissedPartners]);

  const handleDismiss = (uid: string) => {
    setDismissedPartners((prev) => new Set([...prev, uid]));
  };

  const safeMyProfile = myProfile ?? { courses: [], goals: [], availability: [] };

  return (
    <div className="h-full w-full flex flex-col bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-base font-semibold text-gray-900">Find Study Partners</h1>
          <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 pt-4 pb-20">
        {/* Course filter */}
        <div className="mb-4 rounded-lg border border-gray-200 bg-white p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">Current Course</p>
              <p className="text-sm font-medium text-gray-900">{currentCourse}</p>
              <p className="text-xs text-blue-600 flex items-center gap-1 mt-0.5">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-600"></span>
                Available Now
              </p>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Partners list */}
        <div className="space-y-3">
          {loading && <p className="text-xs text-gray-500">Loading partners…</p>}

          {!loading && visiblePartners.length === 0 && (
            <p className="text-xs text-gray-500">No partners found yet.</p>
          )}

          {visiblePartners.map((p) => {
            const matchScore = scorePartner(safeMyProfile, p);
            const percentage = Math.min(100, Math.round(matchScore.score));
            const availability = p.availability?.[0] || "Weekdays";

            return (
              <div
                key={p.uid}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm relative"
              >
                {/* Dismiss button */}
                <button
                  type="button"
                  onClick={() => handleDismiss(p.uid)}
                  className="absolute top-3 right-3 h-6 w-6 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>

                {/* Header */}
                <div className="mb-3 pr-8">
                  <div className="flex items-baseline gap-2">
                    <p className="text-sm font-semibold text-gray-900">
                      {p.displayName || "Unknown"}
                    </p>
                    <span className="text-xs font-medium text-blue-600">
                      {percentage}% match
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {p.major || "Unknown Major"}
                  </p>
                </div>

                {/* Study preferences */}
                <p className="text-xs text-gray-700 mb-2">
                  Study Style: Prefers one-on-one sessions and wants to work on problem sets together
                </p>

                {/* Availability */}
                <p className="text-xs text-gray-500 mb-3">
                  Free {availability}
                </p>

                {/* Action button */}
                <button
                  type="button"
                  onClick={() => alert(`Message ${p.displayName} (coming soon)`)}
                  className="w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Message
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FindPartnersScreen;