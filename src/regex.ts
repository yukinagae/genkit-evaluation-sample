import type { BaseDataPoint, EvaluatorAction, Score } from '@genkit-ai/ai/evaluator'
import { defineEvaluator } from '@genkit-ai/ai/evaluator'
import type { ModelReference } from '@genkit-ai/ai/model'
import { type PluginProvider, genkitPlugin } from '@genkit-ai/core'
import type * as z from 'zod'

export interface PluginOptions<ModelCustomOptions extends z.ZodTypeAny> {
  judge: ModelReference<ModelCustomOptions>
  judgeConfig?: z.infer<ModelCustomOptions>
  metrics?: Array<RegexMetric>
}

export interface RegexMetric {
  name: string
  regex: RegExp
}

export const regexMatcher = (suffix: string, pattern: RegExp): RegexMetric => ({
  name: `REGEX_MATCH_${suffix.toUpperCase()}`,
  regex: pattern,
})

export function byoEval<ModelCustomOptions extends z.ZodTypeAny>(
  params: PluginOptions<ModelCustomOptions>,
): PluginProvider {
  // Define the new plugin
  const plugin = genkitPlugin('byo', async (params: PluginOptions<ModelCustomOptions>) => {
    const { judge, judgeConfig, metrics } = params
    if (!metrics) {
      throw new Error('Found no configured metrics.')
    }
    let evaluators: EvaluatorAction[] = []

    evaluators = [...createRegexEvaluators(metrics)]

    return { evaluators }
  })

  // create the plugin with the passed params
  return plugin(params)
}

export function createRegexEvaluators(metrics: RegexMetric[]): EvaluatorAction[] {
  return metrics.map((metric) => {
    return defineEvaluator(
      {
        name: `byo/${metric.name.toLocaleLowerCase()}`,
        displayName: 'Regex Match',
        definition:
          'Runs the output against a regex and responds with 1 if a match is found and 0 otherwise.',
        isBilled: false,
      },
      async (datapoint: BaseDataPoint) => {
        const score = await regexMatchScore(datapoint, metric.regex)
        // return fillScores(datapoint, score)
        return {
          testCaseId: datapoint.testCaseId,
          evaluation: score,
        }
      },
    )
  })
}

export async function regexMatchScore(d: BaseDataPoint, regex: RegExp): Promise<Score> {
  try {
    if (!d.output || typeof d.output !== 'string') {
      throw new Error('String output is required for regex matching')
    }
    const matches = regex.test(d.output as string)
    const reasoning = matches
      ? `Output matched regex ${regex.source}`
      : `Output did not match regex ${regex.source}`
    return {
      score: matches,
      details: { reasoning },
    }
  } catch (err) {
    console.debug(`BYO regex matcher failed with error ${err} for sample ${JSON.stringify(d)}`)
    throw err
  }
}
