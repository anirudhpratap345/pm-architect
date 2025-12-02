# PM Architect: API Response Examples

## Exact Response Structure After Comparing Two Tech Stacks

When you compare two technologies (e.g., "Firebase vs Supabase"), here's the **exact JSON response** you receive:

---

## 📋 Complete Response Structure

### **POST `/api/orchestrator/compare`**

**Request:**
```json
{
  "query": "compare firebase and supabase on the level of infra cost",
  "options": ["Firebase", "Supabase"],
  "metrics": [],
  "context": {}
}
```

**Response (Full Structure):**
```json
{
  "id": "b6dd30f7-e97f-44c2-9fdf-e4a84a174fdf",
  "task_id": "b6dd30f7-e97f-44c2-9fdf-e4a84a174fdf",
  "timestamp": 1762018058,
  "query": "compare firebase and supabase on the level of infra cost",
  "left": "Firebase",
  "right": "Supabase",
  "metrics": {
    "Performance": {
      "A": 85,
      "B": 78,
      "delta": "+9%"
    },
    "Ease of Use": {
      "A": 90,
      "B": 85,
      "delta": "+6%"
    },
    "Community Support": {
      "A": 95,
      "B": 80,
      "delta": "+19%"
    },
    "Cost": {
      "A": 3.5,
      "B": 2.8,
      "delta": "-20%"
    }
  },
  "summary": "Firebase offers better performance and ecosystem support, while Supabase provides lower operational costs. Consider Firebase for high-throughput scenarios.",
  "confidence": "high",
  "evidence": [
    "Firebase has proven scalability in production environments",
    "Supabase shows consistent performance under moderate loads",
    "Both options are actively maintained with regular updates"
  ],
  "context": {}
}
```

---

## 🔍 Detailed Field Breakdown

### **Top-Level Fields:**

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | `string` | Unique comparison ID (UUID) | `"b6dd30f7-e97f-44c2-9fdf-e4a84a174fdf"` |
| `task_id` | `string` | Same as `id` (for backward compatibility) | Same as above |
| `timestamp` | `number` | Unix timestamp when comparison was made | `1762018058` |
| `query` | `string` | Original user query/prompt | `"compare firebase and supabase on the level of infra cost"` |
| `left` | `string` | Option A name (normalized) | `"Firebase"` |
| `right` | `string` | Option B name (normalized) | `"Supabase"` |
| `metrics` | `object` | Dictionary of metrics (see below) | See structure below |
| `summary` | `string` | AI-generated recommendation (2-3 sentences) | `"Firebase offers better..."` |
| `confidence` | `string` | Confidence level: `"high"`, `"medium"`, or `"low"` | `"high"` |
| `evidence` | `array<string>` | List of factual evidence points | `["Firebase has proven...", ...]` |
| `context` | `object` | Additional context passed in request | `{}` |

### **Metrics Object Structure:**

The `metrics` field is a **dictionary** where:
- **Key** = Metric name (e.g., "Performance", "Cost", "Ease of Use")
- **Value** = Object with scores for both options

```json
{
  "Performance": {
    "A": 85,        // Score for Option A (0-100)
    "B": 78,        // Score for Option B (0-100)
    "delta": "+9%"  // Difference (can be percentage or absolute)
  },
  "Cost": {
    "A": 3.5,
    "B": 2.8,
    "delta": "-20%"
  }
}
```

**Note:** The backend normalizes the LLM's array response into this dictionary format for frontend compatibility.

---

## 🎨 Enhanced Response (With Detailed Explanations)

**When using the new enhanced prompt** (with `explanation`, `A_reason`, `B_reason`), the LLM returns metrics in **array format** with additional fields:

```json
{
  "left": "Firebase",
  "right": "Supabase",
  "metrics": [
    {
      "name": "Performance",
      "A": 85,
      "B": 78,
      "delta": "+9%",
      "explanation": "How fast and efficient the technology handles workloads",
      "A_reason": "Firebase demonstrates strong performance in benchmark tests with optimized caching.",
      "B_reason": "Supabase shows good performance but slightly lower throughput under heavy load."
    },
    {
      "name": "Ease of Use",
      "A": 90,
      "B": 85,
      "delta": "+6%",
      "explanation": "How quickly developers can learn and become productive",
      "A_reason": "Firebase has intuitive APIs and excellent documentation making onboarding smooth.",
      "B_reason": "Supabase is developer-friendly with good docs, though slightly steeper learning curve."
    },
    {
      "name": "Community Support",
      "A": 95,
      "B": 80,
      "delta": "+19%",
      "explanation": "Size and activity of the community, available resources",
      "A_reason": "Firebase benefits from a large, active community with extensive third-party resources.",
      "B_reason": "Supabase has solid community support but smaller ecosystem compared to competitors."
    },
    {
      "name": "Cost",
      "A": 3.5,
      "B": 2.8,
      "delta": "-20%",
      "explanation": "Total cost of ownership including hosting and operational expenses",
      "A_reason": "Firebase has moderate pricing with some premium features requiring paid tiers.",
      "B_reason": "Supabase offers competitive pricing with generous free tier and lower operational costs."
    }
  ],
  "summary": "Firebase offers better performance and ecosystem support, while Supabase provides lower operational costs. Consider Firebase for high-throughput scenarios.",
  "confidence": "high",
  "evidence": [
    "Firebase has proven scalability in production environments",
    "Supabase shows consistent performance under moderate loads",
    "Both options are actively maintained with regular updates"
  ]
}
```

**The frontend converts this array format to the dictionary format** for backward compatibility with existing `ComparisonResult` component.

---

## 📊 How the Frontend Displays This

### **1. Main Comparison View (`ComparisonResult` component):**
- Shows `left vs right` as title
- Displays `confidence` badge
- Renders `metrics` as a table with scores and deltas
- Shows `evidence` in an accordion
- Displays `summary` as recommendation

### **2. Enhanced Detailed Metrics (`ComparisonMetricRow` component):**
- Shows each metric with:
  - **Metric name** (e.g., "Performance")
  - **General explanation** (always visible): "How fast and efficient the technology handles workloads"
  - **Side-by-side scores**: Firebase (85) | Delta (+9%) | Supabase (78)
  - **Expandable tech-specific reasons**:
    - Firebase: "Firebase demonstrates strong performance in benchmark tests..."
    - Supabase: "Supabase shows good performance but slightly lower throughput..."

### **3. Visualizations:**
- **Performance Bar Chart**: Horizontal bars comparing A vs B scores
- **Balance Radar Chart**: Multi-dimensional comparison across all metrics

---

## 🔄 Response Transformation Flow

```
LLM Response (Array Format)
    ↓
{
  "metrics": [
    {"name": "Performance", "A": 85, "B": 78, "delta": "+9%", ...}
  ]
}
    ↓
Backend Normalization (_normalize_metrics)
    ↓
{
  "metrics": {
    "Performance": {"A": 85, "B": 78, "delta": "+9%"}
  }
}
    ↓
Frontend Receives Response
    ↓
Frontend Converts Back to Array (for new components)
    ↓
{
  "metrics": [
    {"name": "Performance", "A": 85, "B": 78, "delta": "+9%", ...}
  ]
}
    ↓
Rendered in UI
```

---

## 🎯 Real Example: Firebase vs Supabase

**What you see in the browser:**

1. **Header Section:**
   - Title: "Firebase vs Supabase"
   - Confidence Badge: "High Confidence"

2. **Metrics Table:**
   | Metric | Firebase | Supabase | Delta |
   |--------|----------|----------|-------|
   | Performance | 85 | 78 | +9% |
   | Ease of Use | 90 | 85 | +6% |
   | Community Support | 95 | 80 | +19% |
   | Cost | 3.5 | 2.8 | -20% |

3. **Visual Charts:**
   - Performance Bar Chart (horizontal bars)
   - Balance Radar Chart (spider/radar view)

4. **Detailed Metrics Section:**
   - Each metric with:
     - General explanation (always visible)
     - Side-by-side scores
     - Expandable tech-specific reasons

5. **Recommendation Box:**
   - Summary: "Firebase offers better performance and ecosystem support, while Supabase provides lower operational costs..."
   - Confidence: "high"

6. **Evidence Accordion:**
   - "Firebase has proven scalability in production environments"
   - "Supabase shows consistent performance under moderate loads"
   - "Both options are actively maintained with regular updates"

---

## 🔧 Response Variations

### **When LLM Returns Array Format (New):**
```json
{
  "metrics": [
    {"name": "Performance", "A": 85, "B": 78, "explanation": "...", "A_reason": "...", "B_reason": "..."}
  ]
}
```

### **After Backend Normalization:**
```json
{
  "metrics": {
    "Performance": {"A": 85, "B": 78, "delta": "+9%"}
  }
}
```

### **Frontend Re-converts for New Components:**
```json
{
  "metrics": [
    {"name": "Performance", "A": 85, "B": 78, "delta": "+9%", "explanation": "...", "A_reason": "...", "B_reason": "..."}
  ]
}
```

---

## ⚠️ Error Responses

### **JSON Parse Error:**
```json
{
  "id": "...",
  "left": "Firebase",
  "right": "Supabase",
  "metrics": {
    "Overall Score": {"A": 75, "B": 70, "delta": "+7%"}
  },
  "summary": "Comparison generated with fallback data due to parse error: ...",
  "confidence": "low",
  "evidence": ["Generated with fallback due to LLM response parsing error"]
}
```

### **API Error:**
```json
{
  "detail": "Comparison generation failed: <error message>"
}
```
HTTP Status: 500

---

## 📝 Summary

**The response you get is:**
- ✅ **Structured JSON** (not free-form text)
- ✅ **Normalized format** (consistent structure)
- ✅ **Rich metadata** (id, timestamp, confidence)
- ✅ **Evidence-backed** (factual points, not hallucinations)
- ✅ **Explainable** (reasons for each score)
- ✅ **Actionable** (clear recommendation)

**This structure enables:**
- Side-by-side visualization
- Expandable explanations
- Evidence-based decision making
- Historical tracking (saved to `decisions.json`)

