const mlService = require('../services/ml.service');
const llmService = require('../services/llm.service');
const Prediction = require('../models/Prediction.model');


const createPrediction = async (req, res, next) => {
    try {
        const { cgpa, internships, projects, coding_skills, communication_skills,
                aptitude_test_score, soft_skills_rating, certifications, backlogs,
                gender, degree, branch } = req.body;
        const userId = req.user.id;
        
        const mlResult = await mlService.getPrediction({
            cgpa, internships, projects, coding_skills, communication_skills,
            aptitude_test_score, soft_skills_rating, certifications, backlogs,
            gender, degree, branch
        });

        let explanation = null;
        try {
            explanation = await llmService.explainPrediction(mlResult, req.body);
        } catch (e) { console.warn('LLM unavailable'); }

        const predictionDoc = await Prediction.create({
            userId,
            inputData: { cgpa, internships, projects, coding_skills, communication_skills,
                        aptitude_test_score, soft_skills_rating, certifications, backlogs,
                        gender, degree, branch },
            result: mlResult,
            explanation
        });


        req.io.to(userId.toString()).emit('prediction:complete', {
            predictionId: predictionDoc._id,
            result: mlResult
        });

        res.status(201).json({ 
            success: true, 
            predictionId: predictionDoc._id, 
            data: { 
                result: mlResult, 
                ai_explanation: explanation 
            } 
        });
    } catch (err) { next(err); }
};

module.exports = { createPrediction };
