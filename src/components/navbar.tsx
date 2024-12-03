"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type LeftNavBarProps = {
  onQuestionTypeChange: (type: 'number' | 'text' | 'checkbox' | 'calendar' | 'multiple-choice' | 'dropdown') => void;
  flowName?: string; // Add this line
};

export default function LeftNavBar({
  onQuestionTypeChange,
  flowName,
}: LeftNavBarProps) {
  const pathname = usePathname();

  const isEditingFlow = pathname.startsWith("/flow/");

  const handleNavAway = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const confirmation = window.confirm(
      `Er du sikker på du vil forlade flowet: "${flowName}"?`
    );
    if (!confirmation) {
      e.preventDefault();
    }
  };

  return (
    <nav
      className="fixed left-0 top-0 h-full w-48 flex flex-col items-start p-6 space-y-4"
      style={{ backgroundColor: "#006e64" }}
    >
      <h1 className="text-white">Tools</h1>
      <Link href="/">Home</Link>
      <div className="flex flex-col text-xl space-y-4 text-white">
        <button onClick={() => onQuestionTypeChange('number')}>Numeric Question</button>
        <button onClick={() => onQuestionTypeChange('text')}>Text Question</button>
        <button onClick={() => onQuestionTypeChange('checkbox')}>Checkbox Question</button>
        <button onClick={() => onQuestionTypeChange('calendar')}>Calendar Question</button>
        <button onClick={() => onQuestionTypeChange('dropdown')}>Dropdown Question</button>
        <button>Værktøj 3</button>
        <button>Værktøj 4</button>
      </div>
    </nav>
  );
}
