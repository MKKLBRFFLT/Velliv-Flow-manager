"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type LeftNavBarProps = {
  onQuestionTypeChange: (type: "number" | "text") => void;
};

export default function LeftNavBar({ onQuestionTypeChange }: LeftNavBarProps) {
  const pathname = usePathname();

  const isEditingFlow = pathname.startsWith("/flow/");
  return (
    <nav
      className="fixed left-0 top-0 h-full w-48 flex flex-col items-start p-6 space-y-4"
      style={{ backgroundColor: "#006e64" }}
    >
      <h1 className="text-white">Tools</h1>
      <Link href="/">Home</Link>
      {isEditingFlow && (
        <div className="flex flex-col text-xl space-y-4 text-white">
          <button onClick={() => onQuestionTypeChange?.("number")}>
            Numeric Question
          </button>
          <button onClick={() => onQuestionTypeChange?.("text")}>
            Text Question
          </button>
          <button>Værktøj 3</button>
          <button>Værktøj 4</button>
        </div>
      )}
    </nav>
  );
}
