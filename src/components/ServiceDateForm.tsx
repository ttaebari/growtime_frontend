import React, { useState } from "react";

interface ServiceDateFormProps {
    onSubmit: (entryDate: string, dischargeDate: string) => void;
    isLoading?: boolean;
}

const ServiceDateForm: React.FC<ServiceDateFormProps> = ({ onSubmit, isLoading = false }) => {
    const [entryDate, setEntryDate] = useState("");
    const [dischargeDate, setDischargeDate] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!entryDate || !dischargeDate) {
            setError("입영일과 제대일을 모두 입력해주세요.");
            return;
        }

        const entry = new Date(entryDate);
        const discharge = new Date(dischargeDate);
        const today = new Date();

        if (entry >= discharge) {
            setError("제대일은 입영일보다 늦어야 합니다.");
            return;
        }

        if (discharge < today) {
            setError("제대일은 오늘 이후여야 합니다.");
            return;
        }

        onSubmit(entryDate, dischargeDate);
    };

    return (
        <div className="p-8 w-full max-w-2xl bg-white rounded-2xl shadow-xl">
            <div className="mb-6 text-center">
                <h2 className="mb-2 text-2xl font-bold text-gray-800">복무 정보 설정</h2>
                <p className="text-gray-600">입영일과 제대일을 입력해주세요</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="entryDate" className="block mb-2 text-sm font-medium text-gray-700">
                        입영일
                    </label>
                    <input
                        type="date"
                        id="entryDate"
                        value={entryDate}
                        onChange={(e) => setEntryDate(e.target.value)}
                        className="px-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="dischargeDate" className="block mb-2 text-sm font-medium text-gray-700">
                        제대일
                    </label>
                    <input
                        type="date"
                        id="dischargeDate"
                        value={dischargeDate}
                        onChange={(e) => setDischargeDate(e.target.value)}
                        className="px-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                </div>

                {error && (
                    <div className="px-4 py-3 text-red-700 bg-red-50 rounded-lg border border-red-200">{error}</div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-3 w-full font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg transition duration-200 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "저장 중..." : "복무 정보 저장"}
                </button>
            </form>

            <div className="p-4 mt-6 bg-blue-50 rounded-lg">
                <h3 className="mb-2 font-semibold text-blue-800">💡 안내</h3>
                <ul className="space-y-1 text-sm text-blue-700">
                    <li>• 입영일은 복무를 시작한 날짜입니다</li>
                    <li>• 제대일은 복무가 끝나는 날짜입니다</li>
                    <li>• 정확한 날짜를 입력하면 D-day가 자동으로 계산됩니다</li>
                </ul>
            </div>
        </div>
    );
};

export default ServiceDateForm;
