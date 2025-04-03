<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-8">
    <div class="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Code Logic Bug Analyzer</h1>
      
      <!-- Requirements Documents Section -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-700">Requirements Documents</h2>
          <button 
            @click="addRequirementField" 
            class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center"
          >
            <span class="mr-1">+</span>
            Add Document
          </button>
        </div>
        
        <div v-for="(doc, index) in requirementDocs" :key="`req-${index}`" class="mb-4">
          <div class="flex items-start gap-2">
            <div class="flex-grow">
              <label :for="`req-${index}`" class="block text-sm font-medium text-gray-700 mb-1">
                Document {{ index + 1 }}
              </label>
              <textarea 
                :id="`req-${index}`"
                v-model="doc.content"
                rows="4"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Paste your requirements document here..."
              ></textarea>
            </div>
            <button 
              v-if="requirementDocs.length > 1"
              @click="removeRequirementField(index)" 
              class="mt-6 p-1 text-red-500 hover:text-red-700 transition"
            >
              <span class="text-lg">×</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- GitHub Pull Requests Section -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-700">GitHub Pull Requests</h2>
          <button 
            @click="addPrField" 
            class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center"
          >
            <span class="mr-1">+</span>
            Add PR
          </button>
        </div>
        
        <div v-for="(pr, index) in pullRequests" :key="`pr-${index}`" class="mb-4">
          <div class="flex items-start gap-2">
            <div class="flex-grow">
              <label :for="`pr-${index}`" class="block text-sm font-medium text-gray-700 mb-1">
                Pull Request {{ index + 1 }}
              </label>
              <input 
                :id="`pr-${index}`"
                v-model="pr.url"
                type="text"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://github.com/username/repo/pull/123"
              />
            </div>
            <button 
              v-if="pullRequests.length > 1"
              @click="removePrField(index)" 
              class="mt-6 p-1 text-red-500 hover:text-red-700 transition"
            >
              <span class="text-lg">×</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Action Button -->
      <div class="flex justify-center mb-8">
        <button 
          @click="analyzeCode" 
          class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center font-medium"
          :disabled="isAnalyzing"
        >
          {{ isAnalyzing ? 'Analyzing...' : 'Analyze Code' }}
        </button>
      </div>
      
      <!-- Results Section -->
      <div v-if="report" class="border rounded-lg p-4 bg-gray-50">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Analysis Report</h2>
        <div class="prose max-w-none">
          <div v-html="renderedReport"></div>
        </div>
        <div class="mt-4 flex justify-end">
          <button 
            @click="copyReport" 
            class="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition flex items-center"
          >
            Copy Markdown
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { marked } from 'marked';

// State for requirements documents
const requirementDocs = ref([
  { id: 1, content: '' }
]);

// State for GitHub Pull Requests
const pullRequests = ref([
  { id: 1, url: '' }
]);

// State for analysis report
const report = ref('');
const isAnalyzing = ref(false);

// Add a new requirement document field
const addRequirementField = () => {
  const newId = requirementDocs.value.length > 0 
    ? Math.max(...requirementDocs.value.map(doc => doc.id)) + 1 
    : 1;
  requirementDocs.value.push({ id: newId, content: '' });
};

// Remove a requirement document field
const removeRequirementField = (index) => {
  requirementDocs.value.splice(index, 1);
};

// Add a new PR field
const addPrField = () => {
  const newId = pullRequests.value.length > 0 
    ? Math.max(...pullRequests.value.map(pr => pr.id)) + 1 
    : 1;
  pullRequests.value.push({ id: newId, url: '' });
};

// Remove a PR field
const removePrField = (index) => {
  pullRequests.value.splice(index, 1);
};

// Extract PR number and repo from URL
const extractPrInfo = (url) => {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname !== 'github.com') return null;
    
    const pathParts = urlObj.pathname.split('/');
    if (pathParts.length < 5 || pathParts[3] !== 'pull') return null;
    
    return {
      owner: pathParts[1],
      repo: pathParts[2],
      number: pathParts[4]
    };
  } catch (e) {
    return null;
  }
};

// Analyze code and generate report
const analyzeCode = async () => {
  isAnalyzing.value = true;
  
  // Simulate analysis delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate sample report
  const reqSummary = requirementDocs.value
    .filter(doc => doc.content.trim())
    .map((doc, index) => `- Document ${index + 1}: ${doc.content.length} characters`);
  
  const prSummary = pullRequests.value
    .filter(pr => pr.url.trim())
    .map((pr, index) => {
      const prInfo = extractPrInfo(pr.url);
      if (prInfo) {
        return `- [PR #${prInfo.number}](${pr.url}) in ${prInfo.owner}/${prInfo.repo}`;
      } else {
        return `- PR ${index + 1}: ${pr.url}`;
      }
    });
  
  // Generate sample findings
  const findings = [
    {
      title: "Missing Error Handling",
      severity: "High",
      description: "The code does not handle potential errors when processing user input.",
      requirement: "System must gracefully handle all error conditions.",
      location: "PR #123, File: user-service.js, Lines 24-30",
      recommendation: "Implement try-catch blocks around user input processing."
    },
    {
      title: "Incomplete Validation Logic",
      severity: "Medium",
      description: "Input validation is incomplete compared to requirements.",
      requirement: "All user inputs must be validated for type, length, and format.",
      location: "PR #123, File: validation.js, Lines 42-55",
      recommendation: "Add additional validation checks for input format."
    },
    {
      title: "Potential Race Condition",
      severity: "Medium",
      description: "Concurrent operations may lead to race conditions.",
      requirement: "System must handle concurrent user operations safely.",
      location: "PR #124, File: data-service.js, Lines 17-25",
      recommendation: "Implement proper locking mechanism or use atomic operations."
    }
  ];
  
  // Create markdown report
  report.value = `# Code Analysis Report

## Summary
Analysis completed at ${new Date().toLocaleString()}

### Requirements Documents
${reqSummary.length ? reqSummary.join('\n') : '- No requirements provided'}

### Pull Requests Analyzed
${prSummary.length ? prSummary.join('\n') : '- No pull requests provided'}

## Findings

${findings.map(finding => `
### ${finding.title}
- **Severity**: ${finding.severity}
- **Description**: ${finding.description}
- **Requirement Reference**: ${finding.requirement}
- **Location**: ${finding.location}
- **Recommendation**: ${finding.recommendation}
`).join('\n')}

## Conclusion
The analysis identified ${findings.length} potential issues. Please review the findings and implement the recommended changes to improve code quality and alignment with requirements.
`;

  isAnalyzing.value = false;
};

// Render markdown as HTML using marked library
const renderedReport = computed(() => {
  if (!report.value) return '';
  return marked(report.value);
});

// Copy report to clipboard
const copyReport = () => {
  navigator.clipboard.writeText(report.value);
};
</script>

