import { useEffect, useMemo, useState } from "react";
import type { FC } from "react";
import { Settings } from "lucide-react";
import { listenToUpcomingSessions } from "../lib/sessions";
import { scoreSession } from "../lib/match";
import { auth } from "../lib/firebase";
import { useMyProfile } from "../lib/useMyProfile";
import { getMyInterest, setInterested } from "../lib/sessionInterest";

type HomeScreenProps = {
  onNavigate: (screen: string) => void;
};

type Tab = "partners" | "request";

function safeTimeLabel(v: any) {
  try {
    if (!v) return "—";
    // Firestore Timestamp has toDate()
    if (typeof v.toDate === "function") {
      return v.toDate().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    }
    // If it's already a Date
    if (v instanceof Date) {
      return v.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    }
    return "—";
  } catch {
    return "—";
  }
}

export const HomeScreen: FC<HomeScreenProps> = ({ onNavigate }) => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [myInterest, setMyInterestState] = useState<Record<string, boolean>>({});
  const [fatal, setFatal] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("partners");

  const user = auth.currentUser;
  const { profile: myProfile, loading: myProfileLoading } = useMyProfile(user);

  useEffect(() => {
    try {
      const unsub = listenToUpcomingSessions(setSessions);
      return () => unsub();
    } catch (e: any) {
      console.error(e);
      setFatal(e?.message ?? "HomeScreen crashed in sessions listener.");
      return;
    }
  }, []);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid || sessions.length === 0) return;

    (async () => {
      const entries = await Promise.all(
        sessions.map(async (s) => [s.id, await getMyInterest(s.id, uid)] as const)
      );
      setMyInterestState(Object.fromEntries(entries));
    })().catch((e) => console.error("interest preload failed", e));
  }, [sessions]);

  const safeMyProfile = myProfile ?? {courses: [], goals: [], availability: []};
  const userName = myProfile?.name || user?.email?.split("@")[0] || "there";
  const myCourses = safeMyProfile.courses || [];

  if (fatal) {
    return (
      <div className="h-full w-full max-w-md mx-auto flex flex-col px-6 pt-6 pb-16 bg-white">
        <h1 className="text-lg font-semibold text-red-600">Home crashed</h1>
        <p className="text-sm text-gray-700 mt-2">{fatal}</p>
        <p className="text-xs text-gray-500 mt-4">
          Check the terminal + browser console for the stack trace.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-semibold text-gray-900">LionLink Home</h1>
          <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 pb-20">
        {/* Welcome */}
        <div className="py-4">
          <p className="text-sm text-gray-900">
            Welcome Back,<br />
            <span className="font-semibold">{userName}!</span>
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => {
              setActiveTab("partners");
              onNavigate("find");
            }}
            className={`flex-1 rounded-lg px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === "partners"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Find Study Partners
          </button>
          <button
            onClick={() => setActiveTab("request")}
            className={`flex-1 rounded-lg px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === "request"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Post Study Request
          </button>
        </div>

        {/* Upcoming Study Sessions */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">
            Upcoming Study Sessions
          </h2>

          {myProfileLoading && (
            <p className="text-xs text-gray-500">Loading your profile…</p>
          )}

          {sessions.length === 0 && !myProfileLoading && (
            <p className="text-xs text-gray-500">No upcoming sessions yet.</p>
          )}

          <div className="space-y-3">
            {sessions.map((s) => {
              const match = scoreSession(safeMyProfile, s);
              const recommended = match.score >= 70;
              const isInterested = !!myInterest[s.id];

              return (
                <div
                  key={s.id}
                  className="rounded-lg border border-gray-200 bg-blue-50 p-3 space-y-2"
                >
                  {recommended && (
                    <div className="inline-flex items-center rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-medium text-white">
                      Recommended
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {s.courseCode ?? "—"} - {s.courseName ?? "—"}
                    </p>
                    <p className="text-xs text-gray-600">With {s.hostName ?? "—"}</p>
                  </div>

                  <div className="text-xs text-gray-600 space-y-1">
                    <p>📍 {s.location ?? "—"}</p>
                    <p>🕒 {safeTimeLabel(s.startAt)} – {safeTimeLabel(s.endAt)}</p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <p className="text-xs text-gray-500">
                      {s.interestedCount || 0} interested
                    </p>
                    <button
                      onClick={async () => {
                        const uid = auth.currentUser?.uid;
                        if (!uid) return;

                        const current = !!myInterest[s.id];
                        const next = !current;

                        setMyInterestState((prev) => ({ ...prev, [s.id]: next }));

                        try {
                          await setInterested(s.id, uid, next);
                        } catch (e) {
                          setMyInterestState((prev) => ({ ...prev, [s.id]: current }));
                          console.error(e);
                        }
                      }}
                      className={`text-xs font-medium px-3 py-1 rounded ${
                        isInterested
                          ? "bg-blue-600 text-white"
                          : "bg-white text-blue-600 border border-blue-600"
                      }`}
                    >
                      {isInterested ? "Interested ✓" : "Interested"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* My Courses */}
        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-3">My Courses</h2>
          <div className="flex flex-wrap gap-2">
            {myCourses.length === 0 ? (
              <p className="text-xs text-gray-500">No courses added yet</p>
            ) : (
              myCourses.map((course: string, idx: number) => (
                <div
                  key={idx}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-900"
                >
                  {course}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;