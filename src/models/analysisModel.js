import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  analysis: String,
  documentId: String,
  contentLength: Number,
  options: {
    validateSummary: Boolean,
    findKeywords: Boolean,
    improvementSuggestions: Boolean
  },
});

const AnalysisModel = mongoose.model('Analysis', analysisSchema);

export { AnalysisModel };
