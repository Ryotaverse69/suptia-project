"use client";

export function MoleculeBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* 煙・霧のようなブロブ1 */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-30 blur-3xl animate-smoke-drift-1"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 70%)",
          top: "10%",
          left: "5%",
        }}
      />

      {/* 煙・霧のようなブロブ2 */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full opacity-25 blur-3xl animate-smoke-drift-2"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 70%)",
          top: "30%",
          right: "10%",
        }}
      />

      {/* 煙・霧のようなブロブ3 */}
      <div
        className="absolute w-[700px] h-[700px] rounded-full opacity-20 blur-3xl animate-smoke-drift-3"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 70%)",
          bottom: "15%",
          left: "15%",
        }}
      />

      {/* 煙・霧のようなブロブ4 */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-28 blur-3xl animate-smoke-drift-4"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 255, 255, 0.38) 0%, rgba(255, 255, 255, 0) 70%)",
          bottom: "25%",
          right: "20%",
        }}
      />

      {/* 小さな霧のパーティクル */}
      <div
        className="absolute w-[300px] h-[300px] rounded-full opacity-15 blur-2xl animate-smoke-drift-5"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 60%)",
          top: "50%",
          left: "50%",
        }}
      />

      <style jsx>{`
        @keyframes smoke-drift-1 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translate(50px, -30px) scale(1.1);
            opacity: 0.25;
          }
          50% {
            transform: translate(30px, -60px) scale(1.05);
            opacity: 0.35;
          }
          75% {
            transform: translate(-20px, -40px) scale(1.15);
            opacity: 0.28;
          }
        }

        @keyframes smoke-drift-2 {
          0%,
          100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 0.25;
          }
          33% {
            transform: translate(-60px, 40px) scale(1.08) rotate(5deg);
            opacity: 0.3;
          }
          66% {
            transform: translate(-30px, 70px) scale(1.12) rotate(-3deg);
            opacity: 0.22;
          }
        }

        @keyframes smoke-drift-3 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.2;
          }
          40% {
            transform: translate(40px, 50px) scale(1.15);
            opacity: 0.25;
          }
          80% {
            transform: translate(70px, 20px) scale(1.1);
            opacity: 0.18;
          }
        }

        @keyframes smoke-drift-4 {
          0%,
          100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 0.28;
          }
          30% {
            transform: translate(-40px, -30px) scale(1.12) rotate(-5deg);
            opacity: 0.32;
          }
          70% {
            transform: translate(-70px, -10px) scale(1.08) rotate(3deg);
            opacity: 0.24;
          }
        }

        @keyframes smoke-drift-5 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.15;
          }
          50% {
            transform: translate(20px, 30px) scale(1.2);
            opacity: 0.25;
          }
        }

        .animate-smoke-drift-1 {
          animation: smoke-drift-1 25s ease-in-out infinite;
        }

        .animate-smoke-drift-2 {
          animation: smoke-drift-2 30s ease-in-out infinite;
          animation-delay: 3s;
        }

        .animate-smoke-drift-3 {
          animation: smoke-drift-3 28s ease-in-out infinite;
          animation-delay: 6s;
        }

        .animate-smoke-drift-4 {
          animation: smoke-drift-4 32s ease-in-out infinite;
          animation-delay: 2s;
        }

        .animate-smoke-drift-5 {
          animation: smoke-drift-5 20s ease-in-out infinite;
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
