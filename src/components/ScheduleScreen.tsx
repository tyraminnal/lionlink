import { BottomNav } from './BottomNav';
import { ArrowLeft, Plus, ChevronLeft, ChevronRight, Clock, MapPin, Users } from 'lucide-react';

interface ScheduleScreenProps {
  onNavigate: (screen: 'home' | 'find' | 'schedule' | 'profile') => void;
}

export function ScheduleScreen({ onNavigate }: ScheduleScreenProps) {
  const weekDays = [
    { day: 'Mon', date: 15, active: false },
    { day: 'Tue', date: 16, active: false },
    { day: 'Wed', date: 17, active: true },
    { day: 'Thu', date: 18, active: false },
    { day: 'Fri', date: 19, active: false },
    { day: 'Sat', date: 20, active: false },
    { day: 'Sun', date: 21, active: false },
  ];

  const sessions = [
    {
      id: 1,
      time: '10:00 AM',
      duration: '1h 30m',
      subject: 'Linear Algebra',
      partner: 'Sarah Chen',
      location: 'Butler Library, Room 301',
      color: 'bg-purple-100 border-purple-300 text-purple-900',
    },
    {
      id: 2,
      time: '2:00 PM',
      duration: '2h',
      subject: 'Organic Chemistry',
      partner: 'Alex Kumar',
      location: 'Science Building, Lab 205',
      color: 'bg-green-100 border-green-300 text-green-900',
    },
    {
      id: 3,
      time: '5:30 PM',
      duration: '1h',
      subject: 'Data Structures',
      partner: 'Emma Wilson',
      location: 'Virtual (Zoom)',
      color: 'bg-blue-100 border-blue-300 text-blue-900',
    },
  ];

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate('home')}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-gray-900 text-[24px]">Schedule</h1>
          </div>
          <button className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <h2 className="text-gray-900">December 2025</h2>
          <button className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Week Days */}
        <div className="flex gap-2">
          {weekDays.map((day) => (
            <button
              key={day.date}
              className={`flex-1 rounded-xl py-3 transition-all ${
                day.active
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="text-xs mb-1">{day.day}</div>
              <div className="text-[18px]">{day.date}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Sessions */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-900">Today's Sessions</h2>
          <span className="text-gray-500 text-sm">{sessions.length} sessions</span>
        </div>

        <div className="space-y-3 pb-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`rounded-2xl p-4 border-2 shadow-sm ${session.color}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{session.time}</span>
                    <span className="text-xs opacity-70">• {session.duration}</span>
                  </div>
                  <h3 className="mb-1">{session.subject}</h3>
                  <div className="flex items-center gap-1 text-sm opacity-80 mb-2">
                    <Users className="w-3 h-3" />
                    <span>with {session.partner}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-1 text-sm opacity-70 mb-3">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{session.location}</span>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 h-[32px] bg-white/50 hover:bg-white/80 rounded-lg transition-colors text-sm">
                  Reschedule
                </button>
                <button className="flex-1 h-[32px] bg-gray-900/10 hover:bg-gray-900/20 rounded-lg transition-colors text-sm">
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State for Later */}
        <div className="mt-6 p-6 bg-white rounded-2xl border border-dashed border-gray-300 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-1">No more sessions today</p>
          <p className="text-gray-400 text-sm mb-4">You're all caught up!</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
            Schedule New Session
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav active="schedule" onNavigate={onNavigate} />
    </div>
  );
}
