import React from 'react';

interface DDayInfo {
  dDay: number;
  serviceDays: number;
  totalServiceDays: number;
  entryDate: string;
  dischargeDate: string;
  progressPercentage: number;
}

interface DDayDisplayProps {
  dDayInfo: DDayInfo;
}

const DDayDisplay: React.FC<DDayDisplayProps> = ({ dDayInfo }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDDayText = (dDay: number) => {
    if (dDay > 0) {
      return `D-${dDay}`;
    } else if (dDay === 0) {
      return 'D-Day';
    } else {
      return `D+${Math.abs(dDay)}`;
    }
  };

  const getDDayColor = (dDay: number) => {
    if (dDay > 30) return 'text-green-600';
    if (dDay > 7) return 'text-yellow-600';
    if (dDay > 0) return 'text-orange-600';
    if (dDay === 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
      {/* D-Day 메인 표시 */}
      <div className="text-center mb-8">
        <div className={`text-6xl font-bold mb-2 ${getDDayColor(dDayInfo.dDay)}`}>
          {getDDayText(dDayInfo.dDay)}
        </div>
        <div className="text-gray-600 text-lg">
          {dDayInfo.dDay > 0 ? '제대까지 남은 일수' : '제대 후 경과일'}
        </div>
      </div>

      {/* 진행률 바 */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>복무 진행률</span>
          <span>{dDayInfo.progressPercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${dDayInfo.progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* 복무 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{dDayInfo.serviceDays}</div>
          <div className="text-sm text-gray-600">복무 경과일</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">{dDayInfo.totalServiceDays}</div>
          <div className="text-sm text-gray-600">전체 복무일</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">
            {dDayInfo.totalServiceDays - dDayInfo.serviceDays}
          </div>
          <div className="text-sm text-gray-600">남은 복무일</div>
        </div>
      </div>

      {/* 날짜 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">입영일</div>
          <div className="font-semibold">{formatDate(dDayInfo.entryDate)}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500 mb-1">제대일</div>
          <div className="font-semibold">{formatDate(dDayInfo.dischargeDate)}</div>
        </div>
      </div>
    </div>
  );
};

export default DDayDisplay; 