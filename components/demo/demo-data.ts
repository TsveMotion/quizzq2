export const sampleQuestions = [
  {
    subject: 'Mathematics',
    topic: 'Calculus',
    difficulty: 'Medium',
    question: 'Explain the concept of a derivative and its real-world applications.',
    aiResponse: 'Great explanation! A derivative measures the rate of change of a function at any given point. Let me break down your key points:\n\n1. Basic Concept:\n- The derivative represents the slope of the tangent line at a point\n- It shows how quickly a quantity is changing\n\n2. Real-World Applications:\n- Physics: Calculate velocity (derivative of position) and acceleration (derivative of velocity)\n- Economics: Analyze marginal cost and revenue\n- Engineering: Optimize designs and processes\n\nSuggestion: Try to connect these concepts to everyday scenarios, like how the speedometer in a car shows the derivative of distance with respect to time!',
    aiHints: [
      'Think about how things change over time in the real world',
      'Consider the slope at different points on a curve',
      'Remember that velocity is a real-world example'
    ]
  },
  {
    subject: 'Science',
    topic: 'Biology',
    difficulty: 'Hard',
    question: 'Describe the process of cellular respiration and its importance.',
    aiResponse: 'Excellent work! Let me help you understand cellular respiration better:\n\n1. Process Overview:\n- Glucose + Oxygen → Energy (ATP) + Water + CO2\n- Occurs in three main stages: Glycolysis, Citric Acid Cycle, and Electron Transport Chain\n\n2. Key Points:\n- Happens in mitochondria ("powerhouse" of the cell)\n- Produces 36-38 ATP molecules per glucose molecule\n- Essential for all living organisms\n\nTip: Think of it like a cellular power plant, converting food (glucose) into usable energy (ATP) for the cell!',
    aiHints: [
      'Think about how cells get energy from food',
      'Consider the role of mitochondria',
      'Remember the main products and reactants'
    ]
  },
  {
    subject: 'English',
    topic: 'Literature',
    difficulty: 'Medium',
    question: 'Analyze the theme of ambition in Macbeth.',
    aiResponse: 'Strong analysis! Let\'s explore the theme of ambition in Macbeth:\n\n1. Character Development:\n- Macbeth: Initially honorable, corrupted by ambition\n- Lady Macbeth: Drives the ambition, later consumed by guilt\n\n2. Key Symbols:\n- The crown: Represents power and ambition\n- The dagger: Symbolizes the violent path to power\n\n3. Consequences:\n- Mental deterioration of both main characters\n- Destruction of natural order\n- Ultimate downfall\n\nConsider how Shakespeare shows ambition as both a motivating and destructive force!',
    aiHints: [
      'Look at how ambition affects different characters',
      'Think about the consequences of unchecked ambition',
      'Consider the role of Lady Macbeth'
    ]
  },
  {
    subject: 'History',
    topic: 'World War II',
    difficulty: 'Hard',
    question: 'Analyze the major turning points of World War II.',
    aiResponse: 'Excellent analysis of the turning points! Let\'s break down the key events:\n\n1. Pacific Theater:\n- Pearl Harbor (1941): Brought US into the war\n- Battle of Midway (1942): Shifted naval power in the Pacific\n\n2. European Theater:\n- Battle of Stalingrad (1942-43): Stopped German advance in the East\n- D-Day (1944): Opened the Western Front\n\n3. Technology & Strategy:\n- Code-breaking achievements\n- Development of radar and nuclear weapons\n\nYour understanding of how these events interconnected is particularly good!',
    aiHints: [
      'Consider both the Pacific and European theaters',
      'Think about technological advancements',
      'Remember the role of different allies'
    ]
  },
  {
    subject: 'Geography',
    topic: 'Climate Change',
    difficulty: 'Medium',
    question: 'Explain how climate change affects global weather patterns.',
    aiResponse: 'Great explanation of climate change impacts! Let\'s explore further:\n\n1. Temperature Effects:\n- Rising global temperatures\n- Melting polar ice caps\n- Changing ocean currents\n\n2. Weather Patterns:\n- More extreme weather events\n- Shifting precipitation patterns\n- Changes in seasonal timing\n\n3. Global Impacts:\n- Rising sea levels\n- Ecosystem disruption\n- Agricultural challenges\n\nYour understanding of the interconnected nature of climate systems is spot on!',
    aiHints: [
      'Think about global temperature changes',
      'Consider ocean current effects',
      'Remember impact on ecosystems'
    ]
  }
];

export const sampleQuizzes = {
  Mathematics: {
    Easy: {
      'Multiple Choice': [
        {
          question: "What is 3 + 4?",
          options: ["5", "6", "7", "8"],
          correct: 2
        }
      ],
      'True/False': [
        {
          question: "The sum of angles in a triangle is 180 degrees.",
          options: ["True", "False"],
          correct: 0
        }
      ],
      'Short Answer': [
        {
          question: "Solve: x + 2 = 5",
          answer: "x = 3"
        }
      ]
    },
    Medium: {
      'Multiple Choice': [
        {
          question: "What is 6 x 5?",
          options: ["25", "30", "35", "40"],
          correct: 1
        }
      ],
      'True/False': [
        {
          question: "A square has four equal sides.",
          options: ["True", "False"],
          correct: 0
        }
      ],
      'Short Answer': [
        {
          question: "Solve: 2x = 10",
          answer: "x = 5"
        }
      ]
    },
    Hard: {
      'Multiple Choice': [
        {
          question: "What is 8 + 7?",
          options: ["13", "14", "15", "16"],
          correct: 2
        }
      ],
      'True/False': [
        {
          question: "All rectangles are squares.",
          options: ["True", "False"],
          correct: 1
        }
      ],
      'Short Answer': [
        {
          question: "Solve: 3x + 1 = 16",
          answer: "x = 5"
        }
      ]
    }
  },
  Science: {
    Easy: {
      'Multiple Choice': [
        {
          question: "What is the basic unit of life?",
          options: ["Atom", "Cell", "Molecule", "Tissue"],
          correct: 1
        }
      ]
    },
    Medium: {
      'Multiple Choice': [
        {
          question: "What is the powerhouse of the cell?",
          options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi Body"],
          correct: 1
        }
      ]
    },
    Hard: {
      'Multiple Choice': [
        {
          question: "Which process produces ATP without oxygen?",
          options: ["Photosynthesis", "Cellular Respiration", "Anaerobic Respiration", "Oxidation"],
          correct: 2
        }
      ]
    }
  },
  History: {
    Easy: {
      'Multiple Choice': [
        {
          question: "In which year did World War II end?",
          options: ["1943", "1944", "1945", "1946"],
          correct: 2
        }
      ]
    },
    Medium: {
      'Multiple Choice': [
        {
          question: "Which battle was a major turning point in the Pacific Theater of WWII?",
          options: ["D-Day", "Battle of Midway", "Battle of Britain", "Battle of Stalingrad"],
          correct: 1
        }
      ]
    }
  },
  Geography: {
    Medium: {
      'Multiple Choice': [
        {
          question: "Which is the longest river in the world?",
          options: ["Amazon", "Nile", "Mississippi", "Yangtze"],
          correct: 1
        }
      ]
    }
  }
};

export const sampleStudyPlans = {
  Mathematics: {
    "1 week": {
      duration: "1 week",
      schedule: [
        {
          day: "Monday",
          tasks: [
            "Review basic concepts (30 mins)",
            "Practice problems (45 mins)",
            "Watch video tutorials (30 mins)"
          ]
        }
      ],
      tips: [
        "Break study sessions into 25-minute blocks",
        "Use active recall techniques",
        "Take short breaks between sessions"
      ]
    },
    "2 weeks": {
      duration: "2 weeks",
      schedule: [
        {
          day: "Monday/Thursday",
          tasks: [
            "Core concept review (45 mins)",
            "Problem solving (60 mins)",
            "Practice quizzes (30 mins)"
          ]
        }
      ],
      tips: [
        "Create summary sheets for each topic",
        "Practice with past exam questions",
        "Use spaced repetition"
      ]
    }
  },
  Science: {
    "2 weeks": {
      duration: "2 weeks",
      schedule: [
        {
          day: "Tuesday",
          tasks: [
            "Read textbook chapters (45 mins)",
            "Create flashcards (30 mins)",
            "Practice quizzes (30 mins)"
          ]
        }
      ],
      tips: [
        "Draw diagrams for complex concepts",
        "Explain topics to others",
        "Connect concepts to real-world examples"
      ]
    }
  },
  History: {
    "1 month": {
      duration: "1 month",
      schedule: [
        {
          day: "Monday/Wednesday",
          tasks: [
            "Read source materials (60 mins)",
            "Create timeline (30 mins)",
            "Write summaries (45 mins)"
          ]
        }
      ],
      tips: [
        "Create detailed timelines",
        "Practice essay writing",
        "Use primary sources"
      ]
    }
  }
};
