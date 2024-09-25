// QuizContainer.jsx

import React, { useState } from 'react';
import Question from './Question';
import ConsentModal from './ConsentModal';
import ProgressBar from './ProgressBar';
// import { saveQuizResponse } from './apiService'; // Uncomment if you have an API service
import { Card, CardHeader, CardTitle, CardContent } from './card'; // Adjust the import path as needed

const QuizContainer = () => {
  // State variables
  const [showConsentModal, setShowConsentModal] = useState(true);
  const [setConsentGiven] = useState(false);
  // const [consentGiven, setConsentGiven] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizResponses, setQuizResponses] = useState({
    subGenres: [],
    pacing: '',
    endingStyle: '',
    preferredTropes: [],
    preferredThemes: [],
    protagonistTypes: [],
    antagonistTypes: [],
    preferredSettings: [],
    atmosphere: [],
    emotionalImpact: [],
    narrativeStyles: [],
    plotComplexity: '',
    culturalInterests: [],
    contentWarnings: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recommendations, setRecommendations] = useState(null); // Changed to null

  // Replace with actual user ID logic
  // const userId = 'user123';

  // Handle user consent
  const handleConsent = (consent) => {
    setConsentGiven(consent);
    setShowConsentModal(false);
  };

  // Handle answer selection
  const handleAnswerSelection = (questionId, answers) => {
    setQuizResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: answers,
    }));
  };

  // Navigate to the next question or submit
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      handleSubmit();
    }
  };

  // Navigate to the previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  // Submit quiz responses
  const handleSubmit = async () => {
    // Front-end validation
    const unansweredQuestions = questions.filter(
      (q) => !quizResponses[q.id] || quizResponses[q.id].length === 0
    );

    if (unansweredQuestions.length > 0) {
      alert('Please answer all questions before submitting.');
      return;
    }

    try {
      setIsSubmitting(true);
      // 'http://127.0.0.1:3000/quiz'
      // Send the quizResponses to the backend
      // const response = await fetch('https://your-api-endpoint.com/quiz', {
      const response = await fetch('https://k67t787b4l.execute-api.us-west-1.amazonaws.com/Prod/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quizResponses }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // Parse the recommendations
      const recommendationsData = JSON.parse(data.recommendations);

      // Set the recommendations state
      setRecommendations(recommendationsData.recommendations);

      // Optionally save the quiz data if consent is given
      // if (consentGiven) {
      //   const quizData = {
      //     user_id: userId,
      //     consent_given: consentGiven,
      //     responses: quizResponses,
      //   };
      //   await saveQuizResponse(quizData);
      // }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quiz questions
  const questions = [
    // Sub-genres and Tropes
    {
      id: 'subGenres',
      questionText: 'Which horror sub-genres are you most drawn to?',
      options: [
        'Psychological Horror',
        'Supernatural Horror',
        'Cosmic Horror',
        'Gothic Horror',
        'Splatterpunk',
        'Horror Comedy',
        'Folk Horror',
        'Survival Horror',
        'Paranormal Romance',
        'Dark Fantasy',
        'Body Horror',
        'Weird Fiction',
      ],
      type: 'multiple',
    },
    {
      id: 'preferredTropes',
      questionText: 'Which horror tropes excite you the most?',
      options: [
        'Haunted Houses',
        'Cursed Objects',
        'Demonic Possession',
        'Lovecraftian Entities',
        'Zombies and Undead',
        'Vampires and Werewolves',
        'Witchcraft and Occult',
        'Serial Killers',
        'Apocalyptic Scenarios',
        'Doppelgängers',
        'Cults and Secret Societies',
        'Time Loops',
      ],
      type: 'multiple',
    },
    // Themes and Motifs
    {
      id: 'preferredThemes',
      questionText: 'What themes do you find most compelling in horror stories?',
      options: [
        'Isolation and Loneliness',
        'Madness and Insanity',
        'Revenge',
        'The Unknown and Unknowable',
        'Forbidden Knowledge',
        'Human Evil',
        'Loss of Identity',
        'Survival Against Odds',
        'Moral Ambiguity',
        'Fear of Technology',
        'Corruption and Decay',
        'Fate vs. Free Will',
      ],
      type: 'multiple',
    },
    // Character Preferences
    {
      id: 'protagonistTypes',
      questionText: 'Which types of protagonists do you enjoy reading about?',
      options: [
        'Reluctant Heroes',
        'Anti-Heroes',
        'Unreliable Narrators',
        'Everyday People in Extraordinary Situations',
        'Children or Teenagers',
        'Investigators or Detectives',
        'Supernatural Beings',
        'Tragic Figures',
        'Survivors',
        'Outsiders or Misfits',
      ],
      type: 'multiple',
    },
    {
      id: 'antagonistTypes',
      questionText: 'What types of antagonists intrigue you the most?',
      options: [
        'Supernatural Creatures',
        'Serial Killers',
        'Ghosts and Spirits',
        'Demons and Devils',
        'Corrupt Authorities',
        'Monsters from Folklore',
        'Psychological Villains',
        'Alien Entities',
        'Cursed Individuals',
        'Environmental Threats',
      ],
      type: 'multiple',
    },
    // Settings and Atmosphere
    {
      id: 'preferredSettings',
      questionText: 'Which settings do you prefer in horror stories?',
      options: [
        'Abandoned Buildings',
        'Rural Villages',
        'Urban Environments',
        'Forests and Wilderness',
        'Historical Settings',
        'Dystopian Futures',
        'Remote Islands',
        'Arctic or Desert Landscapes',
        'Alternate Dimensions',
        'Underwater or Maritime Settings',
      ],
      type: 'multiple',
    },
    {
      id: 'atmosphere',
      questionText: 'What kind of atmosphere do you enjoy?',
      options: [
        'Eerie and Subtle',
        'Dark and Gritty',
        'Claustrophobic and Intense',
        'Mysterious and Enigmatic',
        'Fast-Paced and Thrilling',
        'Slow-Burning Tension',
        'Dreamlike and Surreal',
        'Bleak and Hopeless',
        'Violent and Graphic',
        'Satirical or Parodic',
      ],
      type: 'multiple',
    },
    // Emotional Impact
    {
      id: 'emotionalImpact',
      questionText: 'What emotional experiences are you seeking from horror books?',
      options: [
        'Suspense and Tension',
        'Shock and Surprise',
        'Psychological Unease',
        'Fear and Dread',
        'Empathy and Compassion',
        'Catharsis and Relief',
        'Intellectual Stimulation',
        'Existential Reflection',
        'Disgust and Revulsion',
        'Dark Humor',
      ],
      type: 'multiple',
    },
    // Story Structure and Narrative Style
    {
      id: 'narrativeStyles',
      questionText: 'Which narrative styles do you prefer?',
      options: [
        'First-Person Perspective',
        'Multiple POVs',
        'Unreliable Narrator',
        'Non-linear Storytelling',
        'Epistolary Format (e.g., diaries, letters)',
        'Stream of Consciousness',
        'Minimalist Prose',
        'Rich, Descriptive Language',
        'Dialogue-Driven',
        'Experimental Structures',
      ],
      type: 'multiple',
    },
    {
      id: 'plotComplexity',
      questionText: 'How important is plot complexity to you?',
      options: [
        'I prefer simple, straightforward plots.',
        'I enjoy moderately complex stories.',
        'I love intricate and layered narratives.',
      ],
      type: 'single',
    },
    // Cultural and Mythological Interests
    {
      id: 'culturalInterests',
      questionText:
        'Are you interested in horror stories based on specific cultures or mythologies?',
      options: [
        'Japanese Folklore',
        'African Mythology',
        'Norse Legends',
        'Indigenous Tales',
        'Middle Eastern Lore',
        'Celtic Myths',
        'South American Myths',
        'Eastern European Folklore',
        'Ancient Greek and Roman Myths',
        'Not in Particular',
        'Open to all cultures',
      ],
      type: 'multiple',
    },
    // Content Sensitivities
    {
      id: 'contentWarnings',
      questionText: "Are there any content elements you'd prefer to avoid?",
      options: [
        'Extreme Violence and Gore',
        'Sexual Violence',
        'Animal Harm',
        'Child Harm',
        'Self-Harm',
        'Torture',
        'Graphic Sexual Content',
        'Substance Abuse',
        'None of the Above',
      ],
      type: 'multiple',
    },
  ];

  // Render consent modal if needed
  if (showConsentModal) {
    return <ConsentModal onConsent={handleConsent} />;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="cosmic-horror-background relative min-h-screen flex items-center justify-center p-4">
      {/* Floating eldritch symbols */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute text-pink-500/20 animate-float"
            style={{
              fontSize: `${Math.random() * 14 + 8}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 15 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          >
            {['◯', '◭', '△', '▽', '◬', '⛦', '⛥'][Math.floor(Math.random() * 7)]}
          </div>
        ))}
      </div>

      <Card className="bg-gradient-to-b from-gray-800 to-gray-900 p-8 rounded-lg shadow-lg z-10 relative max-w-3xl w-full">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center text-pink-500 mb-6 drop-shadow-lg">
            Discover Your Horror Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* If recommendations are available, display them */}
          {recommendations ? (
            <div className="recommendations text-white">
              <h2 className="text-2xl font-bold mb-4">Your Personalized Recommendations:</h2>
              <ul>
                {recommendations.map((book, index) => (
                  <li key={index} className="mb-6">
                    <h3 className="text-xl font-semibold">{book.title}</h3>
                    <p className="italic">by {book.author}</p>
                    <p>{book.description}</p>
                  </li>
                ))}
              </ul>
              <button
                className="mt-6 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded"
                onClick={() => {
                  // Reset the quiz to allow the user to retake it
                  setQuizResponses({
                    subGenres: [],
                    pacing: '',
                    endingStyle: '',
                    preferredTropes: [],
                    preferredThemes: [],
                    protagonistTypes: [],
                    antagonistTypes: [],
                    preferredSettings: [],
                    atmosphere: [],
                    emotionalImpact: [],
                    narrativeStyles: [],
                    plotComplexity: '',
                    culturalInterests: [],
                    contentWarnings: [],
                  });
                  setCurrentQuestionIndex(0);
                  setRecommendations(null);
                }}
              >
                Retake Quiz
              </button>
            </div>
          ) : (
            <>
              <ProgressBar percentage={progressPercentage} />
              <Question
                question={currentQuestion}
                onAnswer={handleAnswerSelection}
                selectedAnswers={quizResponses[currentQuestion.id]}
              />
              <div className="navigation-buttons flex justify-between mt-6">
                {currentQuestionIndex > 0 && (
                  <button
                    className="prev-button bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded"
                    onClick={handlePreviousQuestion}
                  >
                    Previous
                  </button>
                )}
                <button
                  className="next-button bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded"
                  onClick={handleNextQuestion}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : currentQuestionIndex < questions.length - 1 ? 'Next' : 'Submit'}
                </button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizContainer;
