const fs = require('fs');
const { Client } = require('@gradio/client');

exports.analyzeCropImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const filePath = req.file.path;
    const buffer = fs.readFileSync(filePath);
    const imageBlob = new Blob([buffer]);

    const client = await Client.connect("biswa000/rice");
    const result = await client.predict("/predict", { img: imageBlob });

    fs.unlinkSync(filePath); // clean up uploaded file

    // Actual response structure
    const prediction = result.data?.[0];
    console.log(prediction);
    if (!prediction || !prediction.confidences) {
      return res.status(500).json({ error: 'Invalid response format from model' });
    }

    // Top prediction
    const disease = prediction.label;
    const topConfidence = prediction.confidences.find(c => c.label === disease);
    const confidence = topConfidence ? (topConfidence.confidence * 100).toFixed(2) : 'N/A';

    // Simple recommendation logic
    const recommendationsMap = {
      "Blast": ["Use fungicide", "Reduce nitrogen usage", "Improve drainage"],
      "Brownspot": ["Apply balanced fertilizer", "Ensure clean seed stock"],
      "Leafsmut": ["Improve air circulation", "Apply copper-based fungicide"]
    };

    const recommendations = recommendationsMap[disease] || ["Monitor closely", "Consult agronomist"];

    return res.status(200).json({
      disease,
      confidence,
      recommendations
    });

  } catch (err) {
    console.error("Prediction error:", err);
    return res.status(500).json({ error: 'Prediction failed' });
  }
};
