export interface ArchetypeOption {
  name: string;
  pros: string[];
  cons: string[];
}

export interface Archetype {
  title: string;
  context: string;
  constraints: string[];
  options: ArchetypeOption[];
  recommendation: string;
}

export const archetypes: Archetype[] = [
  {
    title: "Latency-sensitive Model Selection",
    context: "Choosing a model for real-time inference where latency must be <100ms.",
    constraints: ["Latency < 100ms", "Real-time"],
    options: [
      {
        name: "CNN",
        pros: ["Fast inference", "Good for image data"],
        cons: ["Limited for sequential data", "Lower accuracy on text"]
      },
      {
        name: "Transformer",
        pros: ["High accuracy", "Handles sequential data well"],
        cons: ["Slower inference", "Higher compute cost"]
      }
    ],
    recommendation: "Use CNN for strict latency, Transformer if accuracy is critical and latency can be relaxed."
  },
  {
    title: "Cost-sensitive Model Deployment",
    context: "Selecting a model for deployment with a strict cost constraint.",
    constraints: ["Max $10/day", "Cost-sensitive"],
    options: [
      {
        name: "DistilBERT",
        pros: ["Lower compute cost", "Faster than BERT"],
        cons: ["Slightly lower accuracy"]
      },
      {
        name: "BERT",
        pros: ["High accuracy", "Well-studied"],
        cons: ["Expensive to run", "Slower inference"]
      }
    ],
    recommendation: "DistilBERT is recommended for cost-sensitive deployments."
  },
  {
    title: "Explainability vs Performance",
    context: "Choosing between a highly explainable model and a black-box model.",
    constraints: ["Explainability", "Interpretability"],
    options: [
      {
        name: "Decision Tree",
        pros: ["Highly interpretable", "Easy to visualize"],
        cons: ["Lower accuracy on complex data"]
      },
      {
        name: "Neural Network",
        pros: ["High accuracy", "Handles complex data"],
        cons: ["Difficult to interpret", "Black-box"]
      }
    ],
    recommendation: "Use Decision Tree if explainability is required, Neural Network if performance is paramount."
  },
  {
    title: "Scalability for Large Datasets",
    context: "Selecting a model for very large datasets.",
    constraints: ["Scalability", "Large dataset"],
    options: [
      {
        name: "Random Forest",
        pros: ["Scales well", "Robust to overfitting"],
        cons: ["Slower training", "Harder to interpret"]
      },
      {
        name: "XGBoost",
        pros: ["Efficient for large data", "High accuracy"],
        cons: ["Complex tuning", "Resource intensive"]
      }
    ],
    recommendation: "XGBoost is recommended for large-scale data if resources are available."
  }
]; 