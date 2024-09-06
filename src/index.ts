import { generate } from '@genkit-ai/ai'
import { configureGenkit } from '@genkit-ai/core'
// import { GenkitMetric, genkitEval } from '@genkit-ai/evaluator'
import { defineFlow } from '@genkit-ai/flow'
import {
  // VertexAIEvaluationMetricType,
  gemini15Flash,
  // textEmbeddingGecko,
  vertexAI,
} from '@genkit-ai/vertexai'
// import { langchain } from 'genkitx-langchain'
import * as z from 'zod'

import { byoEval } from './regex'
import { regexMatcher } from './regex'

export const URL_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i

configureGenkit({
  plugins: [
    vertexAI({
      location: 'us-central1',
      // evaluation: {
      //   metrics: [
      //     VertexAIEvaluationMetricType.SAFETY,
      //     {
      //       type: VertexAIEvaluationMetricType.ROUGE,
      //       metricSpec: {
      //         rougeType: 'rougeLsum',
      //       },
      //     },
      //   ],
      // },
    }),
    // genkitEval({
    //   judge: gemini15Flash,
    //   metrics: [
    //     GenkitMetric.FAITHFULNESS,
    //     GenkitMetric.ANSWER_RELEVANCY,
    //     GenkitMetric.MALICIOUSNESS,
    //   ],
    //   // GenkitMetric.ANSWER_RELEVANCY requires an embedder
    //   // NOTE: Currently, only Vertex AI supports textEmbeddingGecko.
    //   embedder: textEmbeddingGecko,
    // }),
    // langchain({
    //   evaluators: {
    //     judge: gemini15Flash,
    //     criteria: [
    //       // 'harmfulness',
    //       // 'maliciousness',
    //       'exact_match',
    //     ],
    //   },
    // }),
    byoEval({
      judge: gemini15Flash,
      // judgeConfig: PERMISSIVE_SAFETY_SETTINGS,
      metrics: [
        // regexMatcher will register an evaluator with a name in the format
        // byo/regex_match_{suffix}. In this case, byo/regex_match_url
        regexMatcher('url', URL_REGEX),
      ],
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
})

export const menuSuggestionFlow = defineFlow(
  {
    name: 'menuSuggestionFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (subject) => {
    const llmResponse = await generate({
      prompt: `Suggest an item for the menu of a ${subject} themed restaurant`,
      model: gemini15Flash,
      config: {
        temperature: 1,
      },
    })

    return llmResponse.text()
  },
)
