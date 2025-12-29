import { useProgress } from "@react-three/drei";

const LoadingScreen = () => {
  const { progress } = useProgress();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner or Bar */}
        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="font-bold text-lg">
          Loading {progress.toFixed(0)}%
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
