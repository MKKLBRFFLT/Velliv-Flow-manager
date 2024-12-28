export type PreCondition = {
    questionIndex: number; // Index of the question to evaluate
    expectedValue: string | number; // Consistent type
    operator?: string; // Optional operator ('=', '>', '<', '>=', '<=')
  };
  
  export type PostCondition = {
    condition: {
      questionIndex: number; // Index of the question to evaluate
      value: string | number; // Value to match
      operator?: string; // Optional operator ('=', '>', '<', '>=', '<=')
    };
    nextPageId: string; // ID of the next page if condition is met
  };
  
  export type Question = {
    text: string;
    inputType:
      | "number"
      | "text"
      | "multiple-choice"
      | "checkbox"
      | "calendar"
      | "dropdown";
    placeholder?: string;
    answers?: string[];
    allowMultipleAnswers?: boolean;
    options?: string[];
  };
  
  export type Page = {
    id: string;
    name: string;
    questions: Question[];
    preConditions?: PreCondition[]; // Optional pre-conditions
    postConditions?: PostCondition[]; // Optional post-conditions
  };
  
  export type Flow = {
    id: string;
    name: string;
    description: string;
    pages: Page[];
  };

  
  