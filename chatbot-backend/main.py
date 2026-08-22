"""
Trotter AI - Travel Chatbot Backend
FastAPI server with TF-IDF + cosine similarity NLP model
Inspired by the nlp-chatbot.ipynb TensorFlow/NLP architecture.
"""
import sys, io
# Ensure UTF-8 output on Windows (fixes cp1252 emoji errors)
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from train_data import TRAVEL_QA_PAIRS
import random
from datetime import datetime

try:
    import nltk
    from nltk.corpus import stopwords
    from nltk.stem import WordNetLemmatizer
    try:
        nltk.data.find('corpora/stopwords')
        nltk.data.find('corpora/wordnet')
        NLTK_STOP_WORDS = set(stopwords.words('english'))
        NLTK_LEMMATIZER = WordNetLemmatizer()
    except LookupError:
        NLTK_STOP_WORDS = set()
        NLTK_LEMMATIZER = None
except ImportError:
    NLTK_STOP_WORDS = set()
    NLTK_LEMMATIZER = None

# ── NLP Model Class ────────────────────────────────────────────────────────────
class TravelNLPModel:
    """
    TF-IDF + Cosine Similarity based conversational NLP model.
    Architecture inspired by the DL chatbot notebook with sequence-to-sequence
    response retrieval instead of generation (retrieval-based model).
    """

    def __init__(self):
        self.lemmatizer = NLTK_LEMMATIZER
        self.stop_words = NLTK_STOP_WORDS
        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 3),          # unigrams, bigrams, trigrams
            analyzer='word',
            min_df=1,
            max_features=10000,
            sublinear_tf=True,           # log-normalization (like DL normalization layers)
        )
        self.questions: list[str] = []
        self.answers: list[str] = []
        self.tfidf_matrix = None
        self._train()

    def _preprocess(self, text: str) -> str:
        """Normalize and lemmatize text."""
        text = text.lower().strip()
        text = re.sub(r'[^\w\s]', ' ', text)
        text = re.sub(r'\s+', ' ', text)
        tokens = text.split()
        tokens = [t for t in tokens if t not in self.stop_words or len(t) <= 3]
        if self.lemmatizer:
            tokens = [self.lemmatizer.lemmatize(t) for t in tokens]
        return ' '.join(tokens)

    def _train(self):
        """Fit TF-IDF vectorizer on training data."""
        for question, answer in TRAVEL_QA_PAIRS:
            self.questions.append(self._preprocess(question))
            self.answers.append(answer)

        # Build TF-IDF matrix (analogous to embedding layer in DL model)
        self.tfidf_matrix = self.vectorizer.fit_transform(self.questions)
        print(f"[OK] NLP Model trained on {len(self.questions)} Q&A pairs")
        print(f"     Vocabulary size: {len(self.vectorizer.vocabulary_)}")

    def predict(self, user_input: str, threshold: float = 0.10) -> tuple[str, float]:
        """
        Find the best matching answer using cosine similarity.
        Returns (answer, confidence_score).
        """
        processed = self._preprocess(user_input)
        if not processed.strip():
            return self._fallback_response(user_input), 0.0

        # Vectorize the input (like a forward pass)
        query_vec = self.vectorizer.transform([processed])

        # Compute cosine similarity across all training questions
        similarities = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
        best_idx = np.argmax(similarities)
        best_score = float(similarities[best_idx])

        if best_score < threshold:
            return self._fallback_response(user_input), best_score

        return self.answers[best_idx], best_score

    def _fallback_response(self, user_input: str) -> str:
        """Intelligent fallback when confidence is too low."""
        # Check for common travel keywords even if no direct match
        lower = user_input.lower()

        keyword_map = {
            ('beach', 'ocean', 'sea', 'swim'): "For beach destinations, I love recommending: 🏖️ Maldives for luxury, Bali for culture + beach, Santorini for romance, or Phuket for budget fun! Any of these appeal to you?",
            ('mountain', 'hike', 'trek', 'climb'): "Mountain adventures! 🏔️ Top picks: Nepal (Everest Base Camp), New Zealand (Routeburn Track), Peru (Inca Trail), or the Swiss Alps. What level of difficulty are you looking for?",
            ('city', 'urban', 'shopping', 'museum'): "City exploration! 🏙️ World's best cities for travelers: Tokyo, London, Barcelona, New York, Singapore, and Amsterdam. Which region of the world interests you?",
            ('food', 'eat', 'restaurant', 'cuisine', 'dish'): "Foodies unite! 🍜 Best culinary destinations: Tokyo (sushi, ramen), Italy (pasta, pizza), Thailand (street food), Spain (tapas), Mexico (tacos), and India (spices). Where do you want to eat your way around?",
            ('cheap', 'budget', 'affordable', 'cost', 'money'): "Budget travel is very doable! 💰 Best value destinations: Southeast Asia (~$30–50/day), Eastern Europe (~$50–80/day), Mexico (~$40–70/day), and Morocco (~$35–60/day). What's your target daily budget?",
        }

        for keywords, response in keyword_map.items():
            if any(kw in lower for kw in keywords):
                return response

        fallbacks = [
            f"That's an interesting travel query! 🌍 I'm best at answering questions about specific destinations, trip planning, visas, packing, budget tips, and travel safety. Could you rephrase or be more specific?",
            f"Hmm, I'm not sure I caught that. 🤔 I'm Trotter AI and I specialize in travel! Try asking me about a specific destination, 'how to plan a trip', 'best budget destinations', or 'travel safety tips'.",
            f"I want to help you explore the world! 🗺️ Try asking: 'Where should I go in Asia?', 'How much does Bali cost?', 'What to pack for Europe?', or 'Is Thailand safe?'",
        ]
        return random.choice(fallbacks)


# ── FastAPI App ────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Trotter AI — NLP Travel Chatbot",
    description="DL/NLP-powered travel assistant using TF-IDF + cosine similarity",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Initialize Model on Startup ─────────────────────────────────────────────────
print("[*] Initializing Trotter AI NLP Model...")
model = TravelNLPModel()


# ── Request/Response Schemas ───────────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None


class ChatResponse(BaseModel):
    reply: str
    confidence: float
    model: str
    timestamp: str


# ── Routes ─────────────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {
        "status": "online",
        "bot": "Trotter AI",
        "model": "TF-IDF + Cosine Similarity NLP",
        "training_pairs": len(model.questions),
        "vocabulary_size": len(model.vectorizer.vocabulary_),
    }


@app.get("/health")
def health():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    """Main chat endpoint — processes user message and returns AI response."""
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    if len(request.message) > 1000:
        raise HTTPException(status_code=400, detail="Message too long (max 1000 chars)")

    reply, confidence = model.predict(request.message.strip())

    return ChatResponse(
        reply=reply,
        confidence=round(confidence, 4),
        model="TF-IDF + Cosine Similarity (NLP)",
        timestamp=datetime.now().isoformat(),
    )


@app.get("/suggestions")
def get_suggestions():
    """Return suggested starter questions for the chat UI."""
    return {
        "suggestions": [
            "Where should I go for a beach vacation? 🏖️",
            "What's the best time to visit Japan? 🇯🇵",
            "How do I travel on a budget? 💰",
            "What should I pack for Europe? 🎒",
            "Is Bali safe for solo travelers? 🌴",
            "Help me plan a 7-day itinerary 📅",
            "What are visa requirements for Thailand? 🛂",
            "Best honeymoon destinations? 💑",
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
