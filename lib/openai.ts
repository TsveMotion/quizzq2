import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface GradingResult {
  score: number;
  feedback: string;
  isCorrect: boolean;
}

export async function gradeAnswer(
  question: string,
  studentAnswer: number,
  correctAnswer: number,
  maxMarks: number
): Promise<GradingResult> {
  // For multiple choice, we can grade directly
  const isCorrect = studentAnswer === correctAnswer;
  return {
    score: isCorrect ? maxMarks : 0,
    feedback: isCorrect ? "Correct answer!" : "Incorrect answer. Please review the material.",
    isCorrect
  };
}

export async function gradeTextAnswer(
  question: string,
  studentAnswer: string,
  modelAnswer: string,
  maxMarks: number
): Promise<GradingResult> {
  try {
    const prompt = `
      As an AI grader, grade this student's answer based on the following criteria:
      Question: ${question}
      Model Answer: ${modelAnswer}
      Student Answer: ${studentAnswer}
      Maximum Marks: ${maxMarks}

      Please evaluate the answer and provide:
      1. A score out of ${maxMarks}
      2. Constructive feedback
      3. Whether the answer is substantially correct (true/false)

      Format your response as JSON:
      {
        "score": number,
        "feedback": "string",
        "isCorrect": boolean
      }
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");
    return {
      score: Math.min(Math.max(0, result.score), maxMarks), // Ensure score is within bounds
      feedback: result.feedback || "No feedback provided",
      isCorrect: result.isCorrect || false
    };
  } catch (error) {
    console.error("OpenAI grading error:", error);
    return {
      score: 0,
      feedback: "Error during grading. Please have your teacher review this submission.",
      isCorrect: false
    };
  }
}

export async function generateQuestionFeedback(
  question: string,
  studentAnswer: string | number,
  correctAnswer: string | number
): Promise<string> {
  try {
    const prompt = `
      As a helpful teacher, provide constructive feedback for this student's answer:
      Question: ${question}
      Student's Answer: ${studentAnswer}
      Correct Answer: ${correctAnswer}

      Provide brief but helpful feedback explaining why the answer is correct or incorrect,
      and include a tip for improvement if needed.
      Keep the response under 100 words.
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 150
    });

    return completion.choices[0].message.content || "No feedback available.";
  } catch (error) {
    console.error("OpenAI feedback error:", error);
    return "Unable to generate feedback at this time.";
  }
}
