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

export interface QuizQuestion {
  question: string;
  correctAnswer: string;
  explanation: string;
  topic: string;
  difficulty: string;
}

export interface QuizResponse {
  feedback: string;
  isCorrect: boolean;
  explanation: string;
}

export async function generateQuiz(
  subject: string,
  topics: string[],
  numQuestions: number,
  difficulty: string
): Promise<QuizQuestion[]> {
  try {
    // Only allow 3 or 5 questions
    const allowedQuestions = [3, 5];
    const limitedQuestions = allowedQuestions.includes(numQuestions) ? numQuestions : 3;

    const prompt = `
      Generate a GCSE-level ${subject} quiz with the following specifications:
      - Number of questions: ${limitedQuestions}
      - Topics: ${topics.join(', ')}
      - Difficulty level: ${difficulty}

      For each question, provide:
      1. A clear, well-formatted question
      2. The correct answer (keep it concise)
      3. A detailed explanation
      4. The specific topic it covers
      5. The difficulty level (Foundation/Higher)

      Format your response as a JSON array of questions:
      [
        {
          "question": "string",
          "correctAnswer": "string",
          "explanation": "string",
          "topic": "string",
          "difficulty": "string"
        }
      ]

      Make sure the questions are:
      - Age-appropriate for GCSE students
      - Clear and unambiguous
      - Progressively challenging
      - Relevant to the GCSE curriculum
      - Have concise, specific answers
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a GCSE education expert and quiz generator. Generate high-quality, curriculum-aligned questions.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '[]');
    return result.questions || [];
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw new Error('Failed to generate quiz. Please try again.');
  }
}

export async function checkAnswer(
  question: string,
  userAnswer: string,
  correctAnswer: string,
  subject: string,
  topic: string
): Promise<QuizResponse> {
  try {
    const prompt = `
      As a GCSE ${subject} expert, evaluate this student's answer:
      
      Question: ${question}
      Correct Answer: ${correctAnswer}
      Student's Answer: ${userAnswer}
      Topic: ${topic}

      Provide:
      1. Whether the answer is correct (true/false)
      2. Brief, encouraging feedback
      3. A concise explanation if needed

      Format response as JSON:
      {
        "feedback": "string",
        "isCorrect": boolean,
        "explanation": "string"
      }
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a supportive GCSE teacher providing constructive feedback.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 500,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      feedback: result.feedback || 'No feedback available',
      isCorrect: result.isCorrect || false,
      explanation: result.explanation || 'No explanation available'
    };
  } catch (error) {
    console.error('Error checking answer:', error);
    throw new Error('Failed to check answer. Please try again.');
  }
}
