import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code, language } = await request.json();

    if (!code || !language) {
      return NextResponse.json(
        { error: 'Code and language are required' },
        { status: 400 }
      );
    }

    const prompt = `Analyze the time and space complexity of this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Please provide a detailed analysis in the following JSON format:
{
  "timeComplexity": {
    "best": "O(...)",
    "average": "O(...)", 
    "worst": "O(...)",
    "explanation": "Detailed explanation of why this complexity applies, considering all loops, recursive calls, and operations..."
  },
  "spaceComplexity": {
    "complexity": "O(...)",
    "explanation": "Explanation of memory usage including auxiliary space, call stack, and data structures..."
  },
  "analysis": {
    "summary": "Brief overview of the algorithm's performance characteristics and main bottlenecks",
    "optimizations": ["Specific optimization suggestion 1", "Specific optimization suggestion 2", "..."],
    "warnings": ["Potential performance issue 1", "Potential scalability concern 2", "..."],
    "complexityClass": "constant|logarithmic|linear|linearithmic|quadratic|cubic|exponential"
  }
}

Be precise and accurate. Consider all loops, recursive calls, data structures, and algorithmic patterns. Provide actionable optimization suggestions.`;

    const response = await fetch(
      `https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=openai&json=true`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Pollination AI API error: ${response.status}`);
    }

    const responseText = await response.text();
    
    try {
      // The API returns a JSON string, so we need to parse it
      const analysisResult = JSON.parse(responseText);
      return NextResponse.json(analysisResult);
    } catch (parseError) {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysisResult = JSON.parse(jsonMatch[0]);
        return NextResponse.json(analysisResult);
      } else {
        throw new Error('Failed to parse analysis result from AI');
      }
    }
  } catch (error) {
    console.error('Complexity analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze complexity',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Time & Space Complexity Analyzer API',
    description: 'POST your code and language to get complexity analysis',
    usage: {
      method: 'POST',
      body: {
        code: 'string - The code to analyze',
        language: 'string - Programming language (javascript, python, java, etc.)'
      }
    }
  });
}